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

The repository now contains an Android upload/download method and a Supabase Edge Function proxy.
The mobile app calls `POST /functions/v1/rife-video`; the function forwards the multipart
video to the private GPU worker using a server-side token. The worker token is never placed
inside the APK. The app requires a signed-in Supabase Auth user.

### 1. Deploy the GPU worker

Build and run the container using the commands above. The mounted model directory must
contain the official compatible `flownet.pkl` checkpoint. Confirm that
`GET https://YOUR_GPU_HOST:8081/health` reports CUDA and model weights as ready.
Use TLS/reverse proxy in front of the worker; do not expose the raw container port.

### 2. Configure Supabase secrets and deploy the proxy

From the repository root, after linking the correct Supabase project:

```bash
supabase secrets set RIFE_WORKER_URL=https://YOUR_PRIVATE_GPU_WORKER
supabase secrets set RIFE_WORKER_API_TOKEN=YOUR_LONG_RANDOM_SERVER_SECRET
supabase functions deploy rife-video
```

The worker's `API_TOKEN` and Supabase's `RIFE_WORKER_API_TOKEN` must be identical.
The Supabase Edge Function also requires a valid signed-in Supabase user session.
Enable Email authentication in Supabase Auth if email/password sign-in is being used.
Do not paste service-role keys or worker secrets into the app, GitHub source, or chat.

### 3. Configure the Android build environment

Set these EAS environment variables for the build profile:

- `EXPO_PUBLIC_SUPABASE_URL` — Supabase project URL.
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/publishable key accepted by the
  project's Supabase client configuration.

The publishable/anon key is an app identifier, not a server secret. The app's RIFE
operation requires a signed-in user; create an account or sign in on the Home screen.

### 4. Current RIFE app behavior and limits

- The app's RIFE selection uploads the full video through the authenticated proxy.
- The current worker returns 2x frame interpolation, preserves the source audio, and
  saves the returned MP4 into Movies/Enhance Error.
- Initial worker limits: 250 MB upload, 60 seconds, up to 1,800 source frames, and
  maximum 1280 pixels on the longest side.
- The current RIFE path does not yet apply the app's resolution wheel, denoise,
  stabilization, trim-range, or 4x/8x/16x selections. It explicitly rejects range
  export and non-2x multiplier requests rather than pretending those options ran.
- The Supabase Edge Function is a synchronous proxy. Supabase function execution
  limits may be reached for longer GPU jobs; production release needs a queued job
  API, progress polling, cancellation, quotas, and durable storage.
- The Android native upload/download and the GPU inference have not yet been
  compiled and exercised together on a physical device and NVIDIA GPU.

### 5. Build APK after deployment and tests

```bash
eas build --platform android --profile preview
```

Do not distribute the APK as AI-ready until the worker health check, authenticated
end-to-end video test, audio sync, Gallery save, and Android native build all pass.
