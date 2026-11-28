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
