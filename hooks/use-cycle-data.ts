"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DayLog,
  UserSettings,
  CycleCalculations,
} from "../lib/types";
import {
  calculateCycleStats,
  generateClinicalSampleData,
  hasFlow,
  diffInDays,
  toDateString,
} from "../lib/cycle-math";

const LOGS_STORAGE_KEY = "aurea_cycle_logs_v1";
const SETTINGS_STORAGE_KEY = "aurea_user_settings_v1";

const DEFAULT_SETTINGS: UserSettings = {
  defaultCycleLength: 28,
  defaultPeriodLength: 5,
  tempUnit: "celsius",
  theme: "system",
};

export function useCycleData() {
  const [logs, setLogs] = useState<Record<string, DayLog>>({});
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    toDateString(new Date())
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Initialize from LocalStorage or seed realistic initial demo data
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }

      const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
      if (storedLogs) {
        const parsed = JSON.parse(storedLogs);
        setLogs(parsed);
      } else {
        // Provide sample clinical historical data so the user immediately experiences the clinical dashboard
        const sample = generateClinicalSampleData();
        setLogs(sample);
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(sample));
      }
    } catch (err) {
      console.error("Failed to parse stored cycle data", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save logs to localStorage on change
  const saveLogsToStorage = useCallback((updatedLogs: Record<string, DayLog>) => {
    try {
      setLogs(updatedLogs);
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (err) {
      console.error("Failed to save logs to local storage", err);
    }
  }, []);

  // Save settings to localStorage on change
  const updateSettings = useCallback(
    (newSettings: Partial<UserSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        try {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
        } catch (err) {
          console.error("Failed to persist settings", err);
        }
        return updated;
      });
    },
    []
  );

  // Save or update an individual day's log
  const saveLog = useCallback(
    (logData: Partial<DayLog> & { date: string }) => {
      setLogs((prev) => {
        const existing = prev[logData.date] || {
          date: logData.date,
          symptoms: [],
          updatedAt: new Date().toISOString(),
        };

        const updatedEntry: DayLog = {
          ...existing,
          ...logData,
          updatedAt: new Date().toISOString(),
        };

        // If flow is 'none' and no symptoms/mood/bbt/mucus/notes, delete entry
        const isEntryEmpty =
          (!updatedEntry.flow || updatedEntry.flow === "none") &&
          (!updatedEntry.symptoms || updatedEntry.symptoms.length === 0) &&
          !updatedEntry.mood &&
          !updatedEntry.energyLevel &&
          !updatedEntry.basalBodyTemp &&
          !updatedEntry.cervicalMucus &&
          (!updatedEntry.notes || updatedEntry.notes.trim() === "");

        const updated = { ...prev };
        if (isEntryEmpty) {
          delete updated[logData.date];
        } else {
          updated[logData.date] = updatedEntry;
        }

        try {
          localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));
        } catch (err) {
          console.error("Failed to persist updated day log", err);
        }

        return updated;
      });
    },
    []
  );

  // Delete log for a specific date
  const deleteLog = useCallback((dateStr: string) => {
    setLogs((prev) => {
      const updated = { ...prev };
      delete updated[dateStr];
      try {
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to delete day log", err);
      }
      return updated;
    });
  }, []);

  // Wipe all data
  const wipeAllData = useCallback(() => {
    try {
      localStorage.removeItem(LOGS_STORAGE_KEY);
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      setLogs({});
      setSettings(DEFAULT_SETTINGS);
    } catch (err) {
      console.error("Failed to clear local storage", err);
    }
  }, []);

  // Re-load clinical demo data
  const loadDemoData = useCallback(() => {
    const sample = generateClinicalSampleData();
    saveLogsToStorage(sample);
  }, [saveLogsToStorage]);

  // Export as JSON
  const exportDataJSON = useCallback(() => {
    const exportPayload = {
      exportVersion: "1.0",
      exportedAt: new Date().toISOString(),
      settings,
      logs,
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `aurea_cycle_backup_${toDateString(new Date())}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [logs, settings]);

  // Export as CSV
  const exportDataCSV = useCallback(() => {
    const headers = [
      "Date",
      "Flow",
      "Symptoms",
      "Mood",
      "Energy Level",
      "Basal Body Temp",
      "Cervical Mucus",
      "Notes",
    ];

    const rows = Object.values(logs)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((log) => [
        log.date,
        log.flow || "",
        (log.symptoms || []).join(";"),
        log.mood || "",
        log.energyLevel ?? "",
        log.basalBodyTemp ?? "",
        log.cervicalMucus ?? "",
        `"${(log.notes || "").replace(/"/g, '""')}"`,
      ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `aurea_cycle_logs_${toDateString(new Date())}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [logs]);

  // Import JSON
  const importDataJSON = useCallback(
    (jsonString: string): boolean => {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed.logs && typeof parsed.logs === "object") {
          saveLogsToStorage(parsed.logs);
          if (parsed.settings) {
            updateSettings(parsed.settings);
          }
          return true;
        }
        return false;
      } catch (err) {
        console.error("Invalid JSON import", err);
        return false;
      }
    },
    [saveLogsToStorage, updateSettings]
  );

  // Computed cycle statistics
  const calculations: CycleCalculations = useMemo(() => {
    return calculateCycleStats(logs, settings);
  }, [logs, settings]);

  // Modal / Drawer helpers
  const openDrawer = useCallback((dateStr?: string) => {
    if (dateStr) setSelectedDate(dateStr);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  // Quick lookup predicates
  const isPeriodDay = useCallback(
    (dateStr: string) => {
      return hasFlow(logs[dateStr]);
    },
    [logs]
  );

  const isPredictedPeriodDay = useCallback(
    (dateStr: string) => {
      if (isPeriodDay(dateStr)) return false;
      return (
        dateStr >= calculations.nextPeriodStartDate &&
        dateStr <= calculations.nextPeriodEndDate
      );
    },
    [calculations, isPeriodDay]
  );

  const isOvulationDay = useCallback(
    (dateStr: string) => {
      return dateStr === calculations.estimatedOvulationDate;
    },
    [calculations]
  );

  const isFertileDay = useCallback(
    (dateStr: string) => {
      return (
        dateStr >= calculations.fertileWindowStart &&
        dateStr <= calculations.fertileWindowEnd
      );
    },
    [calculations]
  );

  const hasSymptomsOrNotes = useCallback(
    (dateStr: string) => {
      const log = logs[dateStr];
      if (!log) return false;
      return (
        (log.symptoms && log.symptoms.length > 0) ||
        Boolean(log.notes && log.notes.trim()) ||
        Boolean(log.mood)
      );
    },
    [logs]
  );

  const selectedLog = logs[selectedDate];

  return {
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
  };
}

