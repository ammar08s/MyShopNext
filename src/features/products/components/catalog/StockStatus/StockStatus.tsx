import type { ReactElement } from "react";
import { Badge } from "@/shared/components/ui/Badge/Badge";

interface Props {
  inStock: boolean;
}

/**
 * Presents actual stock state consistently across both product views.
 * @param props - Whether the validated product is available.
 * @returns A textual badge that does not rely on color alone.
 */
export function StockStatus({ inStock }: Props): ReactElement {
  return (
    <Badge
      variant={inStock ? "secondary" : "outline"}
      className="gap-1.5 text-[10px] font-normal"
    >
      <span aria-hidden="true" className="size-1 rounded-full bg-current" />
      {inStock ? "In stock" : "Out of stock"}
    </Badge>
  );
}
