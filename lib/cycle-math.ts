import {
  CycleCalculations,
  CycleHistoryItem,
  CyclePhase,
  DayLog,
  UserSettings,
} from "./types";

/**
 * Standard utility to parse YYYY-MM-DD to a UTC Date object at midnight
 */
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Format date to YYYY-MM-DD string
 */
export function toDateString(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Calculate calendar day difference: (b - a) in days
 */
export function diffInDays(dateAStr: string, dateBStr: string): number {
  const a = parseDate(dateAStr).getTime();
  const b = parseDate(dateBStr).getTime();
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((b - a) / msPerDay);
}

/**
 * Add or subtract days from a YYYY-MM-DD string
 */
export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return toDateString(d);
}

/**
 * Check if a log has active menstrual flow
 */
export function hasFlow(log?: DayLog): boolean {
  if (!log) return false;
  return (
    log.flow === "spotting" ||
    log.flow === "light" ||
    log.flow === "medium" ||
    log.flow === "heavy"
  );
}

export function isPeriodBleedDay(log?: DayLog): boolean {
  if (!log) return false;
  return (
    log.flow === "light" || log.flow === "medium" || log.flow === "heavy"
  );
}

/**
 * Identifies historical bleeding periods from logs
 */
export interface PeriodCluster {
  startDate: string;
  endDate: string;
  durationDays: number;
}

export function extractPeriods(logs: Record<string, DayLog>): PeriodCluster[] {
  const bleedDates = Object.keys(logs)
    .filter((d) => hasFlow(logs[d]))
    .sort();

  if (bleedDates.length === 0) return [];

  const periods: PeriodCluster[] = [];
  let currentStart = bleedDates[0];
  let currentLast = bleedDates[0];

  for (let i = 1; i < bleedDates.length; i++) {
    const prev = bleedDates[i - 1];
    const curr = bleedDates[i];
    const gap = diffInDays(prev, curr);

    // If bleeding continues within 2 days, treat as the same menstrual period
    if (gap <= 2) {
      currentLast = curr;
    } else {
      periods.push({
        startDate: currentStart,
        endDate: currentLast,
        durationDays: diffInDays(currentStart, currentLast) + 1,
      });
      currentStart = curr;
      currentLast = curr;
    }
  }

  periods.push({
    startDate: currentStart,
    endDate: currentLast,
    durationDays: diffInDays(currentStart, currentLast) + 1,
  });

  return periods;
}

/**
 * Core cycle mathematics calculation hook helper
 */
