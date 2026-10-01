"use client";

import React from "react";
import { useCycleData } from "@/hooks/use-cycle-data";
import { Header } from "@/components/navigation/Header";
import { CycleHeroCard } from "@/components/dashboard/CycleHeroCard";
import { CycleStats } from "@/components/dashboard/CycleStats";
import { PhaseGuidanceCard } from "@/components/dashboard/PhaseGuidanceCard";
import { CalendarView } from "@/components/calendar/CalendarView";
import { DayDetailCard } from "@/components/calendar/DayDetailCard";
import { QuickLoggerDrawer } from "@/components/logger/QuickLoggerDrawer";
import { PrivacyDataModal } from "@/components/dashboard/PrivacyDataModal";
import { ShieldCheck, Heart } from "lucide-react";
import { toDateString } from "@/lib/cycle-math";

export default function Home() {
  const {
    isHydrated,
    logs,
    settings,
    calculations,
    selectedDate,
    setSelectedDate,
    selectedLog,
    saveLog,
    deleteLog,
    updateSettings,
    wipeAllData,
    loadDemoData,
    exportDataJSON,
    exportDataCSV,
    importDataJSON,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    isPrivacyModalOpen,
    setIsPrivacyModalOpen,
    isPeriodDay,
    isPredictedPeriodDay,
    isOvulationDay,
    isFertileDay,
    hasSymptomsOrNotes,
  } = useCycleData();

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFBFA] dark:bg-[#09090B]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800 dark:border-stone-700 dark:border-t-stone-200" />
          <span className="text-xs font-medium tracking-wider text-stone-500 uppercase">
            Loading Aurea...
          </span>
        </div>
      </div>
    );
  }

  const handleOpenLoggerForToday = () => {
    const todayStr = toDateString(new Date());
    openDrawer(todayStr);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1E293B] transition-colors duration-200 dark:bg-[#09090B] dark:text-[#F8FAFC]">
      {/* Top Header */}
      <Header
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenLoggerToday={handleOpenLoggerForToday}
      />

      {/* Main Workspace Layout */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Hero, Stats & Guidance (7 Columns) */}
          <section className="space-y-6 lg:col-span-7">
            {/* Cycle Status Hero Card */}
            <CycleHeroCard
              calculations={calculations}
              onOpenLogger={() => openDrawer(selectedDate)}
            />

            {/* Cycle Insights & 6-Month Regularity Timeline */}
            <CycleStats calculations={calculations} />

            {/* Physiological Phase Guidance */}
            <PhaseGuidanceCard currentPhase={calculations.currentPhase} />
          </section>

          {/* Right Column: Monthly Calendar & Day Detail Card (5 Columns) */}
          <section className="space-y-6 lg:col-span-5">
            {/* Interactive Calendar View */}
            <CalendarView
              logs={logs}
              calculations={calculations}
              selectedDate={selectedDate}
              onSelectDate={(d) => setSelectedDate(d)}
              onOpenLogger={(d) => openDrawer(d)}
              isPeriodDay={isPeriodDay}
              isPredictedPeriodDay={isPredictedPeriodDay}
              isOvulationDay={isOvulationDay}
              isFertileDay={isFertileDay}
              hasSymptomsOrNotes={hasSymptomsOrNotes}
            />

            {/* Day Detail Card for the selected date */}
            <DayDetailCard
              selectedDate={selectedDate}
              log={selectedLog}
              calculations={calculations}
              onOpenLogger={(d) => openDrawer(d)}
              onDeleteLog={(d) => deleteLog(d)}
            />

            {/* Client Privacy Badge */}
            <div className="flex items-center justify-between rounded-xl border border-stone-200/60 bg-stone-50/60 p-4 text-xs text-stone-500 dark:border-stone-800/80 dark:bg-stone-900/60 dark:text-stone-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sage-600 dark:text-sage-400" />
                <span>Isolated client sandbox • No cloud telemetry</span>
              </div>
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-[11px] font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100"
              >
                Data Settings
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-stone-200/80 py-6 text-center text-xs text-stone-400 dark:border-stone-800/80 dark:text-stone-600">
        <p>Aurea — Clinical Elegance & Menstrual Health Intelligence. On-device storage only.</p>
      </footer>

      {/* Slide-in Quick Logger Drawer */}
      <QuickLoggerDrawer
        isOpen={isDrawerOpen}
        dateStr={selectedDate}
        existingLog={selectedLog}
        onClose={closeDrawer}
        onSave={saveLog}
        onDelete={deleteLog}
      />

      {/* Privacy, Portability & Calibration Modal */}
      <PrivacyDataModal
        isOpen={isPrivacyModalOpen}
        settings={settings}
        onClose={() => setIsPrivacyModalOpen(false)}
        onUpdateSettings={updateSettings}
        onExportJSON={exportDataJSON}
        onExportCSV={exportDataCSV}
        onImportJSON={importDataJSON}
        onLoadDemoData={loadDemoData}
        onWipeData={wipeAllData}
      />
    </div>
  );
}

