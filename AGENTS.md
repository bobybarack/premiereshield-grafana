# Repository Guidelines: CONTINUITY

> **Autonomous Execution**: Whatever action you can do yourself, do yourself. This includes starting apps, executing test suites, verifying builds, and inspecting runtime outputs before reporting back. Do not prompt the user to run commands you can execute.

## Strict Code Standards: Zero Emojis and Zero AI Slop

1. **No Emojis**: Emojis are strictly prohibited in all source code files, docstrings, inline comments, log formatters, error strings, API responses, test descriptions, and test assertions.
2. **No AI Slop / Verbose Filler**:
   - Comments must explain technical *why* (invariants, concurrency guards, protocol nuances), never restating obvious syntax.
   - Avoid generic AI conversational padding or pseudo-code commentary.
   - Code must be lean, idiomatic, fully typed, and production-hardened.

---

## Project Structure & Module Organization

This repository manages CONTINUITY (Autonomous Stream Continuity Incident Commander):
- `backend/config.py`: Environment configuration and typed secret loader.
- `backend/services/chaos.py`: Thread-safe chaos state machine simulating CDN outages, DRM timeouts, and ISP peering drops.
- `backend/services/telemetry.py`: Real-time streaming QoS calculator with native Prometheus CollectorRegistry exporter.
- `backend/services/grafana_client.py`: Resilient HTTP client for Grafana Cloud Prometheus proxy, Loki log queries, and live dashboard annotations.
- `backend/routes/chaos.py`: REST API endpoints for chaos injection, remediation, and state inspection.
- `backend/routes/telemetry.py`: Real-time Server-Sent Events (SSE) stream (`/api/telemetry/stream`), rolling history, and `/metrics` scrape endpoint.
- `backend/main.py`: FastAPI application server with CORS and router mounts.
- `tests/`: Automated test suite covering unit tests, Prometheus exposition validation, concurrency stress (100+ workers), and live Grafana Cloud integration.

---

## Build, Test, and Development Commands

Run commands from the repository root (`/Users/radebe49/7DAYRUN/premiereshield-grafana`):
- `source .venv/bin/activate`: Activate project virtualenv.
- `.venv/bin/pip install -r backend/requirements.txt`: Install dependencies.
- `.venv/bin/pytest -v tests/`: Execute the entire test suite.
- `.venv/bin/uvicorn main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload`: Launch backend development server.
- `curl http://localhost:8000/api/telemetry/current`: Inspect current telemetry snapshot.
- `curl http://localhost:8000/api/telemetry/metrics`: Inspect Prometheus OpenMetrics scrape output.

---

## Coding Style & Naming Conventions

- **Python**: PEP 8 compliance, 4-space indentation, strict type hints on all function signatures.
- **Pydantic**: Use Pydantic v2 `BaseModel` and `model_dump()` / `model_copy(deep=True)`.
- **Thread Safety**: All mutable singleton states must be guarded with `threading.RLock()` to prevent race conditions during concurrent async requests.
- **Naming**: `snake_case` for functions/variables/modules; `PascalCase` for classes/types; `UPPER_SNAKE_CASE` for constants.
- **Logging**: Use standard Python `logging` with structured formats, never unformatted `print()` in production services.

---

## Testing Guidelines

- **Unit & State Coverage**: Test state machine boundaries, metric jitter bounds, and history caps.
- **Integration Coverage**: Validate all REST endpoints across normal, outage, remediation, and reset lifecycles.
- **Concurrency & Stress**: Execute async concurrency stress tests with at least 100 simultaneous requests to ensure zero deadlocks and zero 500 errors.
- **Live Cloud Boundary Testing**: Validate live HTTPS connectivity against Grafana Cloud without mock bypasses.

---

## Commit & Pull Request Guidelines

- **Commit Format**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- **Secrets Protocol**: Never commit `.env` or credential files. Ensure `.gitignore` guards all local secrets.
