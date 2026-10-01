"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Shield,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sliders,
} from "lucide-react";
import { UserSettings } from "@/lib/types";

interface PrivacyDataModalProps {
  isOpen: boolean;
  settings: UserSettings;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onImportJSON: (jsonStr: string) => boolean;
  onLoadDemoData: () => void;
  onWipeData: () => void;
}

export const PrivacyDataModal: React.FC<PrivacyDataModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
  onExportJSON,
  onExportCSV,
  onImportJSON,
  onLoadDemoData,
  onWipeData,
}) => {
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const success = onImportJSON(text);
        if (success) {
          setImportStatus("Data imported successfully");
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus("Import failed: invalid format");
        }
      } catch (err) {
        setImportStatus("Import error");
      }
    };
    reader.readAsText(file);
  };

  const handleWipe = () => {
    onWipeData();
    setConfirmWipe(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xl transition-all dark:border-stone-800 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-50 text-sage-700 dark:bg-sage-950/60 dark:text-sage-300">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                Privacy, Data & Calibration
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                100% Client-side • Zero Tracking • Total Sovereignty
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-6 text-xs text-stone-600 dark:text-stone-400">
          {/* Privacy Guarantee Banner */}
          <div className="flex items-start gap-3 rounded-xl border border-stone-200/60 bg-stone-50/70 p-3.5 dark:border-stone-800/80 dark:bg-stone-800/40">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-stone-600 dark:text-stone-300" />
            <div className="text-xs leading-relaxed text-stone-600 dark:text-stone-300">
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                Strict Local Isolation:
              </span>{" "}
              Your biological logs, symptoms, and physiological notes never leave your browser. We employ zero external trackers, analytics, or remote database synchronization.
            </div>
          </div>

          {/* Cycle Parameters Calibration */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
              <Sliders className="h-3.5 w-3.5 text-stone-500" />
              <span>Cycle Baseline Defaults</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-stone-200/80 bg-white p-3 dark:border-stone-800 dark:bg-stone-800/50">
                <label className="text-[11px] font-medium text-stone-500">
                  Default Cycle Length
                </label>
                <div className="mt-1 flex items-baseline gap-1">
                  <input
                    type="number"
                    min={21}
                    max={45}
                    value={settings.defaultCycleLength}
                    onChange={(e) =>
                      onUpdateSettings({
                        defaultCycleLength: Number(e.target.value) || 28,
                      })
                    }
                    className="w-16 rounded border border-stone-200 bg-stone-50 px-2 py-1 text-sm font-semibold text-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                  />
                  <span className="text-xs text-stone-400">days</span>
                </div>
              </div>

              <div className="rounded-xl border border-stone-200/80 bg-white p-3 dark:border-stone-800 dark:bg-stone-800/50">
                <label className="text-[11px] font-medium text-stone-500">
                  Default Period Duration
                </label>
                <div className="mt-1 flex items-baseline gap-1">
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={settings.defaultPeriodLength}
                    onChange={(e) =>
                      onUpdateSettings({
                        defaultPeriodLength: Number(e.target.value) || 5,
                      })
                    }
                    className="w-16 rounded border border-stone-200 bg-stone-50 px-2 py-1 text-sm font-semibold text-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                  />
                  <span className="text-xs text-stone-400">days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Backup, Export & Import */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
              One-Click Data Portability
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onExportJSON}
                className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50/70 py-2.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                <Download className="h-3.5 w-3.5 text-stone-500" />
                Export JSON Backup
              </button>

              <button
                type="button"
                onClick={onExportCSV}
                className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50/70 py-2.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                <Download className="h-3.5 w-3.5 text-stone-500" />
                Export CSV Sheet
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 py-2.5 text-xs font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800/50"
              >
                <Upload className="h-3.5 w-3.5 text-stone-500" />
                Restore from JSON File
              </button>

              <button
                type="button"
                onClick={onLoadDemoData}
                title="Populate 6-month clinical demo cycles"
                className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Demo Data
              </button>
            </div>

            {importStatus && (
              <p className="flex items-center gap-1 text-[11px] text-sage-600 dark:text-sage-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {importStatus}
              </p>
            )}
          </div>

          {/* Danger Zone: Wipe all data */}
          <div className="rounded-xl border border-rose-200/80 bg-rose-50/40 p-4 dark:border-rose-950/80 dark:bg-rose-950/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-rose-900 dark:text-rose-200">
                  Wipe All Stored Data
                </h4>
                <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80">
                  Permanently erase all historical period logs and local settings
                </p>
              </div>

              {!confirmWipe ? (
                <button
                  type="button"
                  onClick={() => setConfirmWipe(true)}
                  className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 dark:border-rose-800 dark:bg-stone-900 dark:text-rose-300 dark:hover:bg-rose-950/50"
                >
                  Wipe Data
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setConfirmWipe(false)}
                    className="rounded-lg bg-stone-200 px-2 py-1 text-[11px] text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleWipe}
                    className="rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-rose-700"
                  >
                    Confirm Wipe
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end border-t border-stone-100 pt-3 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