export function calculateCycleStats(
  logs: Record<string, DayLog>,
  settings: UserSettings,
  todayStr: string = toDateString(new Date())
): CycleCalculations {
  const periods = extractPeriods(logs);

  const cycleHistory: CycleHistoryItem[] = [];
  if (periods.length >= 2) {
    for (let i = 1; i < periods.length; i++) {
      const prev = periods[i - 1];
      const curr = periods[i];
      const length = diffInDays(prev.startDate, curr.startDate);
      if (length >= 20 && length <= 50) {
        cycleHistory.push({
          cycleNumber: i,
          startDate: prev.startDate,
          endDate: addDays(curr.startDate, -1),
          lengthDays: length,
          periodDurationDays: prev.durationDays,
        });
      }
    }
  }

  // Calculate dynamic averages or fallback to user settings
  let avgCycleLength = settings.defaultCycleLength || 28;
  let avgPeriodDuration = settings.defaultPeriodLength || 5;

  if (cycleHistory.length > 0) {
    const totalCycleLength = cycleHistory.reduce(
      (acc, c) => acc + c.lengthDays,
      0
    );
    avgCycleLength = Math.round(totalCycleLength / cycleHistory.length);

    const totalPeriodDays = cycleHistory.reduce(
      (acc, c) => acc + c.periodDurationDays,
      0
    );
    avgPeriodDuration =
      Math.round((totalPeriodDays / cycleHistory.length) * 10) / 10;
  } else if (periods.length > 0) {
    // If only 1 period recorded so far
    avgPeriodDuration = periods[periods.length - 1].durationDays;
  }

  // Regularity score (Standard Deviation)
  let regularityScore = 96;
  if (cycleHistory.length >= 2) {
    const lengths = cycleHistory.map((c) => c.lengthDays);
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance =
      lengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev <= 1.2) regularityScore = 98;
    else if (stdDev <= 2.5) regularityScore = 94;
    else if (stdDev <= 4) regularityScore = 86;
    else regularityScore = Math.max(65, Math.round(100 - stdDev * 4));
  }

  // Identify current cycle start
  const lastPeriod = periods.length > 0 ? periods[periods.length - 1] : null;
  const lastPeriodStartDate = lastPeriod ? lastPeriod.startDate : null;

  // If no last period logged yet, synthesize an active baseline anchor
  const effectivePeriodStart =
    lastPeriodStartDate || addDays(todayStr, -(Math.floor(avgCycleLength / 2)));

  const currentCycleDayRaw = diffInDays(effectivePeriodStart, todayStr) + 1;
  const currentCycleDay = Math.max(1, currentCycleDayRaw);

  const nextPeriodStartDate = addDays(effectivePeriodStart, avgCycleLength);
  const nextPeriodEndDate = addDays(nextPeriodStartDate, Math.max(1, Math.round(avgPeriodDuration) - 1));

  const daysUntilNextPeriod = Math.max(
    0,
    diffInDays(todayStr, nextPeriodStartDate)
  );

  // Ovulation typically occurs 14 days before the subsequent menstruation starts
  const estimatedOvulationDayNum = Math.max(
    Math.round(avgPeriodDuration) + 1,
    avgCycleLength - 14
  );
  const estimatedOvulationDate = addDays(
    effectivePeriodStart,
    estimatedOvulationDayNum - 1
  );

  // Fertile window: 5 days prior to ovulation through 1 day post-ovulation
  const fertileWindowStart = addDays(estimatedOvulationDate, -5);
  const fertileWindowEnd = addDays(estimatedOvulationDate, 1);

  // Determine current physiological phase
  let currentPhase: CyclePhase = "follicular";
  if (currentCycleDay <= avgPeriodDuration) {
    currentPhase = "menstrual";
  } else if (
    currentCycleDay >= estimatedOvulationDayNum - 1 &&
    currentCycleDay <= estimatedOvulationDayNum + 1
  ) {
    currentPhase = "ovulatory";
  } else if (currentCycleDay < estimatedOvulationDayNum - 1) {
    currentPhase = "follicular";
  } else {
    currentPhase = "luteal";
  }

  const phaseProgress = Math.min(
    100,
    Math.max(1, Math.round((currentCycleDay / avgCycleLength) * 100))
  );

  return {
    currentCycleDay,
    totalCycleDays: avgCycleLength,
    currentPhase,
    phaseProgress,
    daysUntilNextPeriod,
    nextPeriodStartDate,
    nextPeriodEndDate,
    estimatedOvulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    avgCycleLength,
    avgPeriodDuration,
    regularityScore,
    cycleHistory,
    lastPeriodStartDate,
  };
}

/**
 * Phase descriptions and clinical clinical insights for hero and guidance cards
 */
export const PHASE_METRICS: Record<
  CyclePhase,
  {
    name: string;
    label: string;
    description: string;
    physiologicalNote: string;
    accentColor: string;
    badgeBg: string;
    badgeText: string;
    ringColor: string;
  }
> = {
  menstrual: {
    name: "Menstrual Phase",
    label: "Menstrual",
    description: "Uterine lining shedding. Estrogen and progesterone are at baseline.",
    physiologicalNote: "Restorative phase. Prioritize iron-rich hydration, gentle movement, and magnesium.",
    accentColor: "#C27A72",
    badgeBg: "bg-rosewood-50 dark:bg-rosewood-950/60 border-rosewood-200 dark:border-rosewood-900/60",
    badgeText: "text-rosewood-700 dark:text-rosewood-300",
    ringColor: "#C27A72",
  },
  follicular: {
    name: "Follicular Phase",
    label: "Follicular",
    description: "FSH stimulates follicle maturation. Estrogen begins its steady rise.",
    physiologicalNote: "Rising vitality and cognitive clarity. Ideal window for high-focus work and strength training.",
    accentColor: "#7E9987",
    badgeBg: "bg-sage-50 dark:bg-sage-950/60 border-sage-200 dark:border-sage-900/60",
    badgeText: "text-sage-700 dark:text-sage-300",
    ringColor: "#7E9987",
  },
  ovulatory: {
    name: "Ovulatory Phase",
    label: "Ovulatory",
    description: "LH surge triggers mature egg release. Peak fertility window.",
    physiologicalNote: "Peak stamina, communication, and libido. High metabolic energy.",
    accentColor: "#D49D42",
    badgeBg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/60",
    badgeText: "text-amber-800 dark:text-amber-300",
    ringColor: "#D49D42",
  },
  luteal: {
    name: "Luteal Phase",
    label: "Luteal",
    description: "Corpus luteum secretes progesterone. Preparing uterine environment.",
    physiologicalNote: "Gradual shift inward. Support blood sugar balance, restorative sleep, and calming routines.",
    accentColor: "#9C8E84",
    badgeBg: "bg-taupe-50 dark:bg-taupe-950/60 border-taupe-200 dark:border-taupe-800/60",
    badgeText: "text-taupe-700 dark:text-taupe-300",
    ringColor: "#9C8E84",
  },
};

