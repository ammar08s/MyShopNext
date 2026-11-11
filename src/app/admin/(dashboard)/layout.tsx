import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { Icon } from "@/shared/components/ui/Icon/Icon";
import { AdminAccessGuard } from "@/app/components/AdminAccessGuard/AdminAccessGuard";
import { ProductManager } from "@/features/products/components/management/ProductManager/ProductManager";

interface Props {
  children: ReactNode;
}

/**
 * Keeps the role guard and product editor mounted above shared-list boundaries.
 * @param props - Admin shared-product route or its loading/error feedback.
 * @returns The protected demo workspace with persistent browser edit state.
 */
export default function AdminLayout({ children }: Props): ReactElement {
  return (
    <AdminAccessGuard>
      <main
        id="main-content"
        className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 pb-16 sm:px-8 lg:px-12"
      >
        <header className="mb-7 flex flex-wrap items-end justify-between gap-5 border-b pb-7">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-widest text-primary uppercase">
              <Icon name="shield" />
              ShopBoard / Admin demo
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Product management
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Create, edit and organize your browser’s collection.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium hover:border-primary hover:text-primary"
          >
            View storefront <Icon name="arrow-up-right" />
          </Link>
        </header>
        <ProductManager>{children}</ProductManager>
      </main>
    </AdminAccessGuard>
  );
}
