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
    "Real-time autonomous OTT video streaming incident commander powered by Gemini Enterprise and Grafana Cloud MCP. Self-heals 4K stream delivery failures in under 5 seconds.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-[100dvh] bg-[#07090e] text-[#f0f4f8] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
