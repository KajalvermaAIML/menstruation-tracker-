"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";
import { DayLog, CycleCalculations } from "@/lib/types";
import { toDateString } from "@/lib/cycle-math";

interface CalendarViewProps {
  logs: Record<string, DayLog>;
  calculations: CycleCalculations;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onOpenLogger: (dateStr?: string) => void;
  isPeriodDay: (dateStr: string) => boolean;
  isPredictedPeriodDay: (dateStr: string) => boolean;
  isOvulationDay: (dateStr: string) => boolean;
  isFertileDay: (dateStr: string) => boolean;
  hasSymptomsOrNotes: (dateStr: string) => boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  logs,
  calculations,
  selectedDate,
  onSelectDate,
  onOpenLogger,
  isPeriodDay,
  isPredictedPeriodDay,
  isOvulationDay,
  isFertileDay,
  hasSymptomsOrNotes,
}) => {
  // Navigation month state: anchor to selected date or today
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const [y, m] = selectedDate.split("-").map(Number);
    return new Date(y, m - 1, 1);
  });

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed

  const monthName = currentMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleJumpToToday = () => {
    const today = new Date();
    setCurrentMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(toDateString(today));
  };

  // Build calendar matrix (Sunday to Saturday or Monday to Sunday - let's use Mon-Sun)
  const firstDayOfMonth = new Date(year, month, 1);
  // getDay() gives 0 for Sunday, 1 for Monday... We want Monday = 0
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Grid cells
  interface CalendarCell {
    dateStr: string;
    dayNum: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isPeriod: boolean;
    isPredictedPeriod: boolean;
    isOvulation: boolean;
    isFertile: boolean;
    hasDetails: boolean;
  }

  const cells: CalendarCell[] = [];
  const todayStr = toDateString(new Date());

  // Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    const dStr = toDateString(prevMonthDate);
    cells.push({
      dateStr: dStr,
      dayNum,
      isCurrentMonth: false,
      isToday: dStr === todayStr,
      isSelected: dStr === selectedDate,
      isPeriod: isPeriodDay(dStr),
      isPredictedPeriod: isPredictedPeriodDay(dStr),
      isOvulation: isOvulationDay(dStr),
      isFertile: isFertileDay(dStr),
      hasDetails: hasSymptomsOrNotes(dStr),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const currDate = new Date(year, month, d);
    const dStr = toDateString(currDate);
    cells.push({
      dateStr: dStr,
      dayNum: d,
      isCurrentMonth: true,
      isToday: dStr === todayStr,
      isSelected: dStr === selectedDate,
      isPeriod: isPeriodDay(dStr),
      isPredictedPeriod: isPredictedPeriodDay(dStr),
      isOvulation: isOvulationDay(dStr),
      isFertile: isFertileDay(dStr),
      hasDetails: hasSymptomsOrNotes(dStr),
    });
  }

  // Next month leading days to complete the 35 or 42 grid
  const remainingCells = (7 - (cells.length % 7)) % 7;
  for (let n = 1; n <= remainingCells; n++) {
    const nextMonthDate = new Date(year, month + 1, n);
    const dStr = toDateString(nextMonthDate);
    cells.push({
      dateStr: dStr,
      dayNum: n,
      isCurrentMonth: false,
      isToday: dStr === todayStr,
      isSelected: dStr === selectedDate,
      isPeriod: isPeriodDay(dStr),
      isPredictedPeriod: isPredictedPeriodDay(dStr),
      isOvulation: isOvulationDay(dStr),
      isFertile: isFertileDay(dStr),
      hasDetails: hasSymptomsOrNotes(dStr),
    });
  }

  const weekDayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md transition-all dark:border-stone-800/80 dark:bg-stone-900/80">
      {/* Calendar Header with Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4 dark:border-stone-800">
        <div>
          <h3 className="text-base font-medium tracking-tight text-stone-900 dark:text-stone-100">
            {monthName}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Select any date to view physiological notes or log daily metrics
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleJumpToToday}
            className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
          >
            Today
          </button>
          <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50/80 dark:border-stone-700 dark:bg-stone-800/80">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="p-1.5 text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="h-4 w-px bg-stone-200 dark:bg-stone-700" />
            <button
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-1.5 text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="mt-4 grid grid-cols-7 text-center text-xs font-medium text-stone-400 dark:text-stone-500">
        {weekDayLabels.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Monthly Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell) => {
          // Determine cell styling
          let cellStyle =
            "text-stone-700 hover:bg-stone-100/70 dark:text-stone-300 dark:hover:bg-stone-800/50";
          let bgWash = "";
          let borderStyle = "border-transparent";

          if (!cell.isCurrentMonth) {
            cellStyle = "text-stone-300 dark:text-stone-600 opacity-60";
          }

          if (cell.isPeriod) {
            // Solid muted rosewood
            bgWash = "bg-rosewood-500 text-white font-medium shadow-sm hover:bg-rosewood-600";
            cellStyle = "text-white";
          } else if (cell.isPredictedPeriod) {
            // Dashed/subtle wash
            bgWash =
              "bg-rosewood-50/80 dark:bg-rosewood-950/40 text-rosewood-800 dark:text-rosewood-200 border-rosewood-300 dark:border-rosewood-800 border-dashed";
            borderStyle = "border-rosewood-300 dark:border-rosewood-800 border-dashed";
          } else if (cell.isOvulation) {
            // Estimated ovulation window (soft amber/sage highlight)
            bgWash =
              "bg-amber-100/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium ring-1 ring-amber-400/60";
          } else if (cell.isFertile) {
            // Fertile window wash
            bgWash =
              "bg-sage-50/90 dark:bg-sage-950/40 text-sage-900 dark:text-sage-200";
          }

          const isSelected = cell.isSelected;
          const isToday = cell.isToday;

          return (
            <button
              key={cell.dateStr}
              type="button"
              onClick={() => onSelectDate(cell.dateStr)}
              className={`group relative flex h-14 flex-col items-center justify-between rounded-xl border p-1.5 text-xs transition-all duration-150 ${borderStyle} ${bgWash} ${
                isSelected
                  ? "ring-2 ring-stone-900 ring-offset-2 dark:ring-stone-100 dark:ring-offset-stone-900"
                  : ""
              } ${cellStyle}`}
            >
              {/* Day Number and Today Indicator */}
              <div className="flex w-full items-center justify-between">
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                    isToday && !cell.isPeriod
                      ? "bg-stone-900 font-semibold text-white dark:bg-stone-100 dark:text-stone-900"
                      : ""
                  }`}
                >
                  {cell.dayNum}
                </span>

                {/* Ovulation badge icon if applicable */}
                {cell.isOvulation && (
                  <span
                    title="Estimated Ovulation"
                    className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"
                  />
                )}
              </div>

              {/* Bottom Dot Indicators */}
              <div className="flex h-2 items-center justify-center gap-1">
                {cell.hasDetails && !cell.isPeriod && (
                  <span
                    title="Logged notes or symptoms"
                    className="h-1 w-1 rounded-full bg-stone-400 dark:bg-stone-500"
                  />
                )}
                {cell.isPeriod && (
                  <span className="text-[9px] font-medium tracking-tight opacity-90">
                    Period
                  </span>
                )}
                {cell.isPredictedPeriod && (
                  <span className="text-[9px] font-normal tracking-tight text-rosewood-700/80 dark:text-rosewood-300">
                    Pred
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Clinical Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-rosewood-500" />
            <span>Logged Period</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md border border-dashed border-rosewood-400 bg-rosewood-100/70 dark:bg-rosewood-950/60" />
            <span>Predicted Period</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-amber-200/80 dark:bg-amber-950/60 ring-1 ring-amber-400/60" />
            <span>Estimated Ovulation</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-sage-100 dark:bg-sage-950/60" />
            <span>Fertile Window</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            <span>Symptom / Note</span>
          </div>
        </div>

        <button
          onClick={() => onOpenLogger(selectedDate)}
          className="inline-flex items-center gap-1 rounded-lg border border-stone-200/90 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
        >
          <Plus className="h-3 w-3" />
          Log for Selected Date
        </button>
      </div>
    </div>
  );
};

