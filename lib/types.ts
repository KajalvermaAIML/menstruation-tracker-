export type FlowIntensity = "none" | "spotting" | "light" | "medium" | "heavy";

export type PhysicalSymptom =
  | "cramps"
  | "headache"
  | "fatigue"
  | "bloating"
  | "acne"
  | "tender_breasts"
  | "backache"
  | "nausea"
  | "insomnia";

export type MoodType =
  | "neutral"
  | "elevated"
  | "low"
  | "anxious"
  | "energized"
  | "calm"
  | "irritated";

export type CervicalMucus = "dry" | "sticky" | "creamy" | "egg_white" | "watery";

export interface DayLog {
  date: string; // YYYY-MM-DD
  flow?: FlowIntensity;
  symptoms: PhysicalSymptom[];
  mood?: MoodType;
  energyLevel?: number; // 1 to 5
  cervicalMucus?: CervicalMucus;
  basalBodyTemp?: number; // e.g. 36.6
  notes?: string;
  updatedAt: string;
}

export type CyclePhase = "menstrual" | "follicular" | "ovulatory" | "luteal";

export interface CycleHistoryItem {
  cycleNumber: number;
  startDate: string;
  endDate: string;
  lengthDays: number;
  periodDurationDays: number;
}

export interface CycleCalculations {
  currentCycleDay: number;
  totalCycleDays: number;
  currentPhase: CyclePhase;
  phaseProgress: number; // 0 to 100
  daysUntilNextPeriod: number;
  nextPeriodStartDate: string;
  nextPeriodEndDate: string;
  estimatedOvulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  avgCycleLength: number;
  avgPeriodDuration: number;
  regularityScore: number; // percentage, e.g. 94%
  cycleHistory: CycleHistoryItem[];
  lastPeriodStartDate: string | null;
}

export interface UserSettings {
  defaultCycleLength: number;
  defaultPeriodLength: number;
  tempUnit: "celsius" | "fahrenheit";
  theme: "light" | "dark" | "system";
}

