import type { ReactElement } from "react";
import { cn } from "@/shared/modules/ui/cn";

type IconName =
  | "arrow-up-right"
  | "arrow-right"
  | "arrow-left"
  | "check"
  | "chevron-down"
  | "chevron-up"
  | "search"
  | "plus"
  | "pencil"
  | "trash"
  | "reset"
  | "save"
  | "user"
  | "shield"
  | "log-out";

interface Props {
  name: IconName;
  className?: string;
}

const paths: Record<IconName, string> = {
  "arrow-up-right": "M7 17 17 7M7 7h10v10",
  "arrow-right": "M4 12h16m-7-7 7 7-7 7",
  "arrow-left": "M20 12H4m7-7-7 7 7 7",
  check: "m5 12 4 4L19 6",
  "chevron-down": "m6 9 6 6 6-6",
  "chevron-up": "m6 15 6-6 6 6",
  search: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 6 6",
  plus: "M12 5v14M5 12h14",
  pencil: "m16 3 5 5L8 21H3v-5L16 3Zm-3 3 5 5",
  trash: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7",
  reset: "M3 10a9 9 0 1 1 1 7M3 4v6h6",
  save: "M4 3h13l4 4v14H3V3h1Zm3 0v6h9V3M7 21v-8h10v8",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 5 0 0 1 16 0v2",
  shield: "m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3Zm-4 9 3 3 5-5",
  "log-out": "M9 3H4v18h5m0-9h12m-5-5 5 5-5 5",
};

/**
 * Draws a consistent decorative icon beside an accessible text label.
 * @param props - Supported icon name and optional size/color/layout classes.
 * @returns A non-focusable SVG hidden from assistive technology; no side effects.
 */
export function Icon({ name, className }: Props): ReactElement {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 shrink-0", className)}
    >
      <path d={paths[name]} />
    </svg>
  );
}
