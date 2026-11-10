"use client";

import { use } from "react";
import { DemoSessionContext } from "./demoSession.context";
import type { DemoSessionContextValue } from "./demoSession.types";

/**
 * Reads the single demo-session owner for the active application layout.
 * @returns Session state/actions; takes no inputs and throws outside its provider.
 */
export function useDemoSession(): DemoSessionContextValue {
  const context = use(DemoSessionContext);
  if (context === null)
    throw new Error("useDemoSession requires DemoSessionProvider.");
  return context;
}
