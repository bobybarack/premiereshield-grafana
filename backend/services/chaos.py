import time
import threading
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class ChaosEvent(BaseModel):
    timestamp: float = Field(default_factory=time.time)
    event_type: str
    description: str
    severity: str # "INFO", "WARNING", "CRITICAL", "RESOLVED"
    details: Dict[str, Any] = Field(default_factory=dict)

class ChaosState(BaseModel):
    current_mode: str = "NORMAL" # "NORMAL", "CDN_OUTAGE", "DRM_TIMEOUT", "ISP_PEERING_DROP", "REMEDIATED"
    is_outage_active: bool = False
    active_incident_id: Optional[str] = None
    affected_region: str = "us-east-2"
    primary_cdn: str = "Fastly Edge POP"
    secondary_cdn: str = "Akamai Cloud CDN"
    primary_cdn_traffic_pct: int = 100
    secondary_cdn_traffic_pct: int = 0
    injected_at: Optional[float] = None
    remediated_at: Optional[float] = None
    remediation_action_applied: Optional[str] = None
    recent_events: List[ChaosEvent] = Field(default_factory=list)

class ChaosStateManager:
    def __init__(self):
        self._lock = threading.RLock()
        self.state = ChaosState()
        self._record_event("SYSTEM_START", "PremiereShield telemetry engine initialized in NORMAL state", "INFO")

    def _record_event(self, event_type: str, description: str, severity: str, details: Optional[Dict[str, Any]] = None):
        event = ChaosEvent(
            timestamp=time.time(),
            event_type=event_type,
            description=description,
            severity=severity,
            details=details or {}
        )
        self.state.recent_events.insert(0, event)
        if len(self.state.recent_events) > 50:
            self.state.recent_events.pop()

    def get_state(self) -> ChaosState:
        with self._lock:
            return self.state.model_copy(deep=True)

    def inject_cdn_outage(self) -> ChaosState:
        """Simulates primary edge CDN transit link collapse at US-East (Thread-Safe)."""
        with self._lock:
            self.state.current_mode = "CDN_OUTAGE"
            self.state.is_outage_active = True
            self.state.injected_at = time.time()
            self.state.remediated_at = None
            self.state.remediation_action_applied = None
            self.state.active_incident_id = f"INC-CDN-{int(time.time())}"
            self.state.primary_cdn_traffic_pct = 100
            self.state.secondary_cdn_traffic_pct = 0
            
            self._record_event(
                "CHAOS_INJECT_CDN_OUTAGE",
                "Simulated transit link collapse on Primary Fastly Edge POP (us-east-2). 502 Bad Gateway storm initiated.",
                "CRITICAL",
                {"target_cdn": "Fastly", "region": "us-east-2", "expected_vpf": "4.85%"}
            )
            return self.state.model_copy(deep=True)

    def inject_drm_timeout(self) -> ChaosState:
        """Simulates DRM licensing token key server timeout (Thread-Safe)."""
        with self._lock:
            self.state.current_mode = "DRM_TIMEOUT"
            self.state.is_outage_active = True
            self.state.injected_at = time.time()
            self.state.remediated_at = None
            self.state.remediation_action_applied = None
            self.state.active_incident_id = f"INC-DRM-{int(time.time())}"
            
            self._record_event(
                "CHAOS_INJECT_DRM_TIMEOUT",
                "Widevine/FairPlay key server token handshake latency exceeded 2000ms. License acquire errors spiking.",
                "CRITICAL",
                {"service": "drm-auth-proxy", "expected_latency": "2450ms"}
            )
            return self.state.model_copy(deep=True)

    def inject_isp_peering_drop(self) -> ChaosState:
        """Simulates major Tier-1 ISP peering congestion (Thread-Safe)."""
        with self._lock:
            self.state.current_mode = "ISP_PEERING_DROP"
            self.state.is_outage_active = True
            self.state.injected_at = time.time()
            self.state.remediated_at = None
            self.state.remediation_action_applied = None
            self.state.active_incident_id = f"INC-ISP-{int(time.time())}"
            
            self._record_event(
                "CHAOS_INJECT_ISP_DROP",
                "Tier-1 transit peering packet loss detected on ASN 3356. Bitrate degraded to 3.2 Mbps.",
                "WARNING",
                {"asn": "3356", "affected_routes": "US-East / Midwest"}
            )
            return self.state.model_copy(deep=True)

    def apply_autonomous_remediation(self, action: str = "SHIFT_TRAFFIC_TO_AKAMAI") -> ChaosState:
        """Applies edge traffic rerouting or DRM proxy failover to resolve outage (Thread-Safe)."""
        with self._lock:
            self.state.current_mode = "REMEDIATED"
            self.state.is_outage_active = False
            self.state.remediated_at = time.time()
            self.state.remediation_action_applied = action
            self.state.primary_cdn_traffic_pct = 20
            self.state.secondary_cdn_traffic_pct = 80
            
            self._record_event(
                "AGENT_REMEDIATION_APPLIED",
                f"Autonomous SRE Agent executed failover: {action}. Shifted 80% egress traffic to secondary CDN.",
                "RESOLVED",
                {"action": action, "primary_traffic": "20%", "secondary_traffic": "80%"}
            )
            return self.state.model_copy(deep=True)

    def reset_to_normal(self) -> ChaosState:
        """Restores healthy baseline operation (Thread-Safe)."""
        with self._lock:
            self.state.current_mode = "NORMAL"
            self.state.is_outage_active = False
            self.state.active_incident_id = None
            self.state.injected_at = None
            self.state.remediated_at = None
            self.state.remediation_action_applied = None
            self.state.primary_cdn_traffic_pct = 100
            self.state.secondary_cdn_traffic_pct = 0
            
            self._record_event(
                "CHAOS_RESET",
                "Telemetry reset to baseline normal state. All systems operational.",
                "INFO"
            )
            return self.state.model_copy(deep=True)

# Global singleton instance
chaos_manager = ChaosStateManager()
