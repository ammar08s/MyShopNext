"use client";

import type { ReactElement } from "react";
import { RequestError } from "@/app/components/RequestError/RequestError";

interface Props {
  error: unknown;
  reset: () => void;
  retry: () => void;
}

/**
 * Recovers a failed collection read while preserving the catalog layout.
 * @param props - Error information and recovery actions supplied by Next.js.
 * @returns Safe inline request feedback and a fresh-read retry action.
 */
export default function CatalogError({ retry }: Props): ReactElement {
  return (
    <RequestError title="We couldn’t load the collection" retry={retry}>
      Please check your connection and try again. Your next find will be here
      when the collection is available.
    </RequestError>
  );
}
