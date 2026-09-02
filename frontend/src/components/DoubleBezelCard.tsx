import React from "react";

interface DoubleBezelCardProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glowColor?: "green" | "red" | "yellow" | "blue" | "indigo" | "none";
  highlightBorder?: boolean;
}

export function DoubleBezelCard({
  children,
  className = "",
  innerClassName = "",
  glowColor = "none",
  highlightBorder = false,
}: DoubleBezelCardProps) {
  const glowStyles = {
    green: "ring-1 ring-[#00f5a0]/40 shadow-[0_0_24px_-4px_rgba(0,245,160,0.15)]",
    red: "ring-1 ring-[#ff3366]/50 shadow-[0_0_28px_-2px_rgba(255,51,102,0.22)] alert-pulse-red",
    yellow: "ring-1 ring-[#ffb800]/40 shadow-[0_0_24px_-4px_rgba(255,184,0,0.15)]",
    blue: "ring-1 ring-[#00d2ff]/40 shadow-[0_0_24px_-4px_rgba(0,210,255,0.15)]",
    indigo: "ring-1 ring-[#6366f1]/40 shadow-[0_0_24px_-4px_rgba(99,102,241,0.15)]",
    none: "ring-1 ring-white/[0.08]",
  };

  return (
    <div
      className={`relative p-1.5 rounded-2xl bg-white/[0.025] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        glowStyles[glowColor]
      } ${highlightBorder ? "border border-white/20" : ""} ${className}`}
    >
      <div
        className={`relative w-full h-full rounded-[calc(1rem-0.125rem)] bg-[#0c1017]/95 backdrop-blur-2xl border border-white/[0.06] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] overflow-hidden transition-all duration-300 ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
