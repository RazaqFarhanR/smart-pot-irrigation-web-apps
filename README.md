# Smart Pot Irrigation — Web Application

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![Design System](https://img.shields.io/badge/Design_System-Earth_%26_Terracotta-B96545?style=flat)](#-design-system)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG_2.2_AA-28766A?style=flat)](#)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Frontend web application foundation for the **Smart Pot Irrigation System**, built with **React 19**, **TypeScript**, and **Vite**.

---

## 🏗️ Project Status: Initialization (Scaffold Baseline)

This repository holds the client-side architecture baseline:
- ✅ Strict TypeScript compiler setup (`react-jsx` modern mode).
- ✅ Development proxy rules to Go backend (`/api` and `/healthz`).
- ✅ Design system tokens (**Earth & Terracotta** palette adhering to WCAG 2.2 AA).
- ✅ Containerized production build via Nginx.
- ⏳ Real-time telemetry dashboard & ML dataset export (Scheduled for Next Phase).

---

## 🎨 Design System: Earth & Terracotta

- **Canvas Background:** `#F7F3EB` (Warm cream)
- **Surfaces & Cards:** `#FFFFFF` (Pure white)
- **Primary Text:** `#382F2A` (Deep soil brown)
- **Primary Brand / Action:** `#B96545` (Terracotta)
- **Water & Moisture:** `#477FA5` (Muted blue)
- **Optimal / Online:** `#28766A` (Deep teal)
- **Borders & Dividers:** `#E5DDD2` (Warm gray)

---

## 🚀 Quick Start

### Prerequisites:
- [Node.js 26+ LTS](https://nodejs.org/) (Lithium)
- npm 11+

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

> Requests to `/healthz` and `/api` are automatically proxied to the Go backend on `http://localhost:8080`.

---

## 📦 Production Build

```bash
npm run build
npm run preview
```

---

## 📂 Directory Structure

```text
smart-pot-irrigation-web-app/
├── public/                  # Static assets & favicon
├── src/
│   ├── App.tsx              # Starter initialization component
│   ├── main.tsx             # React DOM root mount
│   ├── types.ts             # Telemetry interface contracts
│   └── style.css            # Earth & Terracotta design system styles
├── index.html               # HTML5 entrypoint
├── package.json             # NPM dependencies & scripts
├── tsconfig.json            # Strict TypeScript compiler options
├── vite.config.ts           # Vite server & API proxy rules
├── Dockerfile               # Multi-stage Nginx container build
└── README.md
```

---

## 📄 License
MIT License. Developed as part of the Smart Pot Precision Irrigation & TinyML Research.
