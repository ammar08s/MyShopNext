import type { SelectOption } from "./selectField.types.ts";

/**
 * Encodes an option position without depending on its external value.
 * @param index - Nonnegative safe integer position in the option list.
 * @returns A nonempty internal value; throws RangeError for invalid positions.
 */
export function encodeSelectOption(index: number): string {
  if (!Number.isSafeInteger(index) || index < 0) {
    throw new RangeError(
      "Select option positions must be nonnegative safe integers.",
    );
  }
  return `option-${index}`;
}

/**
 * Finds the internal value of an enabled external selection.
 * @param options - Current selectable options.
 * @param value - External value, including an empty all-categories value.
 * @returns The encoded position, or an empty placeholder value if unavailable.
 */
export function getSelectedOptionValue(
  options: readonly SelectOption[],
  value: string,
): string {
  /**
   * Matches only enabled options against the external selection.
   * @param option - Candidate option from the current list.
   * @returns Whether this option can represent the selected value.
   */
  function matchesValue(option: SelectOption): boolean {
    return option.value === value && !option.disabled;
  }
  const index = options.findIndex(matchesValue);
  return index < 0 ? "" : encodeSelectOption(index);
}

/**
 * Resolves an internal position back to an enabled external value.
 * @param options - Current selectable options.
 * @param encodedValue - Internal value received from the selection primitive.
 * @returns The original value, or undefined for unknown or disabled selections.
 */
export function decodeSelectOption(
  options: readonly SelectOption[],
  encodedValue: string,
): string | undefined {
  if (!/^option-(0|[1-9]\d*)$/.test(encodedValue)) return undefined;
  const index = Number(encodedValue.slice("option-".length));
  if (!Number.isSafeInteger(index)) return undefined;
  const option = options[index];
  return option && !option.disabled ? option.value : undefined;
}
