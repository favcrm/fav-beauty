/** Shared formatting helpers. */

export function formatMoney(amount: number, currency = "HKD"): string {
  const symbol = currency === "HKD" ? "$" : currency === "USD" ? "$" : "";
  const value = Number.isInteger(amount)
    ? amount.toLocaleString("en-US")
    : amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
  return symbol ? `${symbol}${value}` : `${value} ${currency}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

export function formatDate(
  iso: string,
  opts?: Intl.DateTimeFormatOptions,
): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(
    "en-GB",
    opts ?? { day: "numeric", month: "long", year: "numeric" },
  );
}

export function formatDateShort(iso: string): string {
  return formatDate(iso, { day: "numeric", month: "short" });
}

/** Two-digit ordinal numeral for section labels — "01", "02"... */
export function numeral(n: number): string {
  return String(n).padStart(2, "0");
}
