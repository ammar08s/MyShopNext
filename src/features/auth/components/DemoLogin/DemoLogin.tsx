"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from "react";
import {
  demoAccounts,
  validateDemoCredentials,
} from "@/features/auth/modules/credentials/demoCredentials";
import { useDemoSession } from "@/features/auth/modules/session/useDemoSession";
import type { DemoRole } from "@/features/auth/modules/session/demoSession.types";

interface Props {
  role: DemoRole;
}

const inputClassName =
  "w-full rounded-xl border bg-card px-4 py-3.5 text-sm shadow-xs transition-colors hover:border-primary/50 aria-invalid:border-destructive disabled:opacity-50 motion-reduce:transition-none";

/**
 * Focuses a newly mounted success heading with a stable ref identity.
 * @param node - Confirmation heading, or null when it unmounts.
 * @returns No value; only changes document focus when the heading mounts.
 */
function focusConfirmation(node: HTMLHeadingElement | null): void {
  node?.focus();
}

/**
 * Provides a complete browser-only demo sign-in and signed-in confirmation.
 * @param props - The role allowed to sign in through this portal.
 * @returns A labelled form or account confirmation; credentials never leave memory.
 */
export function DemoLogin({ role }: Props): ReactElement {
  const { session, signIn, signOut } = useDemoSession();
  const router = useRouter();
  const demoCredentials = demoAccounts[role];
  const portalName = role === "admin" ? "Admin" : "User";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const isLoading = session.status === "loading";
  /** @param event - Email edit. @returns No value; clears stale validation feedback. */
  function changeEmail(event: ChangeEvent<HTMLInputElement>): void {
    setEmail(event.target.value);
    setError(null);
  }
  /** @param event - Password edit. @returns No value; retains no persistent copy. */
  function changePassword(event: ChangeEvent<HTMLInputElement>): void {
    setPassword(event.target.value);
    setError(null);
  }
  /** @returns No value; takes no inputs and fills the published demo credentials. */
  function fillDemo(): void {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    setError(null);
    passwordRef.current?.focus();
  }
  /** @returns No value; takes no inputs and changes password visibility only. */
  function togglePassword(): void {
    /** @param current - Latest visibility. @returns Its opposite. */
    function invert(current: boolean): boolean {
      return !current;
    }
    setIsPasswordVisible(invert);
  }
  /**
   * Prevents native submission and checks credentials locally.
   * @param event - Sign-in form submission.
   * @returns No value; publishes demo sign-in or focuses the first relevant field.
   */
  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (isLoading) return;
    const result = validateDemoCredentials(email, password, role);
    if (!result.success) {
      setError(result.message);
      if (!password && email.trim()) passwordRef.current?.focus();
      else emailRef.current?.focus();
      return;
    }
    setPassword("");
    signIn(result.role);
    if (result.role === "admin") router.replace("/admin");
  }
  if (session.status === "signed-in" && session.role === role) {
    return (
      <section className="w-full max-w-md">
        <span
          aria-hidden="true"
          className="mb-6 inline-flex size-14 items-center justify-center rounded-full bg-secondary text-2xl text-primary"
        >
          ✓
        </span>
        <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
          {portalName} demo account
        </p>
        <h1
          ref={focusConfirmation}
          tabIndex={-1}
          className="text-4xl font-semibold tracking-tight"
        >
          You’re signed in.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Welcome back to ShopBoard. Your demo session stays in this browser
          tab.
        </p>
        <p className="mt-6 rounded-xl border bg-background px-4 py-3 text-sm break-all">
          {demoCredentials.email}
        </p>
        {session.warning ? (
          <p
            role="status"
            className="mt-4 text-sm leading-6 text-muted-foreground"
          >
            {session.warning}
          </p>
        ) : null}
        <Link
          href={role === "admin" ? "/admin" : "/"}
          className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {role === "admin" ? "Open the dashboard" : "Explore the collection"}{" "}
          <span aria-hidden="true" className="ml-3">
            ↗
          </span>
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="mt-5 w-full rounded-sm text-sm text-muted-foreground underline underline-offset-4"
        >
          Sign out of the demo
        </button>
      </section>
    );
  }
  return (
    <section className="w-full max-w-md">
      <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
        {portalName} demo login
      </p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {role === "admin" ? "Welcome, admin." : "Welcome back."}
      </h1>
      <p className="mt-3 mb-8 text-sm leading-6 text-muted-foreground">
        {role === "admin"
          ? "Sign in to manage browser-only demo products. This is a public demo, with no real authorization."
          : "Sign in to try the ShopBoard user demo. No real account is created."}
      </p>
      {session.status === "signed-in" && session.role !== role ? (
        <p
          role="status"
          className="mb-5 text-sm leading-6 text-muted-foreground"
        >
          You are using the {session.role} demo. Signing in here switches this
          tab to the {role} demo.
        </p>
      ) : null}
      <form onSubmit={submit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="demo-email"
            className="mb-2 block text-sm font-medium"
          >
            Email address
          </label>
          <input
            ref={emailRef}
            id="demo-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={changeEmail}
            placeholder="you@example.com"
            disabled={isLoading}
            aria-invalid={error !== null}
            aria-describedby={error ? "demo-login-error" : undefined}
            className={inputClassName}
          />
        </div>
        <div>
          <label
            htmlFor="demo-password"
            className="mb-2 block text-sm font-medium"
          >
            Password
          </label>
          <div className="relative">
            <input
              ref={passwordRef}
              id="demo-password"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={changePassword}
              placeholder="Enter your password"
              disabled={isLoading}
              aria-invalid={error !== null}
              aria-describedby={error ? "demo-login-error" : undefined}
              className={`${inputClassName} pr-20`}
            />
            <button
              type="button"
              onClick={togglePassword}
              disabled={isLoading}
              aria-pressed={isPasswordVisible}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-sm text-xs font-medium text-primary"
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {error ? (
          <p
            id="demo-login-error"
            role="alert"
            className="text-sm leading-6 text-destructive"
          >
            {error}
          </p>
        ) : null}
        {session.warning ? (
          <p role="status" className="text-sm leading-6 text-muted-foreground">
            {session.warning}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none"
        >
          {isLoading ? "Preparing your demo…" : "Sign in to demo"}
          <span aria-hidden="true">→</span>
        </button>
      </form>
      <div className="mt-7 rounded-xl border border-dashed bg-background p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Try it with this account
          </p>
          <button
            type="button"
            onClick={fillDemo}
            disabled={isLoading}
            className="rounded-sm text-xs font-medium text-primary underline underline-offset-4 disabled:opacity-50"
          >
            Use demo credentials
          </button>
        </div>
        <dl className="space-y-1.5 text-xs">
          <div className="flex flex-wrap justify-between gap-1">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="break-all font-mono">{demoCredentials.email}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-1">
            <dt className="text-muted-foreground">Password</dt>
            <dd className="font-mono">{demoCredentials.password}</dd>
          </div>
        </dl>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Just browsing?{" "}
        <Link
          href="/"
          className="rounded-sm font-medium text-primary underline underline-offset-4"
        >
          Explore the collection
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link
          href={role === "admin" ? "/login" : "/admin/login"}
          className="rounded-sm font-medium text-primary underline underline-offset-4"
        >
          {role === "admin" ? "User demo login" : "Admin demo login"}
        </Link>
      </p>
    </section>
  );
}
