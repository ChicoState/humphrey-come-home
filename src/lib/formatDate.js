/**
 * Format a date string for display.
 *
 * @param {string} dateStr — ISO date string
 * @param {"short"|"long"|"month-year"} [variant] — output format
 * @returns {string}
 */
export default function formatDate(dateStr, variant = "short") {
  if (!dateStr) return "";

  const options =
    variant === "long"
      ? { weekday: "long", month: "long", day: "numeric", year: "numeric" }
      : variant === "month-year"
        ? { month: "long", year: "numeric" }
        : { month: "short", day: "numeric", year: "numeric" };

  return new Date(dateStr).toLocaleDateString(undefined, options);
}
