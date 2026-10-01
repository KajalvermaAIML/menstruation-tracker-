# Aurea — Clinical Menstrual Cycle Intelligence

A production-ready, highly minimal, and discreet menstrual cycle tracking web application built with Next.js (App Router), Tailwind CSS, Lucide icons, and TypeScript.

![Aurea Cycle Intelligence](https://raw.githubusercontent.com/KajalvermaAIML/menstruation-tracker-/main/public/preview.png)

## Aesthetic & Design Philosophy

- **Clinical Elegance**: Discreet, calm, and uncluttered. Avoids stereotypical bright pinks, floral motifs, or childish illustrations.
- **Color Palette**:
  - Neutral Base: Warm off-white/cream background (`#FBFBFA`) with deep charcoal text (`#1E293B`).
  - Accents: Subtle terracotta, soft rosewood (`#C27A72`), muted sage (`#7E9987`), and warm taupe (`#9C8E84`).
  - Dark Mode: Deep zinc background (`#09090B`) with soft off-white text.
- **Typography**: Clean sans-serif with strict typographic hierarchy and generous breathing room.

## Core Features

1. **Cycle Status Hero Card**:
   - Dynamic cycle day counter (e.g., "Day 14 of 28").
   - Phase indicators: **Menstrual**, **Follicular**, **Ovulatory**, **Luteal**.
   - High-precision SVG circular progress ring and 4-phase segmented bar.
   - Days until next predicted period countdown.

2. **Interactive Calendar View**:
   - Monthly calendar grid with previous/next navigation and "Today" button.
   - Color-coded indicators:
     - **Solid muted rosewood**: Logged period flow.
     - **Dashed soft rosewood border/wash**: Predicted period window.
     - **Warm amber highlight & sage wash**: Estimated ovulation and fertile window.
     - **Micro-dots**: Logged symptoms and notes.
   - Interactive day detail summary card.

3. **Daily Log Drawer / Quick-Logger**:
   - Slide-in drawer with light dismiss.
   - Flow intensity: Spotting, Light, Medium, Heavy.
   - Physical symptoms: Cramps, Headache, Fatigue, Bloating, Acne, Tender Breasts, Backache, Nausea, Insomnia.
   - Mood & Energy: Neutral, Elevated, Low, Anxious, Energized, Calm, Irritated + 1–5 energy level stepper.
   - Fertility tracking: Cervical mucus consistency & Basal Body Temperature (BBT).
   - Private clinical notes field.

4. **Biometric Insights & 6-Month Regularity**:
   - Dynamic average cycle length and period duration calculated from historical logs.
   - Standard deviation predictability index.
   - Horizontal timeline and sparkline tracking cycle regularity over the last 6 months.

5. **Client-First Privacy & Data Sovereignty**:
   - 100% on-device storage via `LocalStorage` — zero cloud tracking or telemetry.
   - 1-Click JSON export and CSV spreadsheet export.
   - 1-Click JSON backup restore with validation.
   - Demo data generator and secure data wipe.

## Getting Started

### Prerequisites

- Node.js 18+ (tested on Node 20+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/KajalvermaAIML/menstruation-tracker-.git
cd menstruation-tracker-

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## License

MIT
