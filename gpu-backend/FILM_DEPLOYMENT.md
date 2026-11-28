# Enhance Error — Google FILM GPU worker

Google FILM is a separate TensorFlow GPU container because its runtime stack
differs from the PyTorch RIFE container.

## Source and model

- Official source: https://github.com/google-research/frame-interpolation
- Source code is Apache-2.0 licensed.
- Download the official TF2 SavedModel from the model links in the upstream README.
- Mount the Style model at `/models/film_net/Style/saved_model`.
- Keep the exact model provenance and licence notices with the deployment.

## Build

From the repository root:

```bash
docker build -f gpu-backend/Dockerfile -t enhance-error-film:0.2 ./gpu-backend
```

## Run on an NVIDIA GPU host

```bash
docker run --rm --gpus all \
  -p 8080:8080 \
  -e FILM_MODEL_PATH=/models/film_net/Style/saved_model \
  -e SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co \
  -e SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY \
  -v /absolute/path/to/pretrained_models/film_net/Style/saved_model:/models/film_net/Style/saved_model:ro \
  enhance-error-film:0.2
```

Place the service behind HTTPS and a trusted reverse proxy. Do not expose the
raw container port over public plain HTTP.

## API

- `GET /health` — checks GPU visibility, model directory, source code, and auth config.
- `POST /v1/video/film/2x` — multipart form field `file`; returns an MP4.
- Required headers: `apikey: <SUPABASE_ANON_KEY>` and
  `Authorization: Bearer <SUPABASE_USER_ACCESS_TOKEN>`.

The worker verifies the access token against Supabase Auth. It produces 2x
interpolation, remuxes the original audio, and returns the measured FPS in
response headers.

## App build variables

Set these GitHub Actions variables/secrets or EAS environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_FILM_WORKER_URL` — HTTPS base URL, without endpoint path.

The app appends `/v1/video/film/2x`. A signed-in Supabase user is required.

## Limits and status

The initial worker is limited to 250 MB, 60 seconds, 1,800 frames, and 1,280
pixels on the longest side. It supports constant-frame-rate sources only and
2x interpolation only. Resolution upscaling, denoise, stabilization, trim
ranges, and 4x/8x/16x are not applied by this worker.

This is an integration implementation, not yet a verified production service.
It still needs a provisioned GPU host, compatible SavedModel, successful health
check, Android build, and physical end-to-end test. A queued job system,
progress/cancellation, quotas, and load testing are required before public use.


## GitHub APK workflow settings

In the repository Settings → Secrets and variables → Actions, configure:

**Variables**
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_RIFE_WORKER_URL`
- `EXPO_PUBLIC_FILM_WORKER_URL`

**Secret**
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

The Android APK workflow reads these names at build time. Without them, the
APK can compile but GPU sign-in and worker requests remain unconfigured.
