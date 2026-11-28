# Enhance Error — RIFE GPU worker

This is a dedicated NVIDIA CUDA worker for real RIFE midpoint-frame inference.
It is separate from the existing Google FILM worker because the two projects
have different Python/CUDA dependency stacks.

## Build

From the repository root:

```bash
docker build -f gpu-backend/Dockerfile.rife -t enhance-error-rife:0.1 ./gpu-backend
```

## Model weights

The official ECCV2022-RIFE source is cloned into the image. Pretrained model
weights are intentionally not committed to Git. Obtain a compatible pretrained
RIFE model from the official upstream project and mount the model directory
containing the checkpoint files at `/models/rife`.

Upstream source: https://github.com/hzwer/ECCV2022-RIFE

Check the upstream license and model/checkpoint distribution terms for the
specific release you download. Do not assume that a source-code license
automatically grants rights to every separately hosted model weight.

## Run on an NVIDIA GPU host

```bash
docker run --rm --gpus all \
  -p 8081:8081 \
  -e API_TOKEN='REPLACE_WITH_A_LONG_RANDOM_SECRET' \
  -e RIFE_MODEL_DIR=/models/rife \
  -v /absolute/path/to/rife-weights:/models/rife:ro \
  enhance-error-rife:0.1
```

The host must have a compatible NVIDIA driver and NVIDIA Container Toolkit.
Do not expose port 8081 publicly without TLS and a trusted reverse proxy.
Keep API_TOKEN secret; never put it in the mobile app bundle.

## API

- `GET /health` — reports CUDA and model-weight readiness.
- `POST /v1/interpolate/rife` — authenticated midpoint inference.
  Send `X-API-Key: <API_TOKEN>` and JSON with `frame_a`, `frame_b`
  (base64 PNG/JPEG) and optional `scale` (0.25–2.0).

The worker rejects missing GPU/weights, mismatched frames, oversized input,
and invalid credentials. It never substitutes a blended frame.

## Current integration boundary

This worker provides a real RIFE inference endpoint, but it is not yet connected
to Android video decoding, frame batching, audio-preserving muxing, or the app's
export action. A production app integration must securely call a backend job API
and process the complete video as a queued job; do not embed the API secret in
the APK. The Android RIFE/NCNN/Vulkan on-device path remains separate work.


## Full-video 2x endpoint (initial bounded implementation)

The RIFE container now starts `rife_video_worker:app`. It exposes:

- `POST /v1/video/rife/2x` as multipart form field `file`
- Header: `X-API-Key: <API_TOKEN>`
- Returns an MP4 file with inferred midpoint frames and the source audio stream muxed back in.

This first implementation is deliberately bounded: MP4/MOV/MKV/WEBM, maximum 250 MB,
60 seconds, 1,800 decoded frames, and 1280 pixels on the longest side. It processes
synchronously and is intended for controlled testing, not public production traffic.
A production release still needs queued jobs, progress/cancellation, per-user
authentication and quotas, durable object storage, and deployment behind TLS.

Build and run commands above remain the same. The Android app export button is
not yet connected to this endpoint, and the endpoint has not yet been tested on
a provisioned NVIDIA GPU with the selected checkpoint. Do not advertise RIFE as
available in the APK until those tests pass.


## Enhance Error app connection

The Android native module now uploads a selected video directly to the private
RIFE GPU worker over HTTPS, sends the Supabase anon/publishable key plus the
user's Supabase access token, receives the rendered MP4, and saves it into
Movies/Enhance Error. The GPU worker validates the access token against the
Supabase Auth `/auth/v1/user` endpoint. The worker's private API token is not
embedded in the APK and is not used by the mobile endpoint.

### 1. Deploy the GPU worker

Build the container:

```bash
docker build -f gpu-backend/Dockerfile.rife -t enhance-error-rife:0.2 ./gpu-backend
```

Run it on a host with a compatible NVIDIA GPU, NVIDIA Container Toolkit, and
a mounted official checkpoint directory containing `flownet.pkl`:

```bash
docker run --rm --gpus all \
  -p 8081:8081 \
  -e RIFE_MODEL_DIR=/models/rife \
  -e SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co \
  -e SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY \
  -v /absolute/path/to/rife-weights:/models/rife:ro \
  enhance-error-rife:0.2
```

Put the worker behind HTTPS using a trusted reverse proxy. Set upload/time limits
at the proxy too. The worker's `GET /health` should report CUDA and model weights
ready before connecting the app. Do not expose a plain HTTP GPU endpoint to the
mobile app.

### 2. Configure Android EAS environment variables

Set these variables for the EAS build profile:

- `EXPO_PUBLIC_SUPABASE_URL` — Supabase project URL.
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — the anon/publishable key used by
  `supabase.js`.
- `EXPO_PUBLIC_RIFE_WORKER_URL` — HTTPS base URL of the GPU worker, without
  the endpoint path (the app appends `/v1/video/rife/2x`).

Enable Email authentication in Supabase Auth. The Home screen includes account
creation and sign-in. RIFE processing requires a valid signed-in user session.
The anon/publishable key is a public app identifier, not a server secret.

### 3. Current RIFE app behavior and limits

- The RIFE selection uploads the full source video directly to the authenticated
  GPU worker.
- The worker performs genuine RIFE midpoint inference, produces 2x frame
  interpolation, remuxes the source audio, and returns an MP4.
- Android saves the returned MP4 to Movies/Enhance Error and adds it to Recent
  Projects.
- Initial worker limits: 250 MB upload, 60 seconds, up to 1,800 source frames,
  and maximum 1280 pixels on the longest side.
- Current RIFE processing does not apply the app's resolution wheel, denoise,
  stabilization, trim-range, or 4x/8x/16x selections. The app rejects range
  export and non-2x multiplier requests rather than pretending those options ran.
- This is a synchronous first integration. Production release still needs a
  queued job API, progress polling, cancellation, per-user quotas, durable
  storage, and load testing.
- The Android native upload/download and GPU inference have not yet been
  compiled and exercised together on a physical device and NVIDIA GPU.

### 4. Build APK after deployment and tests

```bash
eas build --platform android --profile preview
```

Do not distribute the APK as AI-ready until the GPU health check, authenticated
end-to-end video test, audio sync, Gallery save, and Android native build all pass.
