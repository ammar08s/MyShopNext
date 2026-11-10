import type { Metadata } from "next";
import type { ReactElement } from "react";
import { LoginPageLayout } from "@/app/components/LoginPageLayout/LoginPageLayout";
import { DemoLogin } from "@/features/auth/components/DemoLogin/DemoLogin";

interface Props extends PageProps<"/login"> {
  children?: never;
}

export const metadata: Metadata = {
  title: "User demo login",
  description: "Try the ShopBoard user demo. No real account is created.",
};

/**
 * Provides the public user demo login portal.
 * @param _props - Framework route props; no configurable inputs.
 * @returns A user-only form inside the shared server-rendered page layout.
 */
export default function LoginPage(_props: Props): ReactElement {
  return (
    <LoginPageLayout>
      <DemoLogin role="user" />
    </LoginPageLayout>
  );
}
