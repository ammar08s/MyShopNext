import type { ReactElement } from "react";

interface Props {
  children?: never;
}

/** @param _props - Empty framework props; no configurable inputs. @returns Shared-list feedback that preserves the editor. */
export default function AdminLoading(_props: Props): ReactElement {
  return (
    <section
      role="status"
      aria-busy="true"
      className="rounded-xl border bg-card p-6 text-sm text-muted-foreground"
    >
      Loading the shared product catalog…
    </section>
  );
}