/**
 * Generate 6 months of realistic historical clinical sample data
 */
export function generateClinicalSampleData(): Record<string, DayLog> {
  const sampleLogs: Record<string, DayLog> = {};
  const today = new Date();
  const todayStr = toDateString(today);

  // We anchor the current cycle at day 14 (as highlighted in prompt specifications)
  const currentPeriodStart = addDays(todayStr, -13);

  // Past 5 cycle starts (approx 28 days apart with slight natural clinical variance)
  const cycleIntervals = [28, 27, 29, 28, 28];
  const cycleStarts: string[] = [currentPeriodStart];

  let currentPointer = currentPeriodStart;
  for (const interval of cycleIntervals) {
    currentPointer = addDays(currentPointer, -interval);
    cycleStarts.unshift(currentPointer);
  }

  // Populate bleed days for each historical period
  for (const start of cycleStarts) {
    sampleLogs[start] = {
      date: start,
      flow: "heavy",
      symptoms: ["cramps", "fatigue"],
      mood: "low",
      energyLevel: 2,
      updatedAt: new Date().toISOString(),
    };
    sampleLogs[addDays(start, 1)] = {
      date: addDays(start, 1),
      flow: "heavy",
      symptoms: ["cramps", "headache"],
      mood: "neutral",
      energyLevel: 2,
      updatedAt: new Date().toISOString(),
    };
    sampleLogs[addDays(start, 2)] = {
      date: addDays(start, 2),
      flow: "medium",
      symptoms: ["fatigue"],
      mood: "neutral",
      energyLevel: 3,
      updatedAt: new Date().toISOString(),
    };
    sampleLogs[addDays(start, 3)] = {
      date: addDays(start, 3),
      flow: "light",
      symptoms: [],
      mood: "calm",
      energyLevel: 4,
      updatedAt: new Date().toISOString(),
    };
    sampleLogs[addDays(start, 4)] = {
      date: addDays(start, 4),
      flow: "spotting",
      symptoms: [],
      mood: "energized",
      energyLevel: 4,
      updatedAt: new Date().toISOString(),
    };
  }

  // Also log recent follicular/ovulation days for the active cycle
  const day12 = addDays(currentPeriodStart, 11);
  const day13 = addDays(currentPeriodStart, 12);
  const day14 = todayStr;

  sampleLogs[day12] = {
    date: day12,
    flow: "none",
    symptoms: [],
    mood: "energized",
    energyLevel: 5,
    cervicalMucus: "watery",
    updatedAt: new Date().toISOString(),
  };

  sampleLogs[day13] = {
    date: day13,
    flow: "none",
    symptoms: [],
    mood: "elevated",
    energyLevel: 5,
    cervicalMucus: "egg_white",
    basalBodyTemp: 36.4,
    notes: "High energy, noticeable fertile signs.",
    updatedAt: new Date().toISOString(),
  };

  sampleLogs[day14] = {
    date: day14,
    flow: "none",
    symptoms: [],
    mood: "elevated",
    energyLevel: 5,
    cervicalMucus: "egg_white",
    basalBodyTemp: 36.5,
    notes: "Day 14. Mid-cycle ovulatory peak.",
    updatedAt: new Date().toISOString(),
  };

  return sampleLogs;
}
