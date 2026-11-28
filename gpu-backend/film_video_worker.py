"""Authenticated full-video Google FILM 2x interpolation worker."""
import json
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Optional

import httpx
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from fastapi.responses import FileResponse
from PIL import Image
from starlette.background import BackgroundTask

FILM_SOURCE = Path(os.environ.get("FILM_SOURCE", "/opt/frame-interpolation"))
MODEL_PATH = Path(os.environ.get("FILM_MODEL_PATH", "/models/film_net/Style/saved_model"))
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
MAX_UPLOAD = 250 * 1024 * 1024
MAX_DURATION = 60.0
MAX_FRAMES = 1800
MAX_SIDE = 1280
_model = None

app = FastAPI(title="Enhance Error Google FILM Video Worker", version="0.2.0")


def authorize_user(authorization, apikey):
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise HTTPException(503, "Supabase authentication is not configured on the FILM worker.")
    if apikey != SUPABASE_ANON_KEY or not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "A valid signed-in Supabase user session is required.")
    try:
        response = httpx.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={"apikey": SUPABASE_ANON_KEY, "Authorization": authorization},
            timeout=10.0,
        )
    except httpx.HTTPError as exc:
        raise HTTPException(503, "Supabase authentication service is unavailable.") from exc
    if response.status_code != 200:
        raise HTTPException(401, "Supabase session is invalid or expired; sign in again.")


def run(command, timeout=300):
    try:
        result = subprocess.run(command, capture_output=True, text=True, timeout=timeout)
    except subprocess.TimeoutExpired as exc:
        raise HTTPException(504, "FILM video processing timed out.") from exc
    if result.returncode:
        raise HTTPException(422, (result.stderr or result.stdout or "FFmpeg failed")[-2000:])
    return result.stdout


def probe(path):
    raw = run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)])
    data = json.loads(raw)
    video = next((s for s in data.get("streams", []) if s.get("codec_type") == "video"), None)
    if not video:
        raise HTTPException(415, "Uploaded file has no video stream.")
    duration = float(data.get("format", {}).get("duration") or video.get("duration") or 0)
    rate = video.get("avg_frame_rate", "0/1").split("/")
    fps = float(rate[0]) / max(float(rate[1]), 1.0)
    nominal = video.get("r_frame_rate", "0/1").split("/")
    nominal_fps = float(nominal[0]) / max(float(nominal[1]), 1.0)
    if duration <= 0 or duration > MAX_DURATION:
        raise HTTPException(413, "Video duration must be 1–60 seconds on this initial worker.")
    if fps <= 0 or fps > 60:
        raise HTTPException(422, "Source frame rate must be between 1 and 60 FPS.")
    if nominal_fps > 0 and abs(nominal_fps - fps) > 0.1:
        raise HTTPException(422, "Variable-frame-rate video is not supported by this initial worker.")
    return video, fps


def load_model():
    global _model
    if _model is not None:
        return _model
    if not (MODEL_PATH / "saved_model.pb").is_file():
        raise HTTPException(503, "Google FILM SavedModel is not mounted.")
    if not (FILM_SOURCE / "eval" / "interpolator.py").is_file():
        raise HTTPException(503, "Official Google FILM source is missing.")
    try:
        for device in tf.config.list_physical_devices("GPU"):
            tf.config.experimental.set_memory_growth(device, True)
        import sys
        sys.path.insert(0, str(FILM_SOURCE))
        from eval.interpolator import Interpolator
        _model = Interpolator(model_path=str(MODEL_PATH), align=64)
        return _model
    except Exception as exc:
        raise HTTPException(503, f"Google FILM model could not be loaded: {exc}") from exc


