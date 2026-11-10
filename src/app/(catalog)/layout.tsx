import type { ReactElement, ReactNode } from "react";
import { CatalogIntro } from "@/app/components/CatalogIntro/CatalogIntro";

interface Props {
  children: ReactNode;
}

/**
 * Keeps the catalog introduction outside route request fallbacks.
 * @param props - Catalog route content or its loading/error feedback.
 * @returns The catalog page landmark and persistent introduction.
 */
export default function CatalogLayout({ children }: Props): ReactElement {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-7xl flex-1 px-5 sm:px-8 lg:px-12"
    >
      <CatalogIntro />
      {children}
    </main>
  );
}
