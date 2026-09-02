export interface TelemetrySnapshot {
  timestamp: number;
  stream_title: string;
  chaos_mode: string;
  is_outage: boolean;
  video_playback_failures_pct: number;
  cdn_egress_latency_ms: number;
  drm_handshake_ms: number;
  active_viewers: number;
  buffer_health_sec: number;
  avg_bitrate_mbps: number;
  primary_cdn: string;
  primary_traffic_pct: number;
  secondary_cdn: string;
  secondary_traffic_pct: number;
  status_label: "HEALTHY" | "DEGRADED" | "CRITICAL_OUTAGE" | "RECOVERED" | string;
  status_color: "green" | "yellow" | "red" | "blue" | string;
  latest_log: string;
}

export interface InvestigationResult {
  timestamp: number;
  incident_id?: string | null;
  stream_title: string;
  initial_anomaly_detected: boolean;
  vpf_rate: number;
  cdn_latency_ms: number;
  drm_handshake_ms: number;
  severity: "CRITICAL" | "WARNING" | "HEALTHY" | string;
  root_cause_analysis: string;
  affected_subsystems: string[];
  autonomous_action_taken?: string | null;
  traffic_shift_details: {
    primary_cdn?: string;
    primary_cdn_pct?: number;
    secondary_cdn?: string;
    secondary_cdn_pct?: number;
    [key: string]: any;
  };
  annotation_id?: number | null;
  mttr_seconds: number;
  estimated_subscriber_loss_prevented: string;
  executive_summary: string;
  reasoning_trace: string[];
}

export interface GrafanaHealth {
  connected: boolean;
  instance_url: string;
  prometheus: {
    status: string;
    latency_ms: number;
    datasource: string;
  };
  loki: {
    status: string;
    latency_ms: number;
    datasource: string;
  };
  annotations_enabled: boolean;
}

export interface ChaosState {
  current_mode: string;
  is_outage_active: boolean;
  affected_region: string;
  primary_cdn: string;
  primary_cdn_traffic_pct: number;
  secondary_cdn: string;
  secondary_cdn_traffic_pct: number;
  active_incident_id?: string | null;
  incident_start_time?: number | null;
}
