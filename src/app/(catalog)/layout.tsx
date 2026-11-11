import type { ReactElement, ReactNode } from "react";
import { CatalogIntro } from "@/app/components/CatalogIntro/CatalogIntro";
import { CatalogWorkspace } from "@/features/products/components/catalog/CatalogWorkspace/CatalogWorkspace";

interface Props {
  children: ReactNode;
}

/**
 * Keeps the catalog introduction and interactive controls outside request fallbacks.
 * @param props - Catalog route content or its loading/error feedback.
 * @returns The catalog landmark, persistent controls and streamed route content.
 */
export default function CatalogLayout({ children }: Props): ReactElement {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-7xl flex-1 px-5 sm:px-8 lg:px-12"
    >
      <CatalogIntro />
      <CatalogWorkspace>{children}</CatalogWorkspace>
    </main>
  );
}
