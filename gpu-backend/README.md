# Enhance Error GPU backend — Google FILM

This is a containerized inference service for the official Google Research FILM model.

## What it does

- `GET /health` reports whether the model directory is mounted.
- `POST /v1/interpolate/film` accepts two base64-encoded PNG/JPEG frames and returns one genuinely inferred midpoint frame as base64 PNG.
- Requests fail clearly when the model is not installed; the service never substitutes a blended/fake frame.

## Model requirement

The official Google FILM SavedModel is not bundled in this repository. Obtain the pretrained `film_net/Style/saved_model` directory from the official Google Research frame-interpolation project and mount it into the container at `/models/film_net/Style/saved_model`, or set `FILM_MODEL_PATH` to its mounted path. Respect Google's Apache-2.0 license and the model distribution terms.

## Build and run on a compatible NVIDIA GPU host

```bash
docker build -t enhance-error-film ./gpu-backend
docker run --gpus all -p 8080:8080 \
  -v /absolute/path/to/film_net:/models/film_net:ro \
  -e FILM_MODEL_PATH=/models/film_net/Style/saved_model \
  enhance-error-film
```

The base image follows Google's TensorFlow 2.6 GPU environment (CUDA 11.2). Use a host with a compatible NVIDIA driver/runtime. This is not a serverless CPU deployment.

## API

```http
GET /health
POST /v1/interpolate/film
Content-Type: application/json

{"frame_a":"<base64 PNG/JPEG>","frame_b":"<base64 PNG/JPEG>"}
```

Successful response: `engine`, `timestep`, `image_mime`, and `frame` (base64 PNG).

## Security and production deployment

This initial worker is a private-network prototype. Before public deployment, put it behind authenticated API access, request quotas, TLS, upload limits, and a job queue. Do not expose this endpoint publicly without authentication. No cloud GPU instance is provisioned by this repository commit.

## Android / RIFE status

This service does not contain the Android RIFE native module. RIFE requires its own NCNN/Vulkan JNI sources, ABI-specific native libraries, model download/verification, frame decode/encode and audio-preserving mux integration. Those pieces must be built and tested separately before the Android app can advertise RIFE as available.

## Upstream

Google Research FILM: https://github.com/google-research/frame-interpolation (Apache-2.0)
