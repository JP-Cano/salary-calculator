/** Format a number as Colombian Pesos. */
export const formatCOP = (value: number): string =>
    new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);

/** Format a number as US Dollars. */
export const formatUSD = (value: number): string =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(value);

/** Format a number as a percentage string. */
export const formatPercent = (value: number): string =>
    `${value.toFixed(1)}%`;

/**
 * Format a numeric string with thousand separators (dots) as the user types.
 * Strips everything except digits and returns the formatted display string.
 */
export function formatNumericInput(raw: string): string {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("es-CO");
}

/**
 * Parse a formatted numeric string back to a number.
 * Removes dots (thousand separators) and parses.
 */
export function parseFormattedNumber(formatted: string): number {
    const digits = formatted.replace(/\D/g, "");
    return digits ? Number(digits) : 0;
}
