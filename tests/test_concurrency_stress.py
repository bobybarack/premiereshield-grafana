import pytest
import asyncio
import sys
from pathlib import Path
from httpx import AsyncClient, ASGITransport

# Add backend to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from main import app

@pytest.mark.asyncio
async def test_high_concurrency_load():
    """Simulates 100 concurrent requests across telemetry, chaos state, and Prometheus metrics."""
    transport = ASGITransport(app=app)
    
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        async def fetch_current():
            res = await client.get("/api/telemetry/current")
            assert res.status_code == 200
            return res.status_code

        async def fetch_state():
            res = await client.get("/api/chaos/state")
            assert res.status_code == 200
            return res.status_code

        async def fetch_metrics():
            res = await client.get("/api/telemetry/metrics")
            assert res.status_code == 200
            return res.status_code

        tasks = []
        for i in range(40):
            tasks.append(fetch_current())
            tasks.append(fetch_state())
            tasks.append(fetch_metrics())

        results = await asyncio.gather(*tasks)
        assert len(results) == 120
        assert all(code == 200 for code in results)
