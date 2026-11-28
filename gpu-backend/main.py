import base64
import os
import subprocess
import tempfile
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

FILM_SOURCE = Path(os.environ.get("FILM_SOURCE", "/opt/frame-interpolation"))
MODEL_PATH = Path(os.environ.get("FILM_MODEL_PATH", "/models/film_net/Style/saved_model"))
MAX_IMAGE_BYTES = 12 * 1024 * 1024

app = FastAPI(title="Enhance Error GPU AI Backend", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET", "POST"], allow_headers=["*"])

class InterpolateRequest(BaseModel):
    frame_a: str = Field(..., description="Base64-encoded PNG/JPEG frame")
    frame_b: str = Field(..., description="Base64-encoded PNG/JPEG frame")


def decode_image(value: str, target: Path) -> None:
    try:
        raw = base64.b64decode(value, validate=True)
    except Exception as exc:
        raise HTTPException(400, "Frame must be valid base64 image data") from exc
    if not raw or len(raw) > MAX_IMAGE_BYTES:
        raise HTTPException(413, "Each frame must be between 1 byte and 12 MB")
    target.write_bytes(raw)
    try:
        from PIL import Image
        with Image.open(target) as image:
            image.verify()
    except Exception as exc:
        target.unlink(missing_ok=True)
        raise HTTPException(415, "Frame is not a supported PNG/JPEG image") from exc

@app.get("/health")
def health():
    return {"service": "enhance-error-gpu", "status": "ready", "engine": "Google FILM", "model_ready": MODEL_PATH.is_dir()}

@app.post("/v1/interpolate/film")
def interpolate(req: InterpolateRequest):
    if not MODEL_PATH.is_dir():
        raise HTTPException(503, "FILM model is not mounted. Mount the official Google FILM Style SavedModel at FILM_MODEL_PATH.")
    evaluator = FILM_SOURCE / "eval" / "interpolator_test.py"
    if not evaluator.is_file():
        raise HTTPException(503, "Google FILM source is missing from the container")
    with tempfile.TemporaryDirectory(prefix="enhance-error-film-") as folder:
        root = Path(folder)
        first, second, output = root / "a.png", root / "b.png", root / "middle.png"
        decode_image(req.frame_a, first)
        decode_image(req.frame_b, second)
        command = ["python", str(evaluator), f"--frame1={first}", f"--frame2={second}", f"--model_path={MODEL_PATH}", f"--output_frame={output}"]
        try:
            result = subprocess.run(command, cwd=str(FILM_SOURCE), capture_output=True, text=True, timeout=180)
        except subprocess.TimeoutExpired as exc:
            raise HTTPException(504, "FILM inference timed out") from exc
        if result.returncode != 0 or not output.is_file():
            detail = (result.stderr or result.stdout or "FILM inference failed")[-2500:]
            raise HTTPException(500, detail)
        encoded = base64.b64encode(output.read_bytes()).decode("ascii")
        return {"engine": "Google FILM", "timestep": 0.5, "image_mime": "image/png", "frame": encoded}
