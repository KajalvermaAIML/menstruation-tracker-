Act as a Principal Frontend Architect and Senior Product Designer. Build a production-ready, highly minimal, and professional menstrual cycle tracking web application using Next.js (App Router), Tailwind CSS, Lucide icons, and TypeScript.

### 1. Aesthetic & Design System
- Tone: Clinical elegance, discreet, calm, and uncluttered. Avoid stereotypical bright pinks, floral motifs, or childish illustrations.
- Color Palette: 
  - Neutral Base: Warm off-white/cream background (#FBFBFA or slate-50) with deep slate/charcoal text (#1E293B).
  - Accents: Subtle terracotta, soft rosewood (#C27A72 or #D9776E), muted sage, and warm taupe for status pills and cycle phases.
  - Dark Mode: Deep zinc/charcoal background (#09090B), soft off-white text, and desaturated accents.
- Typography: Clean sans-serif (Inter, Geist, or Plus Jakarta Sans). High readability, strict typographic scale, generous white space, and subtle border dividers (slate-200/slate-800).

### 2. Core Functional Requirements
1. Cycle Status Hero Card:
   - Displays current cycle day (e.g., "Day 14"), predicted phase (Menstrual, Follicular, Ovulatory, Luteal), and days until next predicted period.
   - Minimal circular progress ring or discreet segmented progress bar showing the phase of the cycle.
2. Interactive Calendar View:
   - Clean monthly grid with discreet dot indicators or muted color washes for:
     - Logged period days (solid muted rosewood)
     - Predicted period window (dashed/subtle wash)
     - Estimated ovulation window (soft amber/sage highlight)
   - Clickable dates opening an intuitive day-detail sheet or popover.
3. Daily Log Drawer / Quick-Logger:
   - Ultra-fast entry modal or side drawer to log:
     - Flow intensity: Spotting, Light, Medium, Heavy.
     - Physical symptoms: Cramps, Headache, Fatigue, Bloating, Acne, Tender breasts (toggleable pill chips).
     - Mood / Energy: Neutral, Elevated, Low, Anxious, Energized (compact slider or discrete chips).
     - Cervical mucus / Basal Body Temp (optional toggleable inputs for fertility tracking).
     - Private notes field.
4. Privacy & Data Architecture:
   - Client-first architecture: Store all logs in LocalStorage or IndexedDB by default with zero tracking or telemetry.
   - Include a "Privacy & Data" section with one-click export (JSON / CSV), one-click import, and an instant "Wipe all data" button.
5. Cycle Insights & Statistics (Minimalist):
   - Average cycle length (e.g., 28 days) and average period duration (e.g., 5 days) calculated dynamically from historical entries.
   - Clean horizontal timeline or sparkline tracking cycle regularity over the last 6 months.

### 3. Technical & UX Guardrails
- State Management: React state + custom hooks synced to localStorage.
- Accessibility & Responsiveness: Fully mobile-first responsive layout (works seamlessly on mobile Safari/Chrome as a PWA, with desktop-optimized wide drawer/sidebar view).
- Animations: Micro-interactions only using Tailwind transitions or Framer Motion (smooth phase transitions, tactile button presses).
- Component Modularity: Separate components cleanly into `/components/calendar`, `/components/logger`, `/components/dashboard`, and `/lib/cycle-math.ts`.

Provide the complete file architecture and the production-ready code for the core dashboard, calendar grid, and cycle calculation hook.