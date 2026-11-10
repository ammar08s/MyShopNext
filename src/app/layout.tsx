import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import "@/shared/styles/globals.css";
import { StoreHeader } from "@/app/components/StoreHeader/StoreHeader";
import { StoreFooter } from "@/app/components/StoreFooter/StoreFooter";
import { DemoSessionProvider } from "@/features/auth/components/DemoSessionProvider/DemoSessionProvider";
import { DemoCatalogProvider } from "@/features/products/components/DemoCatalogProvider/DemoCatalogProvider";

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
      <body className="flex min-h-svh flex-col">
        <DemoSessionProvider>
          <DemoCatalogProvider>
            <a
              href="#main-content"
              className="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
            >
              Skip to content
            </a>
            <StoreHeader />
            {children}
            <StoreFooter />
          </DemoCatalogProvider>
        </DemoSessionProvider>
      </body>
    </html>
  );
}
