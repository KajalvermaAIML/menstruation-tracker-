"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Droplets,
  Activity,
  Smile,
  Thermometer,
  Calendar,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  DayLog,
  FlowIntensity,
  PhysicalSymptom,
  MoodType,
  CervicalMucus,
} from "@/lib/types";
import { formatHumanDate } from "@/lib/utils";

interface QuickLoggerDrawerProps {
  isOpen: boolean;
  dateStr: string;
  existingLog?: DayLog;
  onClose: () => void;
  onSave: (log: Partial<DayLog> & { date: string }) => void;
  onDelete: (dateStr: string) => void;
}

const FLOW_OPTIONS: { id: FlowIntensity; label: string; iconScale: number }[] = [
  { id: "none", label: "None", iconScale: 0 },
  { id: "spotting", label: "Spotting", iconScale: 1 },
  { id: "light", label: "Light", iconScale: 2 },
  { id: "medium", label: "Medium", iconScale: 3 },
  { id: "heavy", label: "Heavy", iconScale: 4 },
];

const SYMPTOM_OPTIONS: { id: PhysicalSymptom; label: string }[] = [
  { id: "cramps", label: "Cramps" },
  { id: "headache", label: "Headache" },
  { id: "fatigue", label: "Fatigue" },
  { id: "bloating", label: "Bloating" },
  { id: "acne", label: "Acne" },
  { id: "tender_breasts", label: "Tender Breasts" },
  { id: "backache", label: "Backache" },
  { id: "nausea", label: "Nausea" },
  { id: "insomnia", label: "Insomnia" },
];

const MOOD_OPTIONS: { id: MoodType; label: string }[] = [
  { id: "neutral", label: "Neutral" },
  { id: "elevated", label: "Elevated" },
  { id: "low", label: "Low" },
  { id: "anxious", label: "Anxious" },
  { id: "energized", label: "Energized" },
  { id: "calm", label: "Calm" },
  { id: "irritated", label: "Irritated" },
];

const MUCUS_OPTIONS: { id: CervicalMucus; label: string }[] = [
  { id: "dry", label: "Dry" },
  { id: "sticky", label: "Sticky" },
  { id: "creamy", label: "Creamy" },
  { id: "egg_white", label: "Egg White (Fertile)" },
  { id: "watery", label: "Watery" },
];

