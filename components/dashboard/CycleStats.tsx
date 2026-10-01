"use client";

import React from "react";
import { CycleCalculations } from "@/lib/types";
import { Activity, Clock, ShieldCheck, TrendingUp, Info } from "lucide-react";

interface CycleStatsProps {
  calculations: CycleCalculations;
}

export const CycleStats: React.FC<CycleStatsProps> = ({ calculations }) => {
  const {
    avgCycleLength,
    avgPeriodDuration,
    regularityScore,
    cycleHistory,
  } = calculations;

  // Last 6 cycles (or pad if fewer)
  const displayCycles = [...cycleHistory].slice(-6);

  // Sparkline coordinates
  const maxDays = Math.max(35, ...displayCycles.map((c) => c.lengthDays));
  const minDays = Math.min(22, ...displayCycles.map((c) => c.lengthDays));
  const range = Math.max(10, maxDays - minDays);

  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md transition-all dark:border-stone-800/80 dark:bg-stone-900/80">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Cycle Insights & Biometrics
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Dynamic statistics derived from historical menstrual logs
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
          <Activity className="h-3 w-3 text-stone-500" />
          {cycleHistory.length > 0
            ? `${cycleHistory.length} Cycles Analyzed`
            : "Baseline Calibration"}
        </span>
      </div>

      {/* 3 Metric cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Metric 1 */}
        <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-4 transition hover:border-stone-200 dark:border-stone-800/70 dark:bg-stone-800/40">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Avg Cycle Length</span>
            <Clock className="h-3.5 w-3.5 text-stone-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-light text-stone-900 dark:text-stone-100">
              {avgCycleLength}
            </span>
            <span className="text-xs text-stone-500">days</span>
          </div>
          <p className="mt-1 text-[11px] text-stone-500">
            Standard clinical range: 24–38 days
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-4 transition hover:border-stone-200 dark:border-stone-800/70 dark:bg-stone-800/40">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Avg Period Bleed</span>
            <span className="h-2 w-2 rounded-full bg-rosewood-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-light text-rosewood-700 dark:text-rosewood-400">
              {avgPeriodDuration}
            </span>
            <span className="text-xs text-stone-500">days</span>
          </div>
          <p className="mt-1 text-[11px] text-stone-500">
            Consistent flow duration
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-4 transition hover:border-stone-200 dark:border-stone-800/70 dark:bg-stone-800/40">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Regularity Score</span>
            <ShieldCheck className="h-3.5 w-3.5 text-sage-600 dark:text-sage-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-light text-sage-700 dark:text-sage-400">
              {regularityScore}%
            </span>
            <span className="text-xs text-stone-500">predictability</span>
          </div>
          <p className="mt-1 text-[11px] text-stone-500">
            Low standard deviation across logs
          </p>
        </div>
      </div>

      {/* 6-Month Regularity Sparkline & Horizontal Timeline */}
      <div className="mt-6 rounded-xl border border-stone-100 bg-stone-50/50 p-4 dark:border-stone-800/70 dark:bg-stone-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-700 dark:text-stone-300">
            <TrendingUp className="h-3.5 w-3.5 text-stone-500" />
            <span>Cycle Length Regularity (Recent Cycles)</span>
          </div>
          <span className="text-[11px] text-stone-400">Baseline: 28 Days</span>
        </div>

        {displayCycles.length >= 1 ? (
          <div className="mt-4">
            {/* Horizontal Timeline Bar Group */}
            <div className="space-y-3">
              {displayCycles.map((cycle, idx) => {
                const diff = cycle.lengthDays - 28;
                const isBaseline = diff === 0;
                const isLonger = diff > 0;

                return (
                  <div
                    key={cycle.cycleNumber || idx}
                    className="flex items-center gap-3 text-xs"
                  >
                    <span className="w-16 font-mono text-[11px] text-stone-500">
                      {cycle.startDate.slice(5)}
                    </span>

                    {/* Bar visualization */}
                    <div className="relative flex-1">
                      <div className="h-2 w-full rounded-full bg-stone-200/80 dark:bg-stone-800">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(20, (cycle.lengthDays / 35) * 100)
                            )}%`,
                            backgroundColor:
                              Math.abs(diff) <= 2
                                ? "#7E9987" // Sage for regular
                                : "#D49D42", // Amber for slight deviation
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex w-24 items-center justify-end gap-1.5 font-mono text-[11px]">
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {cycle.lengthDays}d
                      </span>
                      <span
                        className={`text-[10px] ${
                          isBaseline
                            ? "text-stone-400"
                            : isLonger
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-sage-600 dark:text-sage-400"
                        }`}
                      >
                        ({diff > 0 ? `+${diff}` : diff === 0 ? "±0" : `${diff}`})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sparkline Visual SVG */}
            <div className="mt-4 border-t border-stone-200/60 pt-3 dark:border-stone-800">
              <div className="flex h-16 w-full items-end gap-2 px-1">
                {displayCycles.map((cycle, i) => {
                  const normalizedHeight =
                    ((cycle.lengthDays - minDays) / range) * 100;
                  const heightPercent = Math.max(18, Math.min(95, normalizedHeight));

                  return (
                    <div
                      key={i}
                      className="group relative flex flex-1 flex-col items-center justify-end h-full"
                    >
                      <div
                        className="w-full rounded-t-md bg-stone-300 transition-all hover:bg-stone-400 dark:bg-stone-700 dark:hover:bg-stone-600"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="mt-1 text-[10px] text-stone-400">
                        C{cycle.cycleNumber || i + 1}
                      </span>

                      {/* Tooltip on hover */}
                      <div className="pointer-events-none absolute -top-8 z-10 hidden rounded bg-stone-900 px-1.5 py-0.5 text-[10px] text-white shadow group-hover:block dark:bg-stone-100 dark:text-stone-900">
                        {cycle.lengthDays}d ({cycle.periodDurationDays}d flow)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
            <Info className="h-4 w-4 text-stone-400" />
            <span>
              Log consecutive cycles to unlock automated regularity timeline.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

