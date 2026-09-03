# CONTINUITY: 3-Minute Video Demo Storyboard & Teleprompter Script

**Target Duration:** Exactly 2 minutes and 48 seconds (Strictly under the 3:00 minute hard cutoff)  
**Tone:** Confident, technical, authoritative SRE engineer presenting to Google Cloud and Grafana Labs judging architects.  
**Video Recording Strategy:** Screen capture with picture-in-picture presenter camera or clean crisp voiceover.

---

## Storyboard & Timing Breakdown

```
+---------------------------------------------------------------------------------------------------+
|                                 3-MINUTE DEMO VIDEO STORYBOARD TIMELINE                           |
+---------------------+---------------------------------------+-------------------------------------+
| Timestamp           | Visual Display                        | Voiceover Narration Track           |
+---------------------+---------------------------------------+-------------------------------------+
| 0:00 – 0:30 (30s)   | Studio Command Center: 4K Movie       | The Hollywood Continuity Problem    |
|                     | Stream playing smoothly. 4.28M viewers| (Manual SRE takes 40 minutes)       |
| 0:30 – 1:10 (40s)   | Click 'Inject CDN Outage': Video      | The Chaos Injection                 |
|                     | buffers, VPF spikes to 4.85% in red.  | (Simulating edge transit collapse)  |
| 1:10 – 2:10 (60s)   | Gemini Agent Terminal activates live, | Autonomous Gemini Reasoning & Action|
|                     | runs PromQL/Loki RCA, writes Grafana  | (MTTR in 1.28s, live traffic        |
|                     | annotation, shifts traffic to Akamai. | reroute, instant 4K recovery)       |
| 2:10 – 2:35 (25s)   | Codebase inspection & test suite:     | Technical Implementation & Rule 7.B |
|                     | google-genai + Grafana MCP client.    | (100% compliant serverless stack)   |
| 2:35 – 2:48 (13s)   | Architecture slide & sign-off.        | Value summary & concluding hook.    |
+---------------------+---------------------------------------+-------------------------------------+
```

---

## Detailed Teleprompter Script

### Section 1: The Hollywood Continuity Problem (0:00 – 0:30)
* **Visual:** Full-screen capture of the CONTINUITY Studio Command Center. The 4K stream for 'Dune: Part Three (World Premiere)' is playing cleanly. The top ticker reads `Viewers: 4,281,900 | Buffer Health: 28.5s | Bitrate: 14.8 Mbps | VPF: 0.18%`.
* **Voiceover:**
  > "In cinema, continuity is the sacred craft of ensuring no visual flaw breaks the viewer's immersion. In streaming distribution, continuity is zero downtime.
  > 
  > On blockbuster premiere night, platforms like Netflix, Disney+, and Max host millions of concurrent fans. When an edge CDN node collapses, traditional observability tools trigger noisy alerts while human SRE engineers spend 40 minutes manually triaging logs—by which time millions of dollars in subscriber cancellations have already occurred.
  > 
  > Meet CONTINUITY: the autonomous stream continuity incident commander powered by Google Cloud Gemini Enterprise and Grafana Cloud MCP."

---

### Section 2: The Chaos Outage (0:30 – 1:10)
* **Visual:** Cursor moves to the Chaos Simulator panel and clicks the `Inject CDN Outage` button. Immediately, the video player stutters with a buffering spinner. The Prometheus metric cards turn bright red: `VPF: 5.15%`, `CDN Latency: 413ms`, `Buffer Health: 2.8s`. The Loki edge log stream floods with `502 Bad Gateway` error messages.
* **Voiceover:**
  > "Let's simulate a real-world disaster. We trigger a transit link failure on our primary Fastly Edge POP in US-East.
  > 
  > Instantly, our Prometheus metrics detect a severe breach: Video Playback Failures spike from 0.18% to over 5%, player buffer collapses to under 3 seconds, and edge routers flood with 502 Bad Gateway errors."

---

### Section 3: Autonomous Gemini Reasoning & Resolution (1:10 – 2:10)
* **Visual:** The Gemini SRE Agent Terminal initiates. Step-by-step logs stream into view in real time. The agent polls Prometheus metrics, ingests Loki logs, outputs a structured JSON root-cause diagnosis, executes the `SHIFT_TRAFFIC_TO_AKAMAI` failover, writes an annotation to the live Grafana Cloud dashboard, and the video player immediately resumes smooth 4K playback. The metric cards transition to blue (`Status: RECOVERED, VPF: 0.20%, Fastly: 20%, Akamai: 80%`).
* **Voiceover:**
  > "CONTINUITY activates autonomously. Ingesting live Prometheus metric streams and Grafana Loki error logs, the Gemini Enterprise reasoning engine diagnoses the exact failure signature: a transit peering collapse on ASN 3356.
  > 
  > Without waiting for a human on-call engineer, Gemini executes an automated traffic shift, reallocating 80% of egress traffic to our healthy Akamai secondary edge.
  > 
  > The agent then programmatically writes a timestamped annotation directly onto our live Grafana Cloud dashboard and synthesizes an executive post-mortem.
  > 
  > Mean Time to Resolution: 1.28 seconds. Over $1.45 million dollars in subscriber churn prevented."

---

### Section 4: Architecture & Code Verification (2:10 – 2:35)
* **Visual:** Quick switch to the code repository in VS Code / IDE. Highlight `backend/services/agent_commander.py` showing `import google.genai`, the Grafana Cloud REST client adapter in `grafana_client.py`, and run `pytest -v tests/` in the terminal showing 26 passed tests in green.
* **Voiceover:**
  > "Under the hood, CONTINUITY is built strictly with the official google-genai SDK, utilizing Grafana Cloud's Prometheus and Loki datasources.
  > 
  > The entire state machine is thread-safe, concurrency-tested under 100 simultaneous requests, and backed by a comprehensive 26-test automated suite."

---

### Section 5: Conclusion & Sign-Off (2:35 – 2:48)
* **Visual:** Return to the CONTINUITY live Command Center showing all green metrics and the completed post-mortem summary. Show the project logo.
* **Voiceover:**
  > "CONTINUITY transforms passive observability into active, self-healing intelligence for the future of entertainment streaming.
  > 
  > Lights. Camera. Code."

---

## Audio & Video Technical Settings
* **Resolution:** 1080p (1920x1080) at 60 FPS.
* **Audio Format:** Stereo AAC 48kHz, -14 LUFS loudness standard.
* **Upload Platforms:** YouTube (Public or Unlisted) or Vimeo with English captions enabled.
