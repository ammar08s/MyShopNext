"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { useDemoSession } from "@/features/auth/modules/session/useDemoSession";

interface Props {
  children?: never;
}

/**
 * Reflects the tab's demo account without making the shared header client-only.
 * @param _props - Empty component props; no configurable inputs.
 * @returns Account navigation and a working sign-out action when signed in.
 */
export function DemoAccountNav(_props: Props): ReactElement {
  const { session, signOut } = useDemoSession();
  const router = useRouter();
  /**
   * Signs out and exposes any persistence feedback on the account page.
   * @returns No value; takes no inputs and navigates to the demo login route.
   */
  function handleSignOut(): void {
    const loginPath = session.role === "admin" ? "/admin/login" : "/login";
    signOut();
    router.push(loginPath);
  }
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-xs font-medium transition-colors hover:border-primary hover:text-primary sm:px-4 motion-reduce:transition-none"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="size-4"
        >
          <circle
            cx="10"
            cy="6"
            r="3"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M4 17v-1a6 6 0 0 1 12 0v1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <span>{session.role === "user" ? "User account" : "User login"}</span>
      </Link>
      <Link
        href={session.role === "admin" ? "/admin" : "/admin/login"}
        className="inline-flex items-center rounded-full border bg-card px-3 py-2 text-xs font-medium transition-colors hover:border-primary hover:text-primary sm:px-4 motion-reduce:transition-none"
      >
        {session.role === "admin" ? "Admin dashboard" : "Admin login"}
      </Link>
      {session.status === "signed-in" ? (
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-sm px-1 py-2 text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
        >
          Sign out
        </button>
      ) : null}
    </div>
  );
}
