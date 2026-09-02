"use client";

import React, { useState, useEffect, useCallback } from "react";
import { HeaderNav } from "../components/HeaderNav";
import { MetricTickerGrid } from "../components/MetricTickerGrid";
import { LiveStreamPlayer } from "../components/LiveStreamPlayer";
import { CdnTrafficVisualizer } from "../components/CdnTrafficVisualizer";
import { GrafanaTelemetryPanel } from "../components/GrafanaTelemetryPanel";
import { GeminiAgentTerminal } from "../components/GeminiAgentTerminal";
import { ChaosControlDock } from "../components/ChaosControlDock";
import { PostMortemModal } from "../components/PostMortemModal";
import { ApiService } from "../services/api";
import {
  TelemetrySnapshot,
  InvestigationResult,
  GrafanaHealth,
  ChaosState,
} from "../types/telemetry";

export default function PremiereShieldDashboard() {
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot | null>(null);
  const [history, setHistory] = useState<TelemetrySnapshot[]>([]);
  const [grafanaHealth, setGrafanaHealth] = useState<GrafanaHealth | null>(null);
  const [chaosState, setChaosState] = useState<ChaosState | null>(null);
  const [investigations, setInvestigations] = useState<InvestigationResult[]>([]);
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [isPostMortemOpen, setIsPostMortemOpen] = useState<boolean>(false);

  // Initial Data Fetch
  const fetchInitialData = useCallback(async () => {
    try {
      const [cur, hist, health, state, invHist] = await Promise.allSettled([
        ApiService.getCurrentTelemetry(),
        ApiService.getTelemetryHistory(),
        ApiService.getGrafanaHealth(),
        ApiService.getChaosState(),
        ApiService.getInvestigationHistory(),
      ]);

      if (cur.status === "fulfilled") setTelemetry(cur.value);
      if (hist.status === "fulfilled") setHistory(hist.value);
      if (health.status === "fulfilled") setGrafanaHealth(health.value);
      if (state.status === "fulfilled") setChaosState(state.value);
      if (invHist.status === "fulfilled") setInvestigations(invHist.value);
    } catch (err) {
      console.warn("Initial data load partial failure:", err);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Connect 1Hz SSE Real-Time Stream with fallback polling
  useEffect(() => {
    const unsub = ApiService.createTelemetryEventSource(
      (newSnapshot) => {
        setTelemetry(newSnapshot);
        setHistory((prev) => {
          const updated = [...prev, newSnapshot];
          if (updated.length > 60) updated.shift();
          return updated;
        });
      },
      () => {
        // Fallback polling if SSE disconnects
        ApiService.getCurrentTelemetry()
          .then((snap) => {
            setTelemetry(snap);
            setHistory((prev) => [...prev.slice(-59), snap]);
          })
          .catch(() => {});
      }
    );

    return () => unsub();
  }, []);

  // Chaos Injection Handlers
  const handleInjectCdnOutage = async () => {
    setIsActionLoading(true);
    try {
      const state = await ApiService.injectCdnOutage();
      setChaosState(state);
      const snap = await ApiService.getCurrentTelemetry();
      setTelemetry(snap);
    } catch (err) {
      console.error("Failed to inject CDN outage:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleInjectDrmTimeout = async () => {
    setIsActionLoading(true);
    try {
      const state = await ApiService.injectDrmTimeout();
      setChaosState(state);
      const snap = await ApiService.getCurrentTelemetry();
      setTelemetry(snap);
    } catch (err) {
      console.error("Failed to inject DRM timeout:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleInjectIspDrop = async () => {
    setIsActionLoading(true);
    try {
      const state = await ApiService.injectIspDrop();
      setChaosState(state);
      const snap = await ApiService.getCurrentTelemetry();
      setTelemetry(snap);
    } catch (err) {
      console.error("Failed to inject ISP drop:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleTriggerAutonomousInvestigation = async () => {
    setIsInvestigating(true);
    try {
      const result = await ApiService.investigateAndRemediate();
      setInvestigations((prev) => [result, ...prev]);
      const [state, snap] = await Promise.all([
        ApiService.getChaosState(),
        ApiService.getCurrentTelemetry(),
      ]);
      setChaosState(state);
      setTelemetry(snap);
    } catch (err) {
      console.error("Autonomous SRE investigation failed:", err);
    } finally {
      setIsInvestigating(false);
    }
  };

  const handleResetChaos = async () => {
    setIsActionLoading(true);
    try {
      const state = await ApiService.resetChaos();
      setChaosState(state);
      const snap = await ApiService.getCurrentTelemetry();
      setTelemetry(snap);
    } catch (err) {
      console.error("Reset failed:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const latestInvestigation = investigations.length > 0 ? investigations[0] : null;
  const isOutage = telemetry?.is_outage ?? false;

  return (
    <main className="min-h-[100dvh] w-full bg-[#07090e] text-[#f0f4f8] cyber-grid radar-glow pb-16">
      {/* Top Header Navigation */}
      <HeaderNav
        telemetry={telemetry}
        grafanaHealth={grafanaHealth}
        onOpenPostMortem={() => setIsPostMortemOpen(true)}
        investigationCount={investigations.length}
      />

      {/* Main Dashboard Body Container */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-5">
        {/* 1. Real-Time Telemetry Tickers */}
        <MetricTickerGrid current={telemetry} history={history} />

        {/* 2. Asymmetric Central Grid: Live Stream & Multi-CDN vs. Grafana Real-Time Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (7 Cols): Video Player & Traffic Shift Visualizer */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <LiveStreamPlayer telemetry={telemetry} />
            <CdnTrafficVisualizer telemetry={telemetry} />
          </div>

          {/* Right Column (5 Cols): Grafana Prometheus PromQL Charts & Loki Log Stream */}
          <div className="lg:col-span-5 flex flex-col">
            <GrafanaTelemetryPanel
              telemetry={telemetry}
              history={history}
              grafanaHealth={grafanaHealth}
            />
          </div>
        </div>

        {/* 3. Gemini Enterprise Autonomous SRE Commander Terminal */}
        <GeminiAgentTerminal
          latestInvestigation={latestInvestigation}
          isInvestigating={isInvestigating}
          onTriggerInvestigation={handleTriggerAutonomousInvestigation}
          isOutage={isOutage}
        />

        {/* 4. Chaos Injection & SRE Action Control Dock */}
        <ChaosControlDock
          chaosState={chaosState}
          onInjectCdnOutage={handleInjectCdnOutage}
          onInjectDrmTimeout={handleInjectDrmTimeout}
          onInjectIspDrop={handleInjectIspDrop}
          onAutoRemediate={handleTriggerAutonomousInvestigation}
          onReset={handleResetChaos}
          isLoading={isActionLoading || isInvestigating}
        />
      </div>

      {/* Post-Mortem & Incident History Modal */}
      <PostMortemModal
        isOpen={isPostMortemOpen}
        onClose={() => setIsPostMortemOpen(false)}
        investigations={investigations}
      />
    </main>
  );
}
