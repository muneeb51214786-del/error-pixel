"""Bounded full-video RIFE processing API.

This worker extracts source frames, runs genuine RIFE midpoint inference,
then muxes the original audio into an MP4. It intentionally enforces limits
until a queued production deployment is configured.
"""
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import torch
from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from PIL import Image

from rife_worker import API_TOKEN, decode_frame, load_model, authorize

app = FastAPI(title="Enhance Error RIFE Video Worker", version="0.2.0")
MAX_UPLOAD = 250 * 1024 * 1024
MAX_DURATION = 60.0
MAX_FRAMES = 1800
MAX_SIDE = 1280


def run(command, timeout=300):
    try:
        result = subprocess.run(command, capture_output=True, text=True, timeout=timeout)
    except subprocess.TimeoutExpired as exc:
        raise HTTPException(504, "Video processing timed out.") from exc
    if result.returncode:
        raise HTTPException(422, (result.stderr or result.stdout or "FFmpeg failed")[-2000:])
    return result.stdout


def probe(path):
    import json
    raw = run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)])
    data = json.loads(raw)
    video = next((s for s in data.get("streams", []) if s.get("codec_type") == "video"), None)
    if not video:
        raise HTTPException(415, "Uploaded file has no video stream.")
    duration = float(data.get("format", {}).get("duration") or video.get("duration") or 0)
    rate = video.get("avg_frame_rate", "0/1").split("/")
    fps = float(rate[0]) / max(float(rate[1]), 1.0)
    if duration <= 0 or duration > MAX_DURATION:
        raise HTTPException(413, "For this initial worker, video duration must be 1–60 seconds.")
    if fps <= 0 or fps > 60:
        raise HTTPException(422, "Source frame rate must be between 1 and 60 FPS.")
    return video, duration, fps


def tensor(frame):
    array = np.asarray(frame.convert("RGB"), dtype=np.float32)
    array = np.transpose(array, (2, 0, 1)) / 255.0
    return torch.from_numpy(array).unsqueeze(0).cuda()


@app.post("/v1/video/rife/2x")
async def interpolate_video(file: UploadFile = File(...), x_api_key: str | None = Header(default=None)):
    authorize(x_api_key)
    if not torch.cuda.is_available():
        raise HTTPException(503, "CUDA GPU is unavailable.")
    suffix = Path(file.filename or "input.mp4").suffix.lower()
    if suffix not in {".mp4", ".mov", ".mkv", ".webm"}:
        raise HTTPException(415, "Supported input formats: MP4, MOV, MKV, WEBM.")
    root = Path(tempfile.mkdtemp(prefix="enhance-error-rife-video-"))
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
    video, duration, fps = probe(source)
    width, height = int(video["width"]), int(video["height"])
    if max(width, height) > MAX_SIDE:
        raise HTTPException(413, "Initial RIFE video worker supports up to 1280 pixels on the longest side.")
    frames_dir = root / "frames"
    frames_dir.mkdir()
    run(["ffmpeg", "-v", "error", "-i", str(source), "-map", "0:v:0", "-vsync", "0",
         str(frames_dir / "%06d.png")], timeout=180)
    frames = sorted(frames_dir.glob("*.png"))
    if len(frames) < 2 or len(frames) > MAX_FRAMES:
        raise HTTPException(413, "Extracted frame count must be between 2 and 1800.")
    model = load_model()
    output_dir = root / "rife_out"
    output_dir.mkdir()
    with torch.inference_mode():
        for index, frame_path in enumerate(frames):
            current = Image.open(frame_path).convert("RGB")
            current.save(output_dir / f"{index * 2:07d}.png")
            if index + 1 < len(frames):
                following = Image.open(frames[index + 1]).convert("RGB")
                if following.size != current.size:
                    raise HTTPException(422, "Variable frame dimensions are not supported.")
                midpoint = model.inference(tensor(current), tensor(following), scale=1.0)
                array = midpoint[0].detach().float().clamp(0, 1).cpu().numpy()
                array = np.transpose(array, (1, 2, 0))
                Image.fromarray((array * 255).round().astype(np.uint8), "RGB").save(
                    output_dir / f"{index * 2 + 1:07d}.png")
    output = root / "enhance-error-rife-2x.mp4"
    run(["ffmpeg", "-v", "error", "-framerate", str(fps * 2), "-i",
         str(output_dir / "%07d.png"), "-i", str(source), "-map", "0:v:0",
         "-map", "1:a?", "-c:v", "libx264", "-preset", "medium",
         "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
         "-shortest", "-movflags", "+faststart", str(output)], timeout=600)

        return FileResponse(str(output), media_type="video/mp4",
                            filename="EnhanceError_RIFE_2x.mp4",
                            background=BackgroundTask(shutil.rmtree, str(root), ignore_errors=True))
    except Exception:
        shutil.rmtree(root, ignore_errors=True)
        raise