export const QuickLoggerDrawer: React.FC<QuickLoggerDrawerProps> = ({
  isOpen,
  dateStr,
  existingLog,
  onClose,
  onSave,
  onDelete,
}) => {
  // Form State
  const [flow, setFlow] = useState<FlowIntensity>("none");
  const [symptoms, setSymptoms] = useState<PhysicalSymptom[]>([]);
  const [mood, setMood] = useState<MoodType | undefined>(undefined);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [cervicalMucus, setCervicalMucus] = useState<CervicalMucus | undefined>(
    undefined
  );
  const [bbt, setBbt] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [showFertilityInputs, setShowFertilityInputs] = useState(false);

  // Sync internal state when existingLog or date changes
  useEffect(() => {
    if (existingLog) {
      setFlow(existingLog.flow || "none");
      setSymptoms(existingLog.symptoms || []);
      setMood(existingLog.mood);
      setEnergyLevel(existingLog.energyLevel || 3);
      setCervicalMucus(existingLog.cervicalMucus);
      setBbt(existingLog.basalBodyTemp ? String(existingLog.basalBodyTemp) : "");
      setNotes(existingLog.notes || "");
      if (existingLog.basalBodyTemp || existingLog.cervicalMucus) {
        setShowFertilityInputs(true);
      }
    } else {
      setFlow("none");
      setSymptoms([]);
      setMood(undefined);
      setEnergyLevel(3);
      setCervicalMucus(undefined);
      setBbt("");
      setNotes("");
    }
  }, [existingLog, dateStr, isOpen]);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleSymptom = (sym: PhysicalSymptom) => {
    setSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSave = () => {
    onSave({
      date: dateStr,
      flow,
      symptoms,
      mood,
      energyLevel,
      cervicalMucus,
      basalBodyTemp: bbt ? parseFloat(bbt) : undefined,
      notes: notes.trim(),
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(dateStr);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-stone-950/40 backdrop-blur-sm transition-opacity"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="fixed inset-y-0 right-0 flex max-w-full pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md border-l border-stone-200/80 bg-white shadow-2xl transition-all dark:border-stone-800 dark:bg-stone-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200/80 px-6 py-4.5 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-stone-400" />
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  {formatHumanDate(dateStr)}
                </h3>
              </div>
              <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                Log flow, physiological symptoms, and daily biomarkers
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Body - Scrollable */}
          <div className="h-[calc(100vh-140px)] space-y-6 overflow-y-auto px-6 py-5">
            {/* 1. Flow Intensity */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                <Droplets className="h-4 w-4 text-rosewood-500" />
                Menstrual Flow Intensity
              </label>
              <div className="mt-2.5 grid grid-cols-5 gap-1.5">
                {FLOW_OPTIONS.map((opt) => {
                  const isSelected = flow === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFlow(opt.id)}
                      className={`flex flex-col items-center justify-center rounded-xl border py-2.5 text-xs font-medium transition-all ${
                        isSelected
                          ? "border-rosewood-500 bg-rosewood-500 text-white shadow-sm"
                          : "border-stone-200 bg-stone-50/50 text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-800/40 dark:text-stone-300 dark:hover:bg-stone-800"
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Physical Symptoms */}
            <div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  <Activity className="h-4 w-4 text-stone-500" />
                  Physical Symptoms
                </label>
                {symptoms.length > 0 && (
                  <span className="text-[11px] text-stone-400">
                    {symptoms.length} selected
                  </span>
                )}
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {SYMPTOM_OPTIONS.map((sym) => {
                  const isSelected = symptoms.includes(sym.id);
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => toggleSymptom(sym.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        isSelected
                          ? "border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                          : "border-stone-200/90 bg-stone-50/60 text-stone-600 hover:border-stone-300 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-300"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      {sym.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Mood & Energy */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                <Smile className="h-4 w-4 text-amber-500" />
                Mood & Emotional State
              </label>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {MOOD_OPTIONS.map((m) => {
                  const isSelected = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(isSelected ? undefined : m.id)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                        isSelected
                          ? "border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-200"
                          : "border-stone-200/90 bg-stone-50/60 text-stone-600 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-800/40 dark:text-stone-300"
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>

              {/* Energy Level Stepper */}
              <div className="mt-4 rounded-xl border border-stone-100 bg-stone-50/50 p-3 dark:border-stone-800/60 dark:bg-stone-800/30">
                <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                  <span>Energy Level:</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {energyLevel} of 5
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEnergyLevel(lvl)}
                      className={`h-8 flex-1 rounded-lg text-xs font-medium transition-all ${
                        energyLevel === lvl
                          ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                          : "bg-stone-200/80 text-stone-600 hover:bg-stone-300 dark:bg-stone-700/60 dark:text-stone-300"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Fertility Tracking (Toggleable) */}
            <div className="rounded-xl border border-stone-200/80 bg-stone-50/40 p-3.5 dark:border-stone-800 dark:bg-stone-800/20">
              <button
                type="button"
                onClick={() => setShowFertilityInputs(!showFertilityInputs)}
                className="flex w-full items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300"
              >
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-stone-500" />
                  <span>Fertility Biomarkers (BBT & Mucus)</span>
                </div>
                {showFertilityInputs ? (
                  <ChevronUp className="h-4 w-4 text-stone-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-stone-400" />
                )}
              </button>

              {showFertilityInputs && (
                <div className="mt-3.5 space-y-4 border-t border-stone-200/60 pt-3 dark:border-stone-800">
                  {/* Basal Body Temperature */}
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 dark:text-stone-400">
                      Basal Body Temp (°C or °F)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      placeholder="e.g. 36.65"
                      value={bbt}
                      onChange={(e) => setBbt(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                    />
                  </div>

                  {/* Cervical Mucus */}
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 dark:text-stone-400">
                      Cervical Fluid Consistency
                    </label>
                    <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                      {MUCUS_OPTIONS.map((muc) => {
                        const isSelected = cervicalMucus === muc.id;
                        return (
                          <button
                            key={muc.id}
                            type="button"
                            onClick={() =>
                              setCervicalMucus(isSelected ? undefined : muc.id)
                            }
                            className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition ${
                              isSelected
                                ? "border-sage-600 bg-sage-50 text-sage-900 dark:border-sage-600 dark:bg-sage-950/60 dark:text-sage-200"
                                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                            }`}
                          >
                            {muc.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Private Notes Field */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Private Clinical Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log physical sensations, medications, sleep quality, or reflections..."
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white p-3 text-xs text-stone-900 placeholder-stone-400 shadow-sm focus:border-stone-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-stone-200/80 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/95">
            {existingLog ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="h-4 w-4" />
                Clear Entry
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-5 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-stone-800 active:scale-[0.98] dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

