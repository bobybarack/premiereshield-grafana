"use client";

import React from "react";
import { CloudIcon, FlashIcon, CheckmarkCircle01Icon, Alert01Icon, Activity01Icon } from "hugeicons-react";
import { DoubleBezelCard } from "./DoubleBezelCard";
import { TelemetrySnapshot } from "../types/telemetry";

interface CdnTrafficVisualizerProps {
  telemetry: TelemetrySnapshot | null;
}

export function CdnTrafficVisualizer({ telemetry }: CdnTrafficVisualizerProps) {
  const primaryPct = telemetry?.primary_traffic_pct ?? 100;
  const secondaryPct = telemetry?.secondary_traffic_pct ?? 0;
  const isOutage = telemetry?.is_outage ?? false;
  const isFailoverActive = secondaryPct > 0;

  return (
    <DoubleBezelCard innerClassName="p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-3">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <CloudIcon className="w-3.5 h-3.5 text-[#00d2ff]" />
            Multi-CDN Traffic Distribution & Edge Failover
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isFailoverActive
                ? "bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40"
                : "bg-white/[0.06] text-white/60 border border-white/10"
            }`}
          >
            {isFailoverActive ? "ACTIVE MULTI-CDN FAILOVER" : "SINGLE PRIMARY ROUTING"}
          </span>
        </div>

        {/* Primary CDN: Fastly */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOutage
                    ? "bg-[#ff3366] animate-pulse"
                    : primaryPct > 0
                    ? "bg-[#00f5a0]"
                    : "bg-white/20"
                }`}
              />
              <span className="font-semibold text-white">Fastly Edge POP (Primary Ingest)</span>
              <span className="text-[10px] text-white/40">iad-01 (US-East)</span>
            </div>
            <span className="font-bold font-mono text-white">{primaryPct}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-white/[0.06] p-0.5 border border-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOutage
                  ? "bg-gradient-to-r from-[#ff3366] to-[#ffb800]"
                  : "bg-gradient-to-r from-[#00f5a0] to-[#00d2ff]"
              }`}
              style={{ width: `${primaryPct}%` }}
            />
          </div>
        </div>

        {/* Secondary CDN: Akamai Cloud Run Edge */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  secondaryPct > 0
                    ? "bg-[#00d2ff] animate-ping"
                    : "bg-white/20"
                }`}
              />
              <span className="font-semibold text-white">Akamai Cloud Run (Secondary Failover)</span>
              <span className="text-[10px] text-white/40">us-central1 (Google Cloud)</span>
            </div>
            <span className="font-bold font-mono text-white">{secondaryPct}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-white/[0.06] p-0.5 border border-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00d2ff] to-[#6366f1] transition-all duration-500"
              style={{ width: `${secondaryPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/50">
        <span className="flex items-center gap-1.5">
          <Activity01Icon className="w-3.5 h-3.5 text-[#00f5a0]" />
          Total Edge Egress: ~63.4 Gbps
        </span>
        <span className="text-white/70 font-semibold">
          {isFailoverActive ? "Traffic Rerouted: 80% to Secondary" : "All traffic on primary"}
        </span>
      </div>
    </DoubleBezelCard>
  );
}
