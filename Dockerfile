# Multi-stage production container for Continuity (FastAPI + Gemini + Grafana Cloud MCP)
FROM python:3.11-slim as production

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080 \
    PYTHONPATH=/app/backend

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy source code and configuration
COPY backend /app/backend
COPY frontend /app/frontend

# Expose standard Cloud Run port
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/ || exit 1

# Start production ASGI server
CMD ["sh", "-c", "exec uvicorn main:app --app-dir /app/backend --host 0.0.0.0 --port ${PORT:-8080}"]
