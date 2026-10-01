"use client";

import React from "react";
import { CycleCalculations } from "@/lib/types";
import { PHASE_METRICS } from "@/lib/cycle-math";
import { PlusCircle, Calendar as CalendarIcon, Sparkles } from "lucide-react";

interface CycleHeroCardProps {
  calculations: CycleCalculations;
  onOpenLogger: () => void;
}

export const CycleHeroCard: React.FC<CycleHeroCardProps> = ({
  calculations,
  onOpenLogger,
}) => {
  const {
    currentCycleDay,
    totalCycleDays,
    currentPhase,
    phaseProgress,
    daysUntilNextPeriod,
    nextPeriodStartDate,
  } = calculations;

  const currentPhaseConfig = PHASE_METRICS[currentPhase];

  // SVG Circular progress math
  const size = 190;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc offset
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(2, phaseProgress)) / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-stone-800/80 dark:bg-stone-900/80 dark:shadow-none">
      {/* Subtle background ambient glow tailored to the active phase */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-15 blur-3xl transition-colors duration-500"
        style={{ backgroundColor: currentPhaseConfig.accentColor }}
      />

      <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center">
        {/* Left: Prominent Progress Ring */}
        <div className="relative flex shrink-0 items-center justify-center">
          <svg
            width={size}
            height={size}
            className="-rotate-90 transform"
            aria-label={`Cycle progress: Day ${currentCycleDay} of ${totalCycleDays}`}
          >
            {/* Background ring track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-stone-100 dark:text-stone-800/90"
              fill="transparent"
            />
            {/* Active progress stroke */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={currentPhaseConfig.accentColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Info inside ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium tracking-widest text-stone-500 uppercase dark:text-stone-400">
              Cycle Day
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-4xl font-light tracking-tight text-stone-900 dark:text-stone-100">
                {currentCycleDay}
              </span>
              <span className="text-xs text-stone-400 dark:text-stone-500">
                /{totalCycleDays}
              </span>
            </div>
            <span className="mt-1 text-[11px] font-medium text-stone-600 dark:text-stone-400">
              {phaseProgress}% elapsed
            </span>
          </div>
        </div>

        {/* Right / Center Content */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          {/* Status pill badge */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${currentPhaseConfig.badgeBg} ${currentPhaseConfig.badgeText}`}
            >
              <span
                className="h-2 w-2 rounded-full animate-pulse-subtle"
                style={{ backgroundColor: currentPhaseConfig.accentColor }}
              />
              {currentPhaseConfig.name}
            </div>

            <span className="inline-flex items-center gap-1 rounded-full border border-stone-200/80 bg-stone-50 px-2.5 py-1 text-[11px] text-stone-600 dark:border-stone-800 dark:bg-stone-800/60 dark:text-stone-300">
              <CalendarIcon className="h-3 w-3 text-stone-400" />
              {daysUntilNextPeriod === 0
                ? "Period expected today"
                : `${daysUntilNextPeriod} days to period`}
            </span>
          </div>

          {/* Phase Summary & Physiological Guidance */}
          <div className="mt-3.5 space-y-1.5">
            <h2 className="text-xl font-medium tracking-tight text-stone-900 dark:text-stone-50">
              {currentPhase === "menstrual" && "Restorative bleed phase"}
              {currentPhase === "follicular" && "Follicular renewal & vitality"}
              {currentPhase === "ovulatory" && "Peak ovulatory window"}
              {currentPhase === "luteal" && "Luteal stabilization & focus"}
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              {currentPhaseConfig.physiologicalNote}
            </p>
          </div>

          {/* Discreet 4-Phase Segmented Bar */}
          <div className="mt-4 w-full max-w-sm space-y-1.5">
            <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
              <span className={currentPhase === "menstrual" ? "font-semibold text-rosewood-600 dark:text-rosewood-400" : ""}>
                Menstrual
              </span>
              <span className={currentPhase === "follicular" ? "font-semibold text-sage-600 dark:text-sage-400" : ""}>
                Follicular
              </span>
              <span className={currentPhase === "ovulatory" ? "font-semibold text-amber-600 dark:text-amber-400" : ""}>
                Ovulatory
              </span>
              <span className={currentPhase === "luteal" ? "font-semibold text-taupe-600 dark:text-taupe-300" : ""}>
                Luteal
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  currentPhase === "menstrual"
                    ? "bg-rosewood-500"
                    : "bg-stone-200 dark:bg-stone-800"
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  currentPhase === "follicular"
                    ? "bg-sage-500"
                    : "bg-stone-200 dark:bg-stone-800"
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  currentPhase === "ovulatory"
                    ? "bg-amber-500"
                    : "bg-stone-200 dark:bg-stone-800"
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  currentPhase === "luteal"
                    ? "bg-taupe-500"
                    : "bg-stone-200 dark:bg-stone-800"
                }`}
              />
            </div>
          </div>

          {/* Quick CTA */}
          <div className="mt-5 flex w-full flex-wrap items-center justify-center gap-3 md:justify-start">
            <button
              onClick={onOpenLogger}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-stone-800 active:scale-[0.98] dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
            >
              <PlusCircle className="h-4 w-4" />
              Log Today&apos;s Symptoms & Flow
            </button>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Next period predicted around {nextPeriodStartDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

