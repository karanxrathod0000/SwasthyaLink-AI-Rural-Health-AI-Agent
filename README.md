# SwasthyaLink AI 🏥

> **Rural India Emergency Dispatch, Maternal Triage & Resource Coordination System**
> Built for the Google Build with AI Series Hackathon 2026.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Google Tech Stack](https://img.shields.io/badge/Google%20Stack-Gemini%20%7C%20Cloud%20Run%20%7C%20Firebase-4285F4.svg)](#)

---

## 📌 Problem Statement & Regional Context

In rural India, **Community Health Workers (ASHAs)** are the front-line soldiers of primary care. However, they face steep operational bottlenecks:
1. **Time-Critical Triage:** Under stress and in low-bandwidth zones, classifying maternal or pediatric emergencies manually takes too long, leading to preventable casualties during transport.
2. **Dynamic Resource Gaps:** ASHAs lack real-time visibility into which regional health center has free beds, high-flow oxygen, or specialized staff (e.g., Gynaecologists, Pediatricians).
3. **Attendance & Claim Auditing:** Administrative verification of worker visits is plagued by geofence fraud and log discrepancies (e.g., claiming to run diagnostic tests at facilities without matching equipment).

**SwasthyaLink AI** bridges this gap. It is a highly optimized, dual-role tactical console for **ASHAs** and **District Supervisors**, providing instantaneous clinical classification, resource mapping, and geofence-audited attendance records.

---

## ⚡ Core Capabilities & Features

### 1. Unified Mission Control Dashboard
*   **KPI Metrics & Health Index:** Real-time summary cards tracking active patient triages, verified ASHA presence, available hospital beds, and pending critical alerts.
*   **Dynamic Pulse Alerts:** Life-threatening emergencies trigger visual alert cards with pulse animations, immediately directing attention where it is needed most.
*   **Real-Time Operations Feed:** Unified audit timeline compiling GPS check-ins, medical dispatches, and ambulance transport updates.

### 2. Clinical Triage Console (Priority Core)
*   **AI Symptom Analysis:** ASHAs input symptom narratives in plain text. A server-side **Gemini model** parses the symptoms, correlates them with clinical vitals (temp, heart rate, $O_2$ saturation, blood pressure), and determines the triage priority (Critical, High, Medium, Low).
*   **Maternal Risk Identification:** Automatically flags high-risk pregnancies or obstetric emergencies (e.g., severe hemorrhage) to prioritize transport.
*   **Intelligent Routing Engine:** Identifies the nearest hospital containing both available bed capacity *and* the precise medical equipment (e.g., Ultrasound, ICU beds, oxygen) required for the case.
*   **One-Tap Emergency Dispatch:** Instantly generates a clickable call link to regional ambulance dispatch units and coordinates travel routing coordinates.

### 3. Geofenced Attendance & Claim Auditor
*   **Location Geofence Pinning:** ASHAs complete on-site check-ins at specific coordinate hubs.
*   **AI-Driven Note Auditing:** An AI audit engine inspects treatment notes. If a worker mistakenly claims to have performed specialized services at a facility that does not support them (e.g., claiming an ultrasound check-up at a simple SubCenter), the system flags an **Administrative Anomaly** for review.
*   **Supervisor Review Interface:** Supervisors can view flagged discrepancies, approve or reject log inputs, and maintain an authentic record of field visits.

### 4. System Analytics & Resource Directory
*   **Regional Bed Ledger:** Real-time visibility into regional bed occupancy across SubCenters, Community Health Centers (CHCs), and District Hospitals.
*   **Triage Distribution Metrics:** Live charts illustrating triage priority tiers to monitor regional disease trends and emergency density.

---

## 🛠️ High-Performance Architecture & Tech Stack

```text
+-------------------------------------------------------------+
|                     Client (ASHA Mobile)                    |
|             React 18 + Vite + Tailwind CSS + Lucide         |
+----------------------------------------------+--------------+
                                               | (REST APIs)
                                               v
+-------------------------------------------------------------+
|                      Full-Stack Server                      |
|             Express Router + TypeScript Node.js             |
+----------------------------------------------+--------------+
                                               |
         +-------------------------------------+-------------------------------------+
         |                                                                           |
         v                                                                           v
+-----------------------------+                                             +----------------------------+
|        AI Orchestration      |                                             |      Durable Ledger       |
|    Gemini API Integration    |                                             |   Simulated Local Caches   |
|   (Clinical Triage Model)    |                                             |   & Firebase Rest Hooks    |
+-----------------------------+                                             +----------------------------+
```

*   **Frontend:** React 18, Vite (fast HMR-ready developer environment), Tailwind CSS (for modern UI consistency), Lucide React (vector icon systems).
*   **Backend:** Node.js Express Server, TypeScript (type-safe operational data structures).
*   **AI Engine:** Gemini Models (configured for structured prompt clinical triage).
*   **Deployment Target:** Google Cloud Run (containerized, auto-scalable, and serverless).

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/swasthyalink-ai.git
   cd swasthyalink-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=production
   ```

4. Run the development environment:
   ```bash
   npm run dev
   ```
   *The server binds to port 3000.*

5. Build the production package:
   ```bash
   npm run build
   npm start
   ```

---

## 📁 Repository Structure

```text
├── src/
│   ├── components/            # Redesigned highly tactical UI sub-components
│   │   ├── MainLayout.tsx     # Global Header, collapsible Sidebar & Mobile navbar
│   │   ├── DashboardTab.tsx   # Mission Control overview, metrics & unified activity feeds
│   │   ├── TriageConsoleTab.tsx# Clinical inputs, vitals, AI analysis & routing outputs
│   │   ├── ResourceLocatorTab.tsx# Medical equipment checksheets & active bed edits
│   │   ├── PatientsDirectoryTab.tsx# Electronic patient health records
│   │   ├── PatientManagementTab.tsx# Geofence check-ins & administrative anomaly audits
│   │   ├── ReportsTab.tsx     # Triage distributions & supervisor metrics
│   │   └── SettingsTab.tsx    # Caching parameters and offline configuration
│   ├── App.tsx                # Main state controller & tab router
│   ├── index.css              # Custom styling definitions & Google Inter fonts
│   ├── main.tsx               # Main DOM renderer
│   └── types.ts               # Shared clinical, location, and alert type interfaces
├── server.ts                  # Express production server, clinical datasets, and routing APIs
├── package.json               # Package manifests and scripts
└── README.md                  # Project documentation
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌸 Acknowledgements

Built with passion for rural health empowerment under the **Google Build with AI Series 2026** initiative. Special thanks to the Google Developers team and the rural health workers (ASHAs) of India who inspire this workflow.
