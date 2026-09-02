"use client";

import React, { useRef, useEffect } from "react";
import {
  Alert01Icon,
  Activity01Icon,
  FlashIcon,
  Wifi01Icon,
  Radio01Icon,
  Film01Icon,
} from "hugeicons-react";
import { DoubleBezelCard } from "./DoubleBezelCard";
import { TelemetrySnapshot } from "../types/telemetry";

interface MetricTickerGridProps {
  current: TelemetrySnapshot | null;
  history: TelemetrySnapshot[];
}

function MiniSparkline({
  data,
  color,
  threshold,
  height = 36,
}: {
  data: number[];
  color: string;
  threshold?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, width, h);

    if (data.length < 2) return;

    const maxVal = Math.max(...data, threshold ? threshold * 1.2 : 1);
    const minVal = Math.min(...data, 0);
    const range = maxVal - minVal || 1;

    // Draw threshold line if present
    if (threshold !== undefined) {
      const threshY = h - ((threshold - minVal) / range) * (h - 8) - 4;
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = "rgba(255, 51, 102, 0.4)";
      ctx.lineWidth = 1;
      ctx.moveTo(0, threshY);
      ctx.lineTo(width, threshY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw sparkline curve
    const step = width / (data.length - 1);
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = i * step;
      const y = h - ((val - minVal) / range) * (h - 8) - 4;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevX = (i - 1) * step;
        const prevVal = data[i - 1];
        const prevY = h - ((prevVal - minVal) / range) * (h - 8) - 4;
        const midX = (prevX + x) / 2;
        ctx.bezierCurveTo(midX, prevY, midX, y, x, y);
      }
    });

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();

    // Area fill gradient
    ctx.lineTo(width, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color.replace(")", ", 0.25)").replace("rgb", "rgba"));
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fill();
  }, [data, color, threshold]);

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={height}
      className="w-full h-9 block opacity-90"
    />
  );
}

