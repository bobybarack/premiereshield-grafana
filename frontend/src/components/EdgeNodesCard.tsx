"use client";

import React from "react";
import { Activity01Icon } from "hugeicons-react";
import { TelemetrySnapshot } from "../types/telemetry";

interface EdgeNodesCardProps {
  telemetry: TelemetrySnapshot | null;
}

export function EdgeNodesCard({ telemetry }: EdgeNodesCardProps) {
  const isOutage = telemetry?.is_outage ?? false;

  const nodes = [
    {
      region: "US-East (iad-01)",
      latency: isOutage ? "412ms" : "48ms",
      status: isOutage ? "Degraded (502)" : "Operational",
      isOutage: isOutage,
    },
    {
      region: "US-West (sfo-01)",
      latency: "52ms",
      status: "Operational",
      isOutage: false,
    },
    {
      region: "EU-West (lhr-01)",
      latency: "64ms",
      status: "Operational",
      isOutage: false,
    },
    {
      region: "AP-East (tyo-01)",
      latency: "86ms",
      status: "Operational",
      isOutage: false,
    },
  ];

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 subtle-card-shadow flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Activity01Icon className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                Global Edge POP Health
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                4 Tier-1 Ingest Regions
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-gray-500">12 Active Nodes</span>
        </div>

        {/* Node Table */}
        <div className="mt-3 space-y-2">
          {nodes.map((node, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200/60 text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    node.isOutage ? "bg-red-500 animate-ping" : "bg-emerald-500"
                  }`}
                />
                <span className="font-semibold text-gray-800">
                  {node.region}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-gray-500 font-medium">
                  {node.latency}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    node.isOutage
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  {node.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium flex items-center justify-between">
        <span>Prometheus Health</span>
        <span className="font-semibold text-emerald-600">Active (100% Ingest)</span>
      </div>
    </div>
  );
}