@app.get("/health")
def health():
    gpu_devices = tf.config.list_physical_devices("GPU")
    return {
        "service": "enhance-error-film-video",
        "status": "ready" if gpu_devices and (MODEL_PATH / "saved_model.pb").is_file() and (FILM_SOURCE / "eval" / "interpolator.py").is_file() and SUPABASE_URL and SUPABASE_ANON_KEY else "not_ready",
        "model_weights_present": (MODEL_PATH / "saved_model.pb").is_file(),
        "model_loaded": _model is not None,
        "gpu_devices": [device.name for device in gpu_devices],
        "supabase_auth_configured": bool(SUPABASE_URL and SUPABASE_ANON_KEY),
    }


@app.post("/v1/video/film/2x")
async def interpolate_video(
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(default=None),
    apikey: Optional[str] = Header(default=None),
):
    authorize_user(authorization, apikey)
    suffix = Path(file.filename or "input.mp4").suffix.lower()
    if suffix not in {".mp4", ".mov", ".mkv", ".webm"}:
        raise HTTPException(415, "Supported input formats: MP4, MOV, MKV, WEBM.")
    root = Path(tempfile.mkdtemp(prefix="enhance-error-film-video-"))
    try:
        source = root / ("source" + suffix)
        total = 0
        with source.open("wb") as out:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                total += len(chunk)
                if total > MAX_UPLOAD:
                    raise HTTPException(413, "Maximum upload size is 250 MB.")
                out.write(chunk)

        video, fps = probe(source)
        if max(int(video["width"]), int(video["height"])) > MAX_SIDE:
            raise HTTPException(413, "Longest video side must be 1280 pixels or less.")
        frames_dir = root / "frames"
        frames_dir.mkdir()
        run(["ffmpeg", "-v", "error", "-i", str(source), "-map", "0:v:0", "-vsync", "0",
             str(frames_dir / "%06d.png")], timeout=180)
        frames = sorted(frames_dir.glob("*.png"))
        if len(frames) < 2 or len(frames) > MAX_FRAMES:
            raise HTTPException(413, "Extracted frame count must be between 2 and 1800.")

        model = load_model()
        output_dir = root / "film_out"
        output_dir.mkdir()
        with tf.device("/GPU:0" if tf.config.list_physical_devices("GPU") else "/CPU:0"):
            for index, frame_path in enumerate(frames):
                with Image.open(frame_path) as opened:
                    first = np.asarray(opened.convert("RGB"), dtype=np.float32) / 255.0
                Image.fromarray((first * 255).round().astype(np.uint8), "RGB").save(
                    output_dir / f"{index * 2:07d}.png")
                if index + 1 < len(frames):
                    with Image.open(frames[index + 1]) as opened:
                        second = np.asarray(opened.convert("RGB"), dtype=np.float32) / 255.0
                    if first.shape != second.shape:
                        raise HTTPException(422, "Variable frame dimensions are not supported.")
                    dt = np.full((1,), 0.5, dtype=np.float32)
                    midpoint = model(first[np.newaxis, ...], second[np.newaxis, ...], dt)[0]
                    Image.fromarray((np.clip(midpoint, 0, 1) * 255).round().astype(np.uint8), "RGB").save(
                        output_dir / f"{index * 2 + 1:07d}.png")

        with Image.open(frames[-1]) as opened:
            opened.convert("RGB").save(output_dir / f"{len(frames) * 2 - 1:07d}.png")
        output = root / "EnhanceError_FILM_2x.mp4"
        run(["ffmpeg", "-v", "error", "-framerate", str(fps * 2), "-i",
             str(output_dir / "%07d.png"), "-i", str(source), "-map", "0:v:0",
             "-map", "1:a?", "-c:v", "libx264", "-preset", "medium",
             "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
             "-shortest", "-movflags", "+faststart", str(output)], timeout=600)
        return FileResponse(
            str(output), media_type="video/mp4", filename="EnhanceError_FILM_2x.mp4",
            headers={"X-Source-FPS": str(fps), "X-Output-FPS": str(fps * 2),
                     "X-Output-Frames": str(len(frames) * 2)},
            background=BackgroundTask(shutil.rmtree, str(root), ignore_errors=True)
        )
    except Exception:
        shutil.rmtree(root, ignore_errors=True)
        raise
