# 🔍 Label Lens AI 
### **Statutory Legal Metrology & Food Safety Compliance Engine**
**Smart India Hackathon (SIH 2026) | Problem Statement: 26034**  
*Department of Consumer Affairs, Ministry of Consumer Affairs, Food & Public Distribution (MoCAF&PD), Government of India*

---

[![Deploy to GitHub Pages](https://github.com/AlokXCreate/Label-Lens-AI/actions/workflows/deploy.yml/badge.svg)](https://github.com/AlokXCreate/Label-Lens-AI/actions/workflows/deploy.yml)
[![Build Android APK](https://github.com/AlokXCreate/Label-Lens-AI/actions/workflows/build-apk.yml/badge.svg)](https://github.com/AlokXCreate/Label-Lens-AI/actions/workflows/build-apk.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Android%20APK-emerald.svg)](https://alokxcreate.github.io/Label-Lens-AI/)
[![Languages](https://img.shields.io/badge/Languages-10%20Indian%20Languages-amber.svg)](https://alokxcreate.github.io/Label-Lens-AI/)

---

## 🌐 Live Deployments & Downloads

- 🚀 **Live Official Web Application:** [https://alokxcreate.github.io/Label-Lens-AI/](https://alokxcreate.github.io/Label-Lens-AI/)
- 📱 **Download Android APK (Direct Release):** [Download Latest APK (v1.1.0)](https://github.com/AlokXCreate/Label-Lens-AI/releases/latest)
- 📦 **GitHub Actions CI/CD Artifacts:** [GitHub Actions APK Runs](https://github.com/AlokXCreate/Label-Lens-AI/actions/workflows/build-apk.yml)

---

## 📌 Executive Summary

**Label Lens AI** is an enterprise-grade statutory compliance verification engine engineered to enforce the **Legal Metrology Act, 2009**, the **Legal Metrology (Packaged Commodities) Rules, 2011**, and **FSSAI Food Safety Standards (2020)**.

Designed for State Enforcement Officers, Legal Metrology Controllers, and Indian Consumers, the platform transforms manual, error-prone packaging inspections into instant, legally defensible, tamper-evident audit dossiers.

---

## 🌟 Key Capabilities & Architectural Pillars

### 1. 🛡️ Dual-Form Factor: Web & Native Android APK
- **Desktop Panoramic Web Interface:** Full-screen inspector workspace, split-pane OCR bounding box visualization, multi-tab dossier explorer, and administrative governance center.
- **Native Android APK Subsystem:** Built with Capacitor (`gov.in.doca.labellens`), featuring bottom navigation bar, one-touch camera scanning, native offline caching, and direct emergency dialer integration.

### 2. ⚡ AI-Powered Computer Vision & OCR Rule Auditing
- Real-time detection and statutory verification of **all 10 mandatory Rule 6 declarations**:
  - `Rule 6(1)(a)`: Common / Generic Commodity Name
  - `Rule 6(1)(b)`: Complete Manufacturer / Packer / Importer Identity & Address
  - `Rule 6(1)(c)`: Net Quantity Declaration & Principle Display Panel (PDP) Size Ratios
  - `Rule 6(1)(d)`: Month and Year of Manufacture / Pre-packing / Import
  - `Rule 6(1)(e)`: Maximum Retail Price (MRP inclusive of all taxes) & Unit Sale Price (USP)
  - `Rule 6(1)(n)`: Consumer Care Cell (Name, Landline/Mobile, Email, Postal Address)
  - `Rule 6(1)(g)`: Country of Origin (mandatory for domestic & imported commodities)
  - `FSSAI Sec 23`: 14-digit License Number, Veg / Non-Veg Green/Brown Logo, Ingredients & Allergen warning

### 3. 🇮🇳 10 Official Indian Languages
Complete statutory interface localized for pan-India enforcement:
- English, हिन्दी (Hindi), தமிழ் (Tamil), తెలుగు (Telugu), বাংলা (Bengali), मराठी (Marathi), ગુજરાતી (Gujarati), ಕನ್ನಡ (Kannada), മലയാളം (Malayalam), ਪੰਜਾਬੀ (Punjabi).

### 4. 📄 Multi-Format Evidence & Legal Export Engine
Generate high-fidelity inspection dossiers in 5 formats:
- **Court-Admissible PDF Dossier:** Includes QR verification seal, cryptographic hash, statutory penalty citations, and high-res imagery.
- **Word Brief (.docx):** Structured for departmental internal forwarding and compounding notices.
- **Interactive Standalone HTML App:** Self-contained offline viewer with embedded CSS & base64 assets.
- **JSON Evidence Dataset:** Machine-readable payload for National Consumer Helpline (NCH) API ingestion.
- **Plain Text Brief (.txt):** Instant SMS / WhatsApp dispatch for field inspectors.

### 5. 🗺️ Integrated GIS Enforcement Office Locator
- Interactive Google Maps integration with auto-locating GPS.
- Lists State Controllers, District Legal Metrology Inspectors (LMI), and Consumer Disputes Redressal Commissions across all 36 States & UTs.
- 1-Click direct call, email, and navigation routing.

### 6. 🔐 Secure Multi-Provider Authentication & Cloud Vault
- Interactive Google Account Chooser + Custom Gmail sign-in.
- Email/Password verification via Firebase Auth.
- Mandatory 3-step onboarding: **Cinematic Splash Screen** -> **Sign In** -> **Profile Creation** -> **Main Dashboard**.
- Encrypted local & cloud storage (Firebase Storage / Google Drive Vault) for downloaded evidence and inspection history.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Android Studio (for local native APK compilation)

### 1. Clone & Install
```bash
git clone https://github.com/AlokXCreate/Label-Lens-AI.git
cd Label-Lens-AI
npm install
```

### 2. Run Web Development Server
```bash
npm run dev
# Server will start on http://localhost:3000
```

### 3. Build for Production Web
```bash
npm run build
```

### 4. Build & Sync Native Android APK
```bash
npm run build:apk
# Web assets are compiled and synced to ./android/app/src/main/assets/public

# Open in Android Studio to run on physical device or emulator
npm run open:android
```

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite 6 |
| **Styling & Design System** | Tailwind CSS, Lucide React, Glassmorphic UI |
| **Mobile Runtime** | Capacitor Android 7, Native WebViews |
| **AI Vision & LLM** | Google Gemini 2.5 Flash / Pro, Tesseract OCR |
| **Cloud & Auth** | Firebase Authentication, Firebase Storage, Google Drive API |
| **GIS & Mapping** | Google Maps Platform, Geolocation API |
| **Document Generation** | jsPDF, html2canvas, docx, SheetJS (xlsx) |
| **CI/CD Automation** | GitHub Actions (Pages Deployment & Gradle Android APK Build) |

---

## 📂 Repository Structure

```
Label-Lens-AI/
├── .github/
│   └── workflows/
│       ├── deploy.yml            # Automated GitHub Pages CI/CD
│       └── build-apk.yml         # Automated Gradle APK Build & Artifacts
├── android/                      # Native Android Project (Capacitor)
│   ├── app/
│   │   ├── build.gradle          # Android app configuration & dependencies
│   │   └── src/main/
│   │       ├── AndroidManifest.xml # Camera, Storage, Location permissions
│   │       └── java/gov/in/doca/labellens/MainActivity.java
│   └── build.gradle
├── docs/                         # System architecture & legal metrology datasets
├── public/                       # Manifest, logos, 404 SPA fallback
├── src/
│   ├── components/
│   │   ├── Admin/                # Administrative review & inspection logs
│   │   ├── Audit/                # Rule 6 compliance scorecard & parameters
│   │   ├── Auth/                 # Splash, Login & Profile onboarding
│   │   ├── Authority/            # Quick call & post-call logging
│   │   ├── Chat/                 # AI statutory legal assistant
│   │   ├── Complaint/            # NCH petition & notice generator
│   │   ├── Export/               # PDF, DOCX, HTML, JSON, TXT exporters
│   │   ├── Language/             # 10 Indian language selector modal
│   │   ├── Map/                  # Enforcement office GIS map
│   │   ├── Mobile/               # Material 3 mobile navigation & layout
│   │   ├── Notifications/        # High-visibility toast alert container
│   │   ├── Permissions/          # Camera, storage, microphone access modal
│   │   ├── Scanner/              # Live camera & file upload OCR scanner
│   │   ├── Settings/             # Profile & system configurations
│   │   └── Splash/               # Cinematic 2.8s animated intro
│   ├── context/                  # Language & state contexts
│   ├── services/                 # Firebase, Gemini, Drive, Maps, Rules Engine
│   ├── types/                    # TypeScript interfaces & definitions
│   ├── App.tsx                   # Master root component & routing
│   └── main.tsx
├── capacitor.config.ts           # Capacitor configuration
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## ⚖️ Statutory Legal References

1. **The Legal Metrology Act, 2009 (No. 1 of 2010)** — Sections 18, 36, 49.
2. **Legal Metrology (Packaged Commodities) Rules, 2011** — Rules 6, 7, 8, 9, 10, 18, 26, 32.
3. **Consumer Protection Act, 2019** — Sections 2(28) [Misleading Advertisements] and 2(47) [Unfair Trade Practices].
4. **Food Safety and Standards (Packaging and Labelling) Regulations, 2020** — FSSAI License & Display Guidelines.

---

## 👥 Contributors & SIH 2026 Team

- **Project Lead & Developer:** Alok ([@AlokXCreate](https://github.com/AlokXCreate))
- **Hackathon:** Smart India Hackathon 2026 (SIH 2026)
- **Problem Statement ID:** 26034 (MoCAF&PD)

---

## 📄 License

This project is licensed under the **MIT License**.
