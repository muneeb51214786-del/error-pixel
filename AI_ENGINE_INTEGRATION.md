# Enhance Error — AI Engine Integration

## Required shared video pipeline

All processing belongs to one project/job and returns one final video. Topaz remains **PENDING** and is excluded from the runnable stack.

1. Decode the source once and inspect its real frame rate, dimensions, duration, scene cuts, and motion.
2. Apply enabled pre-processing stages (denoise and stabilization) only when their runtimes are available.
3. For frame interpolation, support selectable engines:
   - **RIFE** — AI intermediate-frame generation.
   - **Google FILM** — frame interpolation for large motion; can be recursively scheduled for 2x, 4x, 8x, 16x, and 32x temporal expansion where compute and quality allow.
   - **DAIN, CAIN, FLAVR** — optional adapters, only when their exact implementations, weights, and licences are verified.
4. **Selected engine mode:** run the engine the user selected. Do not silently substitute another engine.
5. **Combined mode:** run available interpolation engines against the same source-frame pairs, compare candidate frames using temporal consistency / occlusion checks, and select or blend candidates. Do not blindly run interpolated output through another interpolator; that can create ghosting and artifacts. If an engine is unavailable, report it and continue only if the user allowed fallback.
6. Run Real-ESRGAN spatial upscaling on the temporally generated frames (or on source frames before interpolation only if the tested pipeline profile says so).
7. Encode/mux the final video with FFmpeg, preserving audio sync and reporting the measured output FPS and dimensions.

The 32x setting is a temporal expansion target, not a guarantee of quality or speed. The job must calculate output frame count and reject impossible resource requests before processing.

## Current repository state (verified from this branch)

| Engine | Role | Current status |
|---|---|---|
| Android Media3 VideoEngine | Basic on-device decode/scale/MP4 export | Present; not AI interpolation |
| RIFE | Frame interpolation | Full-video 2x worker + Android upload/download path committed; GPU host, checkpoint, EAS environment, and end-to-end test pending |
| Google FILM | Frame interpolation | Full-video 2x worker + Android upload/download path committed; SavedModel, GPU host, and end-to-end test pending |
| Real-ESRGAN | AI super-resolution | Not installed or running |
| DAIN / CAIN / FLAVR | Additional interpolation adapters | Not installed or running |
| FFmpeg worker | Decode, filters, encode and mux | Not deployed |
| Denoise | Noise reduction | UI control exists; current export does not apply it |
| Stabilization | Motion correction | UI control exists; current export does not apply it |
| Topaz Video AI | Proprietary alternative | **PENDING**; excluded until a valid commercial licence is obtained |

## Runtime and licensing requirements

RIFE now has a committed full-video worker and Android integration path, but it is not active until an NVIDIA GPU host, compatible checkpoint, Supabase settings, and physical end-to-end tests are complete. FILM now has a full-video 2x worker and Android integration path, but its SavedModel and GPU host are not deployed. Real-ESRGAN and the optional interpolation models still require compatible inference runtimes and model weights; they must not be marked active until implemented and tested.

Check the exact source repository, model-weight terms, and dependency licences for every pinned version before redistribution. Do not assume code and checkpoint licences are identical. FFmpeg licensing depends on build flags and enabled codecs; publish the exact build configuration and required notices/source.

Topaz is commercial proprietary software. This project cannot issue, invent, or bundle a Topaz licence.

## Backend contract needed before the app can process a real AI job

- Authenticated upload endpoint accepting the source video and a job manifest.
- Job manifest fields: selected FPS engine or `combined`, target FPS, target dimensions, enabled pre/post-processing stages, and fallback policy.
- Job status endpoint with stage-level progress and clear unavailable/error states.
- Output endpoint returning the actual rendered video and measured metadata.
- GPU worker with pinned model versions, verified weights, memory/duration limits, and reproducible tests.

Never report an AI operation as complete until the worker returns a verified output video. The ordinary Media3 export only re-encodes/resizes; the separate RIFE path is wired for authenticated 2x GPU processing once deployed. Media3 does not perform FILM, Real-ESRGAN, AI denoise, or AI stabilization.

## Resource and output limits

The UI may expose large targets, but selectable values are not proof of capability. Validate source duration, output dimensions, frame count, target FPS, GPU memory, storage, audio sync, and job limits before processing.
