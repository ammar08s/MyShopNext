"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactElement, type ReactNode } from "react";
import { useDemoSession } from "@/features/auth/modules/session/useDemoSession";

interface Props {
  children: ReactNode;
}

/**
 * Gates only demo admin UI while preserving request recovery beneath the guard.
 * @param props - Admin workspace content; server data remains public/read-only.
 * @returns Admin content, a pending session state or navigation to admin sign-in.
 */
export function AdminAccessGuard({ children }: Props): ReactElement {
  const { session } = useDemoSession();
  const router = useRouter();
  const isAdmin = session.status === "signed-in" && session.role === "admin";
  /** @returns No value; takes no inputs and synchronizes route access after hydration. */
  function redirectGuest(): void {
    if (session.status !== "loading" && !isAdmin)
      router.replace("/admin/login");
  }
  useEffect(redirectGuest, [session.status, isAdmin, router]);
  if (isAdmin)
    return (
      <>
        {session.warning ? (
          <div
            role="status"
            className="mx-auto w-full max-w-7xl px-5 pt-6 text-sm leading-6 text-muted-foreground sm:px-8 lg:px-12"
          >
            <p className="rounded-xl border bg-card p-4">{session.warning}</p>
          </div>
        ) : null}
        {children}
      </>
    );
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-7xl flex-1 px-5 py-16 sm:px-8 lg:px-12"
    >
      <p role="status" className="text-sm text-muted-foreground">
        {session.status === "loading"
          ? "Checking the admin demo session…"
          : "Opening admin sign-in…"}
      </p>
      <Link
        href="/admin/login"
        className="mt-5 inline-block rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
      >
        Admin sign in
      </Link>
    </main>
  );
}
