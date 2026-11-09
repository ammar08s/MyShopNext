import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names and resolves conflicting Tailwind utilities.
 * @param inputs - Class names, conditional objects, or nested arrays to combine.
 * @returns One class string with conflicting utilities resolved.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
