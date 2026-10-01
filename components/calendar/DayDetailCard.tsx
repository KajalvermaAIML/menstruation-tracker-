"use client";

import React from "react";
import { DayLog, CycleCalculations } from "@/lib/types";
import { formatHumanDate } from "@/lib/utils";
import {
  Droplets,
  Heart,
  Smile,
  Thermometer,
  FileText,
  Edit3,
  Calendar,
  Trash2,
} from "lucide-react";

interface DayDetailCardProps {
  selectedDate: string;
  log?: DayLog;
  calculations: CycleCalculations;
  onOpenLogger: (dateStr: string) => void;
  onDeleteLog: (dateStr: string) => void;
}

const FLOW_LABELS: Record<string, string> = {
  none: "No Flow",
  spotting: "Spotting",
  light: "Light Flow",
  medium: "Medium Flow",
  heavy: "Heavy Flow",
};

const SYMPTOM_LABELS: Record<string, string> = {
  cramps: "Cramps",
  headache: "Headache",
  fatigue: "Fatigue",
  bloating: "Bloating",
  acne: "Acne",
  tender_breasts: "Tender Breasts",
  backache: "Backache",
  nausea: "Nausea",
  insomnia: "Insomnia",
};

export const DayDetailCard: React.FC<DayDetailCardProps> = ({
  selectedDate,
  log,
  calculations,
  onOpenLogger,
  onDeleteLog,
}) => {
  const isPeriod = log && log.flow && log.flow !== "none";
  const hasLog = Boolean(
    log &&
      ((log.flow && log.flow !== "none") ||
        (log.symptoms && log.symptoms.length > 0) ||
        log.mood ||
        log.energyLevel ||
        log.basalBodyTemp ||
        log.cervicalMucus ||
        (log.notes && log.notes.trim()))
  );

  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-md transition-all dark:border-stone-800/80 dark:bg-stone-900/80">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-stone-400" />
          <h4 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            {formatHumanDate(selectedDate)}
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          {hasLog && (
            <button
              onClick={() => onDeleteLog(selectedDate)}
              title="Delete log for this day"
              className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-rose-600 dark:hover:bg-stone-800"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => onOpenLogger(selectedDate)}
            className="inline-flex items-center gap-1 rounded-lg bg-stone-900 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
          >
            <Edit3 className="h-3 w-3" />
            {hasLog ? "Edit Log" : "Quick Log"}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3.5 text-xs">
        {/* Flow Intensity Status */}
        <div className="flex items-start gap-2.5">
          <Droplets
            className={`mt-0.5 h-4 w-4 shrink-0 ${
              isPeriod ? "text-rosewood-500" : "text-stone-400"
            }`}
          />
          <div>
            <span className="font-medium text-stone-500 dark:text-stone-400">
              Flow Intensity:{" "}
            </span>
            <span
              className={`font-semibold ${
                isPeriod
                  ? "text-rosewood-600 dark:text-rosewood-400"
                  : "text-stone-700 dark:text-stone-300"
              }`}
            >
              {log?.flow ? FLOW_LABELS[log.flow] || "None" : "None recorded"}
            </span>
          </div>
        </div>

        {/* Symptoms */}
        <div className="flex items-start gap-2.5">
          <Heart className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
          <div className="flex-1">
            <span className="font-medium text-stone-500 dark:text-stone-400">
              Symptoms:{" "}
            </span>
            {log?.symptoms && log.symptoms.length > 0 ? (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {log.symptoms.map((s) => (
                  <span
                    key={s}
                    className="inline-block rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                  >
                    {SYMPTOM_LABELS[s] || s}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-stone-500">None logged</span>
            )}
          </div>
        </div>

        {/* Mood & Energy */}
        <div className="flex items-start gap-2.5">
          <Smile className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
          <div>
            <span className="font-medium text-stone-500 dark:text-stone-400">
              Mood & Energy:{" "}
            </span>
            <span className="capitalize text-stone-700 dark:text-stone-300">
              {log?.mood ? `${log.mood}` : "None logged"}
              {log?.energyLevel ? ` (Energy: ${log.energyLevel}/5)` : ""}
            </span>
          </div>
        </div>

        {/* BBT / Cervical Mucus if present */}
        {(log?.basalBodyTemp || log?.cervicalMucus) && (
          <div className="flex items-start gap-2.5">
            <Thermometer className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div>
              <span className="font-medium text-stone-500 dark:text-stone-400">
                Fertility Markers:{" "}
              </span>
              <span className="text-stone-700 dark:text-stone-300">
                {log.basalBodyTemp && `BBT: ${log.basalBodyTemp}° `}
                {log.cervicalMucus && `• Mucus: ${log.cervicalMucus.replace("_", " ")}`}
              </span>
            </div>
          </div>
        )}

        {/* Notes */}
        {log?.notes && (
          <div className="flex items-start gap-2.5 rounded-xl border border-stone-100 bg-stone-50/60 p-2.5 dark:border-stone-800/80 dark:bg-stone-800/40">
            <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-400" />
            <p className="italic text-stone-600 dark:text-stone-300">
              &ldquo;{log.notes}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
