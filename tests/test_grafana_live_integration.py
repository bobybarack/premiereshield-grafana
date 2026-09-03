import pytest
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from services.grafana_client import grafana_client

@pytest.mark.asyncio
async def test_grafana_cloud_live_connection():
    """Verifies live connection and datasource discovery on joyfuljasmine1550.grafana.net."""
    health = await grafana_client.check_health()
    assert health["connected"] is True
    assert health["status"] == "HEALTHY"
    assert health["datasources_count"] >= 5

@pytest.mark.asyncio
async def test_grafana_dashboard_annotation_live():
    """Verifies that the agent can programmatically write annotations to the live Grafana Cloud dashboard."""
    result = await grafana_client.create_annotation(
        text="[Continuity Pytest Verification]: Automated SRE Health Check Succeeded",
        tags=["continuity", "pytest", "automated-check", "sre-agent"]
    )
    assert result is not None
    assert "id" in result or result.get("message") == "Annotation added" or "status" in result
