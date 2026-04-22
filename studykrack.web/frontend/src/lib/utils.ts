/**
 * StudyKrack 2.0 - Central Utility Hub
 * Consolidated logic from Phase 1 orphans for Opal Glass UI.
 */

/**
 * Parses a comma-separated list of topics into a clean array.
 * Salvaged from BulkIngest.tsx
 */
export function parseTopics(input: string): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/**
 * Calculates Neural Resilience status based on focus time.
 * Salvaged from DailyStats.tsx
 */
export function getNeuralResilienceStatus(focusMinutes: number): {
  label: "STABILIZING" | "OPTIMIZED" | "ELITE";
  color: string;
} {
  if (focusMinutes >= 240) {
    return { label: "ELITE", color: "text-primary" };
  }
  if (focusMinutes >= 120) {
    return { label: "OPTIMIZED", color: "text-tertiary" };
  }
  return { label: "STABILIZING", color: "text-secondary" };
}

/**
 * Formats bytes into a human-readable string.
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
