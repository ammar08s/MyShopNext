import type { Metadata } from "next";
import type { ReactElement } from "react";
import { LoginPageLayout } from "@/app/components/LoginPageLayout/LoginPageLayout";
import { DemoLogin } from "@/features/auth/components/DemoLogin/DemoLogin";

interface Props {
  children?: never;
}

export const metadata: Metadata = {
  title: "Admin demo login",
  description:
    "Try browser-only product management with the public admin demo.",
};

/**
 * Provides the separate public admin demo login portal.
 * @param _props - Empty props; no configurable inputs.
 * @returns An admin-only form that opens the dashboard after successful sign-in.
 */
export default function AdminLoginPage(_props: Props): ReactElement {
  return (
    <LoginPageLayout>
      <DemoLogin role="admin" />
    </LoginPageLayout>
  );
}
