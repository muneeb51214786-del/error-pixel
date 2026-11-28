# Enhance Error — RIFE GPU worker

RIFE uses the official ECCV2022-RIFE source in a dedicated CUDA container.
Model checkpoints are mounted separately and are not committed to Git.

## Model source and checkpoint

- Source: https://github.com/hzwer/ECCV2022-RIFE
- The source repository is MIT-licensed. Verify the terms for the exact pretrained checkpoint you download.
- The mounted `RIFE_MODEL_DIR` must contain the compatible `flownet.pkl` file.
- Do not assume a source-code licence automatically covers separately hosted model weights.

## Build

From the repository root:

```bash
docker build -f gpu-backend/Dockerfile.rife -t enhance-error-rife:0.2 ./gpu-backend
```

## Run on an NVIDIA GPU host

The host needs a compatible NVIDIA driver and NVIDIA Container Toolkit. The worker
must be placed behind a trusted HTTPS reverse proxy before mobile access.

```bash
docker run --rm --gpus all \
  -p 8081:8081 \
  -e RIFE_MODEL_DIR=/models/rife \
  -e SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co \
  -e SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY \
  -v /absolute/path/to/rife-weights:/models/rife:ro \
  enhance-error-rife:0.2
```

Do not expose the raw container port over public plain HTTP. Restrict the
reverse proxy to HTTPS and apply upload/time limits.

## API

- `GET /health` — reports CUDA, checkpoint, and service readiness.
- `POST /v1/video/rife/2x` — multipart field `file`; returns an MP4.
- Required headers: `apikey: <SUPABASE_ANON_KEY>` and
  `Authorization: Bearer <SUPABASE_USER_ACCESS_TOKEN>`.

The worker validates the access token against the Supabase Auth
`/auth/v1/user` endpoint. It does not trust a client-supplied user ID and does
not embed a private server token in the APK.

## Android app configuration

Set these EAS environment variables for the Android build:

- `EXPO_PUBLIC_SUPABASE_URL` — Supabase project URL.
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — the anon/publishable key used by `supabase.js`.
- `EXPO_PUBLIC_RIFE_WORKER_URL` — HTTPS base URL of the GPU worker, without
  the endpoint path. The app appends `/v1/video/rife/2x`.

Enable Email authentication in Supabase Auth. The Home screen includes account
creation and sign-in. RIFE processing requires a valid signed-in user session.

## Current processing limits

- MP4, MOV, MKV, and WEBM inputs.
- Maximum upload: 250 MB.
- Maximum duration: 60 seconds.
- Maximum extracted frames: 1,800.
- Maximum longest side: 1,280 pixels.
- Constant-frame-rate sources only.
- Output: 2× frame interpolation; source audio is muxed into the MP4.
- The RIFE path currently does not apply the resolution wheel, AI denoise,
  stabilization, trim-range, or 4×/8×/16× choices. The app rejects unsupported
  range and multiplier selections rather than silently claiming to process them.

## Remaining production work

This is the first synchronous end-to-end integration path, not a production
service yet. Before public release it needs a queued job API, progress polling,
cancellation, per-user quotas, durable storage, concurrency limits, load tests,
and a physical Android + NVIDIA GPU end-to-end test. Supabase or GPU-host request
timeouts may limit longer jobs.

Build an APK only after the GPU health check, authenticated video test, audio
sync, Gallery save, and Android native build all pass:

```bash
eas build --platform android --profile preview
```
