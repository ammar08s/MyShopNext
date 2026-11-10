"use client";
import type { ReactElement } from "react";
import { RequestError } from "@/app/components/RequestError/RequestError";

interface Props {
  error: unknown;
  reset: () => void;
  retry: () => void;
}

/** @param props - Framework request recovery actions. @returns Retryable feedback without unmounting saved local products or drafts. */
export default function AdminError({ retry }: Props): ReactElement {
  return (
    <RequestError title="The shared catalog couldn’t be loaded" retry={retry}>
      Your editor and saved demo changes are still available. Try loading the
      shared products again.
    </RequestError>
  );
}
