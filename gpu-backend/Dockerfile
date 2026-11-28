FROM gcr.io/deeplearning-platform-release/tf2-gpu.2-6:latest

ENV PYTHONUNBUFFERED=1 \
    TF_CPP_MIN_LOG_LEVEL=2 \
    FILM_SOURCE=/opt/frame-interpolation \
    FILM_MODEL_PATH=/models/film_net/Style/saved_model

RUN apt-get update && apt-get install -y --no-install-recommends git ffmpeg && rm -rf /var/lib/apt/lists/* \
 && git clone --depth 1 https://github.com/google-research/frame-interpolation.git ${FILM_SOURCE}

WORKDIR /app
COPY requirements.txt ./requirements.txt
RUN python -m pip install --no-cache-dir -r requirements.txt
COPY main.py ./main.py
COPY film_video_worker.py ./film_video_worker.py
EXPOSE 8080
CMD ["uvicorn", "film_video_worker:app", "--host", "0.0.0.0", "--port", "8080"]
