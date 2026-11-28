"""Enhance Error RIFE GPU worker.

Loads the official ECCV2022-RIFE implementation and externally mounted weights.
No frame blending fallback is used: inference fails closed when CUDA or weights
are unavailable.
"""
import base64
import os
import sys
import tempfile
from pathlib import Path
from threading import Lock

import numpy as np
import torch
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field
from PIL import Image

RIFE_SOURCE = Path(os.environ.get("RIFE_SOURCE", "/opt/ECCV2022-RIFE"))
MODEL_DIR = Path(os.environ.get("RIFE_MODEL_DIR", "/models/rife"))
API_TOKEN = os.environ.get("API_TOKEN", "")
MAX_IMAGE_BYTES = 12 * 1024 * 1024
MAX_SIDE = 1920
_model = None
_model_lock = Lock()

app = FastAPI(title="Enhance Error RIFE GPU Worker", version="0.1.0")


class PairRequest(BaseModel):
    frame_a: str = Field(..., description="Base64 PNG/JPEG first frame")
    frame_b: str = Field(..., description="Base64 PNG/JPEG second frame")
    scale: float = Field(1.0, ge=0.25, le=2.0)


def authorize(token: str | None) -> None:
    if not API_TOKEN:
        raise HTTPException(503, "Set API_TOKEN before exposing this worker.")
    if token != API_TOKEN:
        raise HTTPException(401, "Invalid API token.")


def decode_frame(value: str) -> np.ndarray:
    try:
        raw = base64.b64decode(value, validate=True)
    except Exception as exc:
        raise HTTPException(400, "Frame must be valid base64.") from exc
    if not raw or len(raw) > MAX_IMAGE_BYTES:
        raise HTTPException(413, "Each frame must be between 1 byte and 12 MB.")
    try:
        from io import BytesIO
        with Image.open(BytesIO(raw)) as image:
            image = image.convert("RGB")
            if image.width > MAX_SIDE or image.height > MAX_SIDE:
                raise HTTPException(413, "Frame dimensions exceed 1920 pixels per side.")
            return np.asarray(image)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(415, "Frame is not a supported PNG/JPEG image.") from exc


def load_model():
    global _model
    with _model_lock:
        if _model is not None:
            return _model
        if not torch.cuda.is_available():
            raise HTTPException(503, "CUDA GPU is unavailable; RIFE inference requires a supported NVIDIA GPU.")
        if not MODEL_DIR.is_dir() or not any(MODEL_DIR.iterdir()):
            raise HTTPException(503, "RIFE model weights are not mounted in RIFE_MODEL_DIR.")
        if not (RIFE_SOURCE / "model" / "RIFE.py").is_file():
            raise HTTPException(503, "Official RIFE source is missing from RIFE_SOURCE.")
        sys.path.insert(0, str(RIFE_SOURCE))
        try:
            from model.RIFE import Model
            model = Model()
            model.load_model(str(MODEL_DIR), -1)
            model.eval()
            model.device()
            _model = model
            return _model
        except Exception as exc:
            raise HTTPException(503, f"RIFE model could not be loaded: {exc}") from exc


@app.get("/health")
def health():
    return {
        "service": "enhance-error-rife",
        "status": "ready" if torch.cuda.is_available() else "gpu_unavailable",
        "engine": "RIFE",
        "cuda_available": torch.cuda.is_available(),
        "model_weights_present": MODEL_DIR.is_dir() and any(MODEL_DIR.iterdir()) if MODEL_DIR.is_dir() else False,
        "model_loaded": _model is not None,
    }


@app.post("/v1/interpolate/rife")
def interpolate(req: PairRequest, x_api_key: str | None = Header(default=None)):
    authorize(x_api_key)
    first = decode_frame(req.frame_a)
    second = decode_frame(req.frame_b)
    if first.shape != second.shape:
        raise HTTPException(422, "Both input frames must have identical dimensions.")
    try:
        model = load_model()
        def to_tensor(frame):
            array = np.transpose(frame, (2, 0, 1)).astype(np.float32) / 255.0
            return torch.from_numpy(array).unsqueeze(0).cuda()
        with torch.inference_mode():
            output = model.inference(to_tensor(first), to_tensor(second), scale=req.scale)
            output = output[0].detach().float().clamp(0, 1).cpu().numpy()
        output = np.transpose(output, (1, 2, 0))
        image = Image.fromarray((output * 255.0).round().astype(np.uint8), mode="RGB")
        from io import BytesIO
        buffer = BytesIO()
        image.save(buffer, format="PNG", optimize=True)
        encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
        return {"engine": "RIFE", "timestep": 0.5, "image_mime": "image/png", "frame": encoded}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(500, f"RIFE inference failed: {exc}") from exc
