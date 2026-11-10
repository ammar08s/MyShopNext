import type { DemoRole } from "../session/demoSession.types.ts";

interface DemoAccount {
  email: string;
  password: string;
}

export const demoAccounts: Record<DemoRole, DemoAccount> = {
  user: { email: "user@shopboard.demo", password: "User123!" },
  admin: { email: "admin@shopboard.demo", password: "Admin123!" },
};

type CredentialResult =
  { success: true; role: DemoRole } | { success: false; message: string };

/**
 * Validates the public demo account locally without sending or storing fields.
 * @param email - Entered email, compared without surrounding spaces or case.
 * @param password - Entered password, compared exactly as typed.
 * @param expectedRole - The current portal's allowed demo role.
 * @returns Success or a safe explanation suitable for inline feedback.
 */
export function validateDemoCredentials(
  email: string,
  password: string,
  expectedRole: DemoRole,
): CredentialResult {
  if (!email.trim() || !password)
    return {
      success: false,
      message: "Enter your email and password to continue.",
    };
  if (
    email.trim().toLowerCase() !== demoAccounts[expectedRole].email ||
    password !== demoAccounts[expectedRole].password
  ) {
    return {
      success: false,
      message:
        "That email and password don’t match the demo account. Try the credentials below.",
    };
  }
  return { success: true, role: expectedRole };
}
