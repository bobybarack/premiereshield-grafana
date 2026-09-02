import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PremiereShield // Autonomous OTT Streaming Incident Commander",
  description:
    "Autonomous OTT video streaming incident commander. Detects, diagnoses, and self-heals live 4K stream delivery bottlenecks in real time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-[100dvh] bg-[#f8f9fb] text-[#111827] antialiased">
        {children}
      </body>
    </html>
  );
}
