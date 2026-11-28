#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT}/gpu-backend/.env"
COMPOSE_FILE="${ROOT}/gpu-backend/docker-compose.gpu.yml"

fail() { echo "ERROR: $*" >&2; exit 1; }
info() { echo "[Enhance Error GPU] $*"; }

[[ -f "$ENV_FILE" ]] || fail "Missing gpu-backend/.env. Create it from RIFE_DEPLOYMENT.md; never commit it."
command -v docker >/dev/null 2>&1 || fail "Docker is not installed."
docker compose version >/dev/null 2>&1 || fail "Docker Compose v2 is required."
command -v nvidia-smi >/dev/null 2>&1 || fail "NVIDIA driver tools are missing. Provision an NVIDIA GPU host first."
nvidia-smi >/dev/null 2>&1 || fail "NVIDIA GPU is not visible to the host."
docker info 2>/dev/null | grep -qi 'runtimes:.*nvidia\|nvidia' || info "Docker NVIDIA runtime was not detected in docker info; Compose gpus: all may still work with a recent NVIDIA Container Toolkit."

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

: "${SUPABASE_URL:?SUPABASE_URL is required in gpu-backend/.env}"
: "${SUPABASE_ANON_KEY:?SUPABASE_ANON_KEY is required in gpu-backend/.env}"
: "${RIFE_WEIGHTS_DIR:?RIFE_WEIGHTS_DIR is required in gpu-backend/.env}"
: "${FILM_MODEL_DIR:?FILM_MODEL_DIR is required in gpu-backend/.env}"

[[ -f "${RIFE_WEIGHTS_DIR}/flownet.pkl" ]] || fail "RIFE flownet.pkl not found at ${RIFE_WEIGHTS_DIR}."
[[ -f "${FILM_MODEL_DIR}/saved_model.pb" ]] || fail "Google FILM saved_model.pb not found at ${FILM_MODEL_DIR}."

info "Host GPU:"
nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv || true
info "Building and starting RIFE + Google FILM containers."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up --build -d

check_health() {
  local name="$1" port="$2"
  local response=""
  for attempt in $(seq 1 30); do
    response="$(curl --silent --show-error --max-time 5 "http://127.0.0.1:${port}/health" 2>/dev/null || true)"
    if [[ "$response" == *'"status":"ready"'* ]]; then
      info "$name health: READY"
      return 0
    fi
    sleep 5
  done
  info "$name did not report READY. Last health response: ${response:-no response}"
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" logs --tail=80 "$name" || true
  return 1
}

command -v curl >/dev/null 2>&1 || fail "curl is required for local health checks."
check_health rife 8081
check_health film 8080
info "Both GPU workers report READY. Configure HTTPS reverse proxy before connecting the Android app."
