import type { ReactElement } from "react";
import { MissingPage } from "@/app/components/MissingPage/MissingPage";

interface Props {
  children?: never;
}

/**
 * Handles unmatched application URLs; takes no configurable inputs.
 * @param _props - Empty framework props.
 * @returns A missing-page message and a route to the collection.
 */
export default function NotFound(_props: Props): ReactElement {
  return (
    <MissingPage title="Page not found">
      This page isn’t part of the store. Let’s get you back to the collection.
    </MissingPage>
  );
}
