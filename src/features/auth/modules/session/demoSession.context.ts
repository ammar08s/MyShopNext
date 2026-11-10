"use client";

import { createContext } from "react";
import type { DemoSessionContextValue } from "./demoSession.types";

export const DemoSessionContext = createContext<DemoSessionContextValue | null>(
  null,
);
