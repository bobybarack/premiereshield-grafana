"use client";

import React from "react";
import {
  FlashIcon,
  Radio01Icon,
  Wifi01Icon,
  RefreshIcon,
  SparklesIcon,
  Alert01Icon,
  CheckmarkCircle01Icon,
  Shield01Icon,
} from "hugeicons-react";
import { DoubleBezelCard } from "./DoubleBezelCard";
import { ChaosState } from "../types/telemetry";

interface ChaosControlDockProps {
  chaosState: ChaosState | null;
  onInjectCdnOutage: () => void;
  onInjectDrmTimeout: () => void;
  onInjectIspDrop: () => void;
  onAutoRemediate: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export function ChaosControlDock({
  chaosState,
  onInjectCdnOutage,
  onInjectDrmTimeout,
  onInjectIspDrop,
  onAutoRemediate,
  onReset,
  isLoading,
}: ChaosControlDockProps) {
  const currentMode = chaosState?.current_mode || "NORMAL";
  const isOutage = chaosState?.is_outage_active || false;

  return (
    <DoubleBezelCard
      glowColor={isOutage ? "red" : "none"}
      innerClassName="p-4 sm:p-5"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left Title & Status */}
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/[0.06] border border-white/10">
              <FlashIcon className="w-4 h-4 text-[#ffb800]" />
            </div>
            <div>
              <h3 className="text-xs font-bold font-mono text-white tracking-wider uppercase flex items-center gap-2">
                Chaos Injection & Interactive SRE Demo Suite
              </h3>
              <p className="text-[11px] font-mono text-white/50">
                Simulate catastrophic live OTT playback failures and trigger Gemini autonomous self-healing.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button Pills */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
          {/* Button 1: Inject CDN Outage */}
          <button
            onClick={onInjectCdnOutage}
            disabled={isLoading}
            className={`group flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-mono font-semibold transition-all duration-200 active:scale-[0.98] ${
              currentMode === "CDN_OUTAGE"
                ? "bg-[#ff3366] text-white border-[#ff3366] shadow-[0_0_16px_rgba(255,51,102,0.4)]"
                : "bg-white/[0.04] hover:bg-[#ff3366]/20 border-white/15 text-white hover:border-[#ff3366]/40"
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FlashIcon className="w-3 h-3 text-[#ff3366]" />
            </div>
            <span>INJECT CDN OUTAGE</span>
          </button>

          {/* Button 2: Inject DRM Timeout */}
          <button
            onClick={onInjectDrmTimeout}
            disabled={isLoading}
            className={`group flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-mono font-semibold transition-all duration-200 active:scale-[0.98] ${
              currentMode === "DRM_TIMEOUT"
                ? "bg-[#ff3366] text-white border-[#ff3366] shadow-[0_0_16px_rgba(255,51,102,0.4)]"
                : "bg-white/[0.04] hover:bg-[#ff3366]/20 border-white/15 text-white hover:border-[#ff3366]/40"
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Radio01Icon className="w-3 h-3 text-[#ff3366]" />
            </div>
            <span>INJECT DRM TIMEOUT</span>
          </button>

          {/* Button 3: Inject ISP Peering Drop */}
          <button
            onClick={onInjectIspDrop}
            disabled={isLoading}
            className={`group flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-mono font-semibold transition-all duration-200 active:scale-[0.98] ${
              currentMode === "ISP_PEERING_DROP"
                ? "bg-[#ffb800] text-black border-[#ffb800] font-bold shadow-[0_0_16px_rgba(255,184,0,0.4)]"
                : "bg-white/[0.04] hover:bg-[#ffb800]/20 border-white/15 text-white hover:border-[#ffb800]/40"
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wifi01Icon className="w-3 h-3 text-[#ffb800]" />
            </div>
            <span>INJECT ISP DROP</span>
          </button>

          {/* Button 4: Trigger Autonomous SRE Remediation */}
          <button
            onClick={onAutoRemediate}
            disabled={isLoading}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#00f5a0] to-[#00d2ff] hover:opacity-95 text-[#07090e] border border-white/20 text-xs font-mono font-bold tracking-wide transition-all duration-200 active:scale-[0.98] shadow-[0_0_20px_rgba(0,245,160,0.3)]"
          >
            <div className="w-5 h-5 rounded-full bg-black/15 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <SparklesIcon className="w-3.5 h-3.5 text-[#07090e]" />
            </div>
            <span>AUTONOMOUS SRE HEAL</span>
          </button>

          {/* Button 5: Reset to Normal */}
          <button
            onClick={onReset}
            disabled={isLoading}
            className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-mono font-semibold transition-all duration-200 active:scale-[0.98]"
          >
            <RefreshIcon className="w-3.5 h-3.5 text-white/70 group-hover:rotate-180 transition-transform duration-500" />
            <span>RESET NORMAL</span>
          </button>
        </div>
      </div>
    </DoubleBezelCard>
  );
}
