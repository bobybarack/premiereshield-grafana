import time
import asyncio
import httpx
import logging
from typing import Dict, Any, List, Optional
from config import (
    GRAFANA_INSTANCE_URL,
    GRAFANA_TOKEN,
    GRAFANA_PROM_UID,
    GRAFANA_LOKI_UID
)

logger = logging.getLogger("premiereshield.grafana")

class GrafanaCloudClient:
    def __init__(self):
        self.base_url = GRAFANA_INSTANCE_URL
        self.token = GRAFANA_TOKEN
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        self.max_retries = 3
        self.retry_delay_sec = 0.5

    async def _execute_with_retry(self, method: str, url: str, **kwargs) -> httpx.Response:
        """Executes an HTTP request with exponential backoff retries for production resilience."""
        last_exception = None
        for attempt in range(1, self.max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    if method.upper() == "GET":
                        response = await client.get(url, headers=self.headers, **kwargs)
                    elif method.upper() == "POST":
                        response = await client.post(url, headers=self.headers, **kwargs)
                    else:
                        raise ValueError(f"Unsupported HTTP method: {method}")

                    if response.status_code < 500:
                        return response
                    
                    logger.warning(f"Grafana API returned {response.status_code} on attempt {attempt}/{self.max_retries}: {response.text}")
            except (httpx.TimeoutException, httpx.NetworkError, httpx.ConnectError) as e:
                last_exception = e
                logger.warning(f"Grafana network attempt {attempt}/{self.max_retries} failed: {e}")

            if attempt < self.max_retries:
                await asyncio.sleep(self.retry_delay_sec * (2 ** (attempt - 1)))

        if last_exception:
            raise last_exception
        return response

    async def check_health(self) -> Dict[str, Any]:
        """Verifies authentication and lists active datasources."""
        try:
            res = await self._execute_with_retry("GET", f"{self.base_url}/api/datasources")
            if res.status_code == 200:
                datasources = res.json()
                return {
                    "status": "HEALTHY",
                    "connected": True,
                    "instance_url": self.base_url,
                    "datasources_count": len(datasources),
                    "datasources": [{"name": d.get("name"), "type": d.get("type"), "uid": d.get("uid")} for d in datasources]
                }
            return {
                "status": "ERROR",
                "connected": False,
                "status_code": res.status_code,
                "error": res.text
            }
        except Exception as e:
            return {
                "status": "UNREACHABLE",
                "connected": False,
                "error": str(e)
            }

    async def query_prometheus(self, promql: str) -> Dict[str, Any]:
        """Executes a PromQL metric query against Grafana Cloud Prometheus proxy."""
        url = f"{self.base_url}/api/datasources/proxy/uid/{GRAFANA_PROM_UID}/api/v1/query"
        try:
            res = await self._execute_with_retry("GET", url, params={"query": promql})
            if res.status_code == 200:
                return res.json()
            return {"status": "error", "code": res.status_code, "response": res.text}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    async def query_loki_logs(self, logql: str, limit: int = 20) -> Dict[str, Any]:
        """Queries recent error log entries from Grafana Cloud Loki proxy."""
        url = f"{self.base_url}/api/datasources/proxy/uid/{GRAFANA_LOKI_UID}/loki/api/v1/query_range"
        now_ns = int(time.time() * 1e9)
        start_ns = now_ns - int(3600 * 1e9) # 1 hour lookback
        try:
            params = {
                "query": logql,
                "limit": limit,
                "start": start_ns,
                "end": now_ns
            }
            res = await self._execute_with_retry("GET", url, params=params)
            if res.status_code == 200:
                return res.json()
            return {"status": "error", "code": res.status_code, "response": res.text}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    async def push_loki_log(self, stream_labels: Dict[str, str], log_line: str) -> Dict[str, Any]:
        """Pushes structured JSON log streams directly to Grafana Cloud Loki ingestion endpoint."""
        url = f"{self.base_url}/api/datasources/proxy/uid/{GRAFANA_LOKI_UID}/loki/api/v1/push"
        now_ns = str(int(time.time() * 1e9))
        payload = {
            "streams": [
                {
                    "stream": stream_labels,
                    "values": [[now_ns, log_line]]
                }
            ]
        }
        try:
            res = await self._execute_with_retry("POST", url, json=payload)
            return {"status": "success" if res.status_code in [200, 204] else "failed", "code": res.status_code}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    async def create_annotation(self, text: str, tags: Optional[List[str]] = None) -> Dict[str, Any]:
        """Creates a timestamped visual vertical annotation on the Grafana live dashboard."""
        url = f"{self.base_url}/api/annotations"
        payload = {
            "text": text,
            "tags": tags or ["premiereshield", "gemini-sre", "autonomous-fix"],
            "time": int(time.time() * 1000)
        }
        try:
            res = await self._execute_with_retry("POST", url, json=payload)
            if res.status_code in [200, 201]:
                return res.json()
            return {"status": "error", "code": res.status_code, "response": res.text}
        except Exception as e:
            return {"status": "error", "error": str(e)}

# Global client singleton
grafana_client = GrafanaCloudClient()
