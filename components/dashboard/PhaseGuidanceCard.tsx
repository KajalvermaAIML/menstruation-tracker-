"use client";

import React from "react";
import { CyclePhase } from "@/lib/types";
import { PHASE_METRICS } from "@/lib/cycle-math";
import { Zap, Apple, Moon, Compass } from "lucide-react";

interface PhaseGuidanceCardProps {
  currentPhase: CyclePhase;
}

const PHASE_DETAILS: Record<
  CyclePhase,
  {
    nutrition: string;
    movement: string;
    cognition: string;
    sleep: string;
  }
> = {
  menstrual: {
    nutrition: "Warm broths, leafy greens rich in iron, zinc, and magnesium.",
    movement: "Restorative yoga, gentle walking, and mindful stretching.",
    cognition: "Heightened intuition, evaluation of priorities, quiet reflection.",
    sleep: "Allow extra recovery sleep (8–9 hours); warm compress for lower pelvic ease.",
  },
  follicular: {
    nutrition: "Fermented foods, sprouted seeds, lean proteins to support rising estrogen.",
    movement: "Progressive resistance training, interval running, trying new sports.",
    cognition: "Novel ideation, brainstorming, strategic planning, and swift learning.",
    sleep: "Naturally elevated morning alertness; consistent wake times.",
  },
  ovulatory: {
    nutrition: "Cruciferous vegetables (supports estrogen metabolism), antioxidants, berry blends.",
    movement: "Peak exertion workouts, high-intensity cardio, power lifting.",
    cognition: "High verbal articulation, social confidence, presentation delivery.",
    sleep: "Stay cool at night as basal temperature begins its post-surge rise.",
  },
  luteal: {
    nutrition: "Complex carbs (sweet potatoes, oats), pumpkin seeds, B6-rich foods.",
    movement: "Steady-state aerobic work, Pilates, resistance circuits with longer rests.",
    cognition: "Detail-oriented completion, deep work, auditing, administrative tasks.",
    sleep: "Cool sleeping environment; wind down 1 hour earlier with magnesium glycinate.",
  },
};

export const PhaseGuidanceCard: React.FC<PhaseGuidanceCardProps> = ({
  currentPhase,
}) => {
  const phaseInfo = PHASE_METRICS[currentPhase];
  const guidance = PHASE_DETAILS[currentPhase];

  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md transition-all dark:border-stone-800/80 dark:bg-stone-900/80">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-stone-500" />
          <h3 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Physiological Phase Guidance
          </h3>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${phaseInfo.badgeBg} ${phaseInfo.badgeText}`}
        >
          {phaseInfo.label} Focus
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
        {/* Nutrition */}
        <div className="rounded-xl border border-stone-100 bg-stone-50/50 p-3.5 dark:border-stone-800/60 dark:bg-stone-800/30">
          <div className="flex items-center gap-1.5 font-medium text-stone-800 dark:text-stone-200">
            <Apple className="h-3.5 w-3.5 text-sage-600 dark:text-sage-400" />
            <span>Nourishment & Micronutrients</span>
          </div>
          <p className="mt-1.5 text-stone-600 dark:text-stone-300 leading-relaxed">
            {guidance.nutrition}
          </p>
        </div>

        {/* Movement */}
        <div className="rounded-xl border border-stone-100 bg-stone-50/50 p-3.5 dark:border-stone-800/60 dark:bg-stone-800/30">
          <div className="flex items-center gap-1.5 font-medium text-stone-800 dark:text-stone-200">
            <Zap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Movement & Training Capacity</span>
          </div>
          <p className="mt-1.5 text-stone-600 dark:text-stone-300 leading-relaxed">
            {guidance.movement}
          </p>
        </div>

        {/* Cognitive */}
        <div className="rounded-xl border border-stone-100 bg-stone-50/50 p-3.5 dark:border-stone-800/60 dark:bg-stone-800/30">
          <div className="flex items-center gap-1.5 font-medium text-stone-800 dark:text-stone-200">
            <Compass className="h-3.5 w-3.5 text-rosewood-600 dark:text-rosewood-400" />
            <span>Cognitive & Energy Rhythm</span>
          </div>
          <p className="mt-1.5 text-stone-600 dark:text-stone-300 leading-relaxed">
            {guidance.cognition}
          </p>
        </div>

        {/* Recovery */}
        <div className="rounded-xl border border-stone-100 bg-stone-50/50 p-3.5 dark:border-stone-800/60 dark:bg-stone-800/30">
          <div className="flex items-center gap-1.5 font-medium text-stone-800 dark:text-stone-200">
            <Moon className="h-3.5 w-3.5 text-taupe-600 dark:text-taupe-400" />
            <span>Rest & Circadian Alignment</span>
          </div>
          <p className="mt-1.5 text-stone-600 dark:text-stone-300 leading-relaxed">
            {guidance.sleep}
          </p>
        </div>
      </div>
    </div>
  );
};

