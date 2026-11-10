import assert from "node:assert/strict";
import { test } from "node:test";
import { validateDemoCredentials } from "../demoCredentials.ts";

/**
 * Verifies public demo credentials and safe normalization; takes no inputs.
 * @returns No value; throws if credentials are accepted incorrectly.
 */
function validatesCredentials(): void {
  assert.deepEqual(
    validateDemoCredentials("user@shopboard.demo", "User123!", "user"),
    { success: true, role: "user" },
  );
  assert.deepEqual(
    validateDemoCredentials(" ADMIN@SHOPBOARD.DEMO ", "Admin123!", "admin"),
    { success: true, role: "admin" },
  );
  assert.equal(validateDemoCredentials("", "", "user").success, false);
  assert.equal(
    validateDemoCredentials("other@example.com", "Admin123!", "admin").success,
    false,
  );
  assert.equal(
    validateDemoCredentials("user@shopboard.demo", "wrong", "user").success,
    false,
  );
  assert.equal(
    validateDemoCredentials("admin@shopboard.demo", " Admin123! ", "admin")
      .success,
    false,
  );
}

/**
 * Rejects credentials belonging to the other portal; takes no inputs.
 * @returns No value; throws if either portal grants the wrong role.
 */
function isolatesPortalCredentials(): void {
  assert.equal(
    validateDemoCredentials("admin@shopboard.demo", "Admin123!", "user")
      .success,
    false,
  );
  assert.equal(
    validateDemoCredentials("user@shopboard.demo", "User123!", "admin").success,
    false,
  );
}

test(
  "accepts only the demo account and normalizes email without changing passwords",
  validatesCredentials,
);

test("rejects the other portal's demo credentials", isolatesPortalCredentials);
