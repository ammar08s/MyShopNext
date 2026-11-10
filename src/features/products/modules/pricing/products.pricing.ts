const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * Formats a validated integer-cent product price in USD.
 * @param priceCents - Nonnegative integer cents from the product model.
 * @returns A USD price with two decimal places.
 */
export function formatProductPrice(priceCents: number): string {
  const cents = priceCents % 100;
  const dollars = (priceCents - cents) / 100;
  /**
   * Keeps cents exact even when fractional dollars exceed floating-point precision.
   * @param part - One locale-formatted whole-dollar part.
   * @returns Its display text with the exact cents substituted for the fraction.
   */
  function formatPart(part: Intl.NumberFormatPart): string {
    return part.type === "fraction"
      ? String(cents).padStart(2, "0")
      : part.value;
  }
  return usdFormatter.formatToParts(dollars).map(formatPart).join("");
}
