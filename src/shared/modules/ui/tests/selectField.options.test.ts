import assert from "node:assert/strict";
import { test } from "node:test";
import {
  decodeSelectOption,
  encodeSelectOption,
  getSelectedOptionValue,
} from "../selectField.options.ts";
import type { SelectOption } from "../selectField.types.ts";

const options: readonly SelectOption[] = [
  { value: "", label: "All categories" },
  { value: "option-0", label: "Looks like an internal value" },
  { value: "__all__", label: "Looks like a sentinel" },
  { value: "Home / café 🏠", label: "Unicode and punctuation" },
  { value: "disabled", label: "Unavailable", disabled: true },
];

/**
 * Guards against accidentally clearing an empty external selection.
 * @returns No value; assertions throw if all-categories cannot round-trip.
 */
function preservesEmptyValue(): void {
  const encoded = getSelectedOptionValue(options, "");
  assert.notEqual(encoded, "");
  assert.equal(decodeSelectOption(options, encoded), "");
}

/**
 * Guards against collisions between arbitrary values and internal markers.
 * @returns No value; assertions throw if distinct values collapse together.
 */
function preservesArbitraryValues(): void {
  const internalLooking = getSelectedOptionValue(options, "option-0");
  const sentinelLooking = getSelectedOptionValue(options, "__all__");
  const unicode = getSelectedOptionValue(options, "Home / café 🏠");
  assert.notEqual(internalLooking, getSelectedOptionValue(options, ""));
  assert.notEqual(internalLooking, sentinelLooking);
  assert.equal(decodeSelectOption(options, internalLooking), "option-0");
  assert.equal(decodeSelectOption(options, sentinelLooking), "__all__");
  assert.equal(decodeSelectOption(options, unicode), "Home / café 🏠");
}

/**
 * Guards against returning placeholder state for a valid option position.
 * @returns No value; assertions throw if positional tokens cannot select options.
 */
function encodesOptionPositions(): void {
  assert.notEqual(encodeSelectOption(0), "");
  assert.notEqual(encodeSelectOption(0), encodeSelectOption(1));
  assert.equal(decodeSelectOption(options, encodeSelectOption(1)), "option-0");
}

/**
 * Guards against accepting disabled selections through either boundary.
 * @returns No value; assertions throw if unavailable options become selectable.
 */
function rejectsDisabledOptions(): void {
  assert.equal(getSelectedOptionValue(options, "disabled"), "");
  assert.equal(decodeSelectOption(options, encodeSelectOption(4)), undefined);
}

/**
 * Guards against unknown values and malformed or out-of-range positions.
 * @returns No value; assertions throw if invalid input resolves to an option.
 */
function rejectsUnknownValues(): void {
  assert.equal(getSelectedOptionValue(options, "missing"), "");
  assert.equal(getSelectedOptionValue([], ""), "");
  for (const value of [
    "",
    "option--1",
    "option-01",
    "option-1.5",
    "option-1x",
    "option-99",
    "__all__",
  ]) {
    assert.equal(decodeSelectOption(options, value), undefined);
  }
  assert.equal(decodeSelectOption([], encodeSelectOption(0)), undefined);
}

/**
 * Guards against generating tokens from invalid array positions.
 * @returns No value; assertions throw if invalid indices are accepted.
 */
function rejectsInvalidPositions(): void {
  for (const index of [
    -1,
    0.5,
    Number.NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    /** @returns No value; attempts encoding so the assertion can catch failure. */
    function encodeInvalidPosition(): void {
      encodeSelectOption(index);
    }
    assert.throws(encodeInvalidPosition, RangeError);
  }
}

test(
  "empty all-categories values round-trip through a nonempty token",
  preservesEmptyValue,
);
test(
  "arbitrary category values never collide with internal tokens",
  preservesArbitraryValues,
);
test(
  "option positions resolve to their original values",
  encodesOptionPositions,
);
test("disabled options cannot become selected", rejectsDisabledOptions);
test(
  "unknown selections and malformed tokens are ignored",
  rejectsUnknownValues,
);
test(
  "invalid option positions cannot create internal tokens",
  rejectsInvalidPositions,
);
