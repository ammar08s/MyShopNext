import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { Icon } from "@/shared/components/ui/Icon/Icon";
import { ProductArtwork } from "@/features/products/components/catalog/ProductArtwork/ProductArtwork";

interface Props {
  children: ReactNode;
}

/**
 * Composes a login portal with shared server-rendered store artwork.
 * @param props - The role-specific login form rendered as children.
 * @returns A responsive page that coordinates the independent feature content.
 */
export function LoginPageLayout({ children }: Props): ReactElement {
  return (
    <main
      id="main-content"
      className="mx-auto grid w-full max-w-7xl flex-1 items-stretch gap-8 px-5 py-8 sm:px-8 md:grid-cols-2 lg:gap-16 lg:px-12 lg:py-12"
    >
      <aside className="relative hidden flex-col justify-between overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground md:flex lg:p-10">
        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase opacity-70">
            ShopBoard / Everyday discovery
          </p>
          <h2 className="mt-7 text-4xl leading-tight font-medium tracking-tight lg:text-5xl">
            Good finds.
            <br />A warm welcome.
          </h2>
        </div>
        <ProductArtwork
          productTitle="Leather Tote Bag"
          category="Bags"
          className="mx-auto my-8 aspect-square w-full max-w-80 rotate-[-4deg] rounded-2xl shadow-xl"
        />
        <div className="flex items-center justify-between gap-4 border-t border-white/20 pt-5 text-xs">
          <p className="max-w-44 leading-5 opacity-75">
            A little something for wherever you’re headed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm font-medium underline underline-offset-4"
          >
            Browse <Icon name="arrow-up-right" />
          </Link>
        </div>
      </aside>
      <div className="flex min-w-0 items-center justify-center rounded-3xl border bg-card px-5 py-9 shadow-sm sm:px-9 lg:px-12">
        {children}
      </div>
    </main>
  );
}
