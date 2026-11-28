# Enhance Error — AI Engine Integration

This branch targets the **Enhance Error** application.

## Engine stack and licensing

| Engine | Intended role | License / terms | Integration state |
|---|---|---|---|
| FFmpeg | Decode, encode, scaling, denoise filters, audio/video muxing | LGPL/GPL depending on build configuration and enabled codecs; distribute notices and corresponding source where required | Android Media3 currently performs basic export; FFmpeg worker is not deployed |
| RIFE | AI frame interpolation (genuine intermediate frames) | Check the exact RIFE implementation and model-weight terms before redistribution; do not assume every fork/weight has identical terms | Not installed or running |
| Real-ESRGAN | AI super-resolution | Real-ESRGAN code is BSD-3-Clause; separately verify BasicSR, dependencies, and downloaded model-weight terms | Not installed or running |
| Denoise | Noise reduction | FFmpeg filters can provide non-AI denoise; AI denoise requires a separately licensed model/runtime | UI setting only; not applied by current export |
| Stabilization | Motion stabilization | FFmpeg vid.stab support has its own LGPL terms; requires a compatible FFmpeg build | UI setting only; not applied by current export |
| Topaz Video AI | Commercial alternative | Proprietary commercial product; requires a valid license purchased from Topaz and cannot be bundled or sublicensed by this project | Not included |

## Important deployment boundary

RIFE and Real-ESRGAN are computationally expensive. This Expo Android app does not contain their model weights or an inference runtime. They must run on a compatible GPU worker (or a separately built and tested Android native runtime). A server URL, credentials, model files, and deployment are required before the app can submit jobs and return processed videos.

Never report an AI operation as complete unless the worker returns a real output video. The current Android Media3 export is a real re-encode/resize only; it is not AI upscaling or frame interpolation.

## Required next implementation steps

1. Provision a GPU worker and install pinned RIFE and Real-ESRGAN implementations with their model weights.
2. Build FFmpeg with the required codecs and vid.stab support; publish its exact build configuration and license notices.
3. Expose authenticated upload, job-status, and output-download endpoints.
4. Configure the app with the worker base URL and a short-lived authentication mechanism. Do not commit API keys or service-role secrets.
5. Test real source/output files, FPS metadata, resolution, audio sync, and memory limits on representative Android devices.

## Resolution and frame-rate limits

The UI may offer 144p–16K and 24–960 FPS targets, but selectable values are not proof that a device or worker can render them. The backend must validate source duration, output dimensions, frame rate, GPU memory, storage, and job limits before processing.
