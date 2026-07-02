# Servify Partner Onboarding Portal (POP) MVP

A modern, high-fidelity Partner Onboarding Portal MVP built for Servify Operations and Partner Success teams. It simplifies the configuration of partner details, device protection programs, and developer API credentials into a clean, wizard-driven web workflow.

## 🔗 Live Demo URLs
- **Official Host (GitHub Pages)**: [https://aryn-ankit.github.io/partner-onboarding-portal/](https://aryn-ankit.github.io/partner-onboarding-portal/)
- **Local Proxy (Localtunnel)**: [https://slimy-planes-occur.loca.lt](https://slimy-planes-occur.loca.lt)

---

## 🎨 Implementation & Design Notes

### 1. Architecture Overview
This application is built as a lightweight, zero-dependency **Single Page Application (SPA)** to ensure fast loading times, instant responsiveness, and zero build/compilation overhead.
- **Core Technology**: HTML5, Vanilla JavaScript (ES6+), and CSS3.
- **State Management**: A centralized class-based controller (`PartnerOnboardingPortal`) managing active view state, user role state, templates, and the partner registry.
- **Persistence**: Entire database state (including custom partner additions, drafts, logs, and sandbox credentials) is persisted in the browser's `localStorage`.

### 2. Design System & Aesthetics
Following the void-dark theme specification, the portal features:
- **Void Color Palette**: Deep background colors (`#06070d`) combined with semi-transparent glassmorphic panels (`rgba(13, 16, 28, 0.75)`) utilizing `backdrop-filter: blur(12px)`.
- **Glowing Accents**: Cyber neon glows using radial gradients, drop shadows, and glow animations to highlight active nodes, badges, and metrics.
- **Typography**: Clean hierarchy with `Inter` sans-serif font.
- **Iconography**: Integrated [Lucide Icons](https://lucide.dev) via CDN for vector-perfect visuals.
- **Animations**: Soft fade-ins for view transitions and slide-out toast alerts.

### 3. Step-by-Step Onboarding Wizard
- **Step 1 (Basic Info)**: Form collection for partner metadata, contact info, and billing preference.
- **Step 2 (Programs)**: Interactive selector representing standard protection policies. Choosing a template loads default co-pay/premiums that can be customized.
- **Step 3 (Integration)**: Simulates real API token creation by generating cryptographically secure mock Client IDs/Secrets and validates webhook input formats.
- **Step 4 (Review)**: Consolidates all selections in a read-only visual brief.

### 4. Interactive Simulation Features
- **Role Switcher**: Click the refresh icon next to the profile avatar (bottom-left) to toggle between **Onboarding Specialist** and **Operations Manager**.
- **Specialist Flow**: Initiate onboarding, configure plans, generate sandbox credentials, save drafts, and submit for approval.
- **Manager Flow**: Review pending applications, approve configurations, and trigger production deployments.

---

## ❓ Product Clarity Questions

To transition this MVP into production, we need clarification from the Product team on the following items:

1. **Multi-Program Policies**: Can a single partner register for multiple protection programs concurrently (e.g., both Accidental Damage and Theft), or does the onboarding wizard process exactly one program per partner setup?
2. **Role & Authorization Structure**: Beyond Onboarding Specialists and Operations Managers, are there other organizational roles (e.g., Legal, Risk Underwriting, Compliance) that require distinct sign-offs before a partner is approved?
3. **Production API Key Lifecycles**: When a manager clicks "Approve," should the system automatically provision production credentials via an automated vault (e.g. AWS Secrets Manager/HashiCorp Vault), or is there a manual/security-gated key handoff?
4. **Webhook Validation & Security**: Will webhook setups require automated validation handshakes (e.g. challenge requests) or support custom request headers / HMAC-SHA256 signature verification?
5. **Localization Defaults**: Are billing currencies and deductible ranges hard-coded based on the partner's country/region selection, or should they remain completely configurable?

---

## 🛠️ Quick Start (Local Run)

To run this application locally:

1. Navigate to the project directory:
   ```bash
   cd /Users/ankit/workspace/partner-onboarding-portal
   ```
2. Start Python's built-in HTTP server:
   ```bash
   python3 -m http.server 8080
   ```
3. Open your browser to: **[http://localhost:8080](http://localhost:8080)**
