import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactElement } from "react";
import { badgeVariants } from "@/shared/modules/ui/badgeVariants";
import { cn } from "@/shared/modules/ui/cn";

interface Props
  extends ComponentProps<"span">, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

/**
 * Renders the source-owned shadcn/ui Badge with native span or child composition.
 * Adapted from the new-york-v4 Badge; the upstream MIT license is in ../LICENSE.
 * @param props - Native attributes, styling variant, and optional child composition.
 * @returns A styled badge, or its child with the badge attributes when asChild is set.
 */
export function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: Props): ReactElement {
  const Component = asChild ? Slot : "span";

  return (
    <Component
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
