"use client";

import {
  useState,
  useSyncExternalStore,
  type ReactElement,
  type ReactNode,
} from "react";
import { DemoSessionContext } from "@/features/auth/modules/session/demoSession.context";
import { createDemoSessionStore } from "@/features/auth/modules/session/demoSession.store";

interface Props {
  children: ReactNode;
}

/**
 * Keeps one tab-local demo session mounted above route request boundaries.
 * @param props - Server-rendered application content passed through children.
 * @returns A client provider whose storage hydrates only after subscribing.
 */
export function DemoSessionProvider({ children }: Props): ReactElement {
  const [store] = useState(createDemoSessionStore);
  const session = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  return (
    <DemoSessionContext
      value={{ session, signIn: store.signIn, signOut: store.signOut }}
    >
      {children}
    </DemoSessionContext>
  );
}
