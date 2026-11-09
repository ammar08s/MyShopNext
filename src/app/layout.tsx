import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import "@/shared/styles/globals.css";

interface Props {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: "ShopBoard",
    template: "%s | ShopBoard",
  },
  description: "ShopBoard is a simple storefront for discovering products.",
};

/**
 * Provides the shared HTML document and global styles for every route.
 * @param props - The active route content supplied by Next.js.
 * @returns The server-rendered document containing that content.
 */
export default function RootLayout({ children }: Props): ReactElement {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