export function MetricTickerGrid({ current, history }: MetricTickerGridProps) {
  const vpfHistory = history.map((s) => s.video_playback_failures_pct);
  const latencyHistory = history.map((s) => s.cdn_egress_latency_ms);
  const drmHistory = history.map((s) => s.drm_handshake_ms);
  const bufferHistory = history.map((s) => s.buffer_health_sec);
  const bitrateHistory = history.map((s) => s.avg_bitrate_mbps);

  const vpf = current?.video_playback_failures_pct ?? 0.18;
  const latency = current?.cdn_egress_latency_ms ?? 48.0;
  const drm = current?.drm_handshake_ms ?? 120.0;
  const viewers = current?.active_viewers ?? 4281902;
  const buffer = current?.buffer_health_sec ?? 28.4;
  const bitrate = current?.avg_bitrate_mbps ?? 14.8;

  const isVpfSpike = vpf > 1.0;
  const isLatencySpike = latency > 200.0;
  const isDrmSpike = drm > 500.0;
  const isBufferLow = buffer < 10.0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {/* 1. Video Playback Failures (VPF) */}
      <DoubleBezelCard
        glowColor={isVpfSpike ? "red" : "green"}
        innerClassName="p-4 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Alert01Icon className={`w-3.5 h-3.5 ${isVpfSpike ? "text-[#ff3366]" : "text-[#00f5a0]"}`} />
              VPF Error Rate
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                isVpfSpike
                  ? "bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366]/40"
                  : "bg-[#00f5a0]/15 text-[#00f5a0] border border-[#00f5a0]/30"
              }`}
            >
              {isVpfSpike ? "SLA BREACH" : "< 1.0% SLA"}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl lg:text-3xl font-bold font-mono tracking-tight ${isVpfSpike ? "text-[#ff3366]" : "text-white"}`}>
              {vpf.toFixed(2)}%
            </span>
            <span className="text-xs font-mono text-white/40">rate</span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/[0.05]">
          <MiniSparkline
            data={vpfHistory.length > 0 ? vpfHistory : [0.18, 0.2, 0.17, 0.19]}
            color={isVpfSpike ? "rgb(255, 51, 102)" : "rgb(0, 245, 160)"}
            threshold={1.0}
          />
        </div>
      </DoubleBezelCard>

      {/* 2. CDN Egress Latency */}
      <DoubleBezelCard
        glowColor={isLatencySpike ? "red" : "none"}
        innerClassName="p-4 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <FlashIcon className={`w-3.5 h-3.5 ${isLatencySpike ? "text-[#ff3366]" : "text-[#00d2ff]"}`} />
              CDN Latency
            </span>
            <span className="text-[10px] font-mono text-white/60 bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/10">
              {current?.primary_cdn || "Fastly"}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl lg:text-3xl font-bold font-mono tracking-tight ${isLatencySpike ? "text-[#ff3366]" : "text-white"}`}>
              {latency.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-white/40">ms</span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/[0.05]">
          <MiniSparkline
            data={latencyHistory.length > 0 ? latencyHistory : [48, 50, 47, 49]}
            color={isLatencySpike ? "rgb(255, 51, 102)" : "rgb(0, 210, 255)"}
            threshold={150.0}
          />
        </div>
      </DoubleBezelCard>

      {/* 3. DRM Handshake Time */}
      <DoubleBezelCard
        glowColor={isDrmSpike ? "red" : "none"}
        innerClassName="p-4 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Radio01Icon className={`w-3.5 h-3.5 ${isDrmSpike ? "text-[#ff3366]" : "text-[#6366f1]"}`} />
              DRM Auth Time
            </span>
            <span className="text-[10px] font-mono text-white/60 bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/10">
              Widevine L1
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl lg:text-3xl font-bold font-mono tracking-tight ${isDrmSpike ? "text-[#ff3366]" : "text-white"}`}>
              {drm.toFixed(0)}
            </span>
            <span className="text-xs font-mono text-white/40">ms</span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/[0.05]">
          <MiniSparkline
            data={drmHistory.length > 0 ? drmHistory : [120, 118, 122, 119]}
            color={isDrmSpike ? "rgb(255, 51, 102)" : "rgb(99, 102, 241)"}
            threshold={400.0}
          />
        </div>
      </DoubleBezelCard>

      {/* 4. Active Concurrent Viewers */}
      <DoubleBezelCard innerClassName="p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Activity01Icon className="w-3.5 h-3.5 text-[#00f5a0]" />
              Active Viewers
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-[#00f5a0] bg-[#00f5a0]/10 px-1.5 py-0.5 rounded border border-[#00f5a0]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] animate-ping" />
              LIVE CONCURRENT
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-white">
              {viewers.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-white/50">
          <span>Global Ingest POPs</span>
          <span className="text-white/80 font-semibold">12 Regions</span>
        </div>
      </DoubleBezelCard>

      {/* 5. Forward Buffer Health */}
      <DoubleBezelCard
        glowColor={isBufferLow ? "red" : "none"}
        innerClassName="p-4 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Wifi01Icon className={`w-3.5 h-3.5 ${isBufferLow ? "text-[#ff3366]" : "text-[#00d2ff]"}`} />
              Forward Buffer
            </span>
            <span className="text-[10px] font-mono text-white/60 bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/10">
              HLS chunk
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl lg:text-3xl font-bold font-mono tracking-tight ${isBufferLow ? "text-[#ff3366]" : "text-white"}`}>
              {buffer.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-white/40">sec</span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/[0.05]">
          <MiniSparkline
            data={bufferHistory.length > 0 ? bufferHistory : [28, 29, 28, 28.5]}
            color={isBufferLow ? "rgb(255, 51, 102)" : "rgb(0, 210, 255)"}
            threshold={10.0}
          />
        </div>
      </DoubleBezelCard>

      {/* 6. Delivered Bitrate (4K UHD) */}
      <DoubleBezelCard innerClassName="p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Film01Icon className="w-3.5 h-3.5 text-[#00f5a0]" />
              Stream Bitrate
            </span>
            <span className="text-[10px] font-mono text-[#00f5a0] bg-[#00f5a0]/10 px-1.5 py-0.5 rounded border border-[#00f5a0]/20">
              4K HEVC HDR
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-white">
              {bitrate.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-white/40">Mbps</span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/[0.05]">
          <MiniSparkline
            data={bitrateHistory.length > 0 ? bitrateHistory : [14.8, 14.7, 14.9, 14.8]}
            color="rgb(0, 245, 160)"
            threshold={6.0}
          />
        </div>
      </DoubleBezelCard>
    </div>
  );
}
