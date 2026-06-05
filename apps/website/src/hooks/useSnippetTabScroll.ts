import { useLayoutEffect, useRef, type RefObject } from "react";
import { resetSnippetTabScroll } from "@/lib/snippet-tab-scroll";

/** On tab change, reset scroll only when the tab bar is already pinned. */
export function useSnippetTabScroll(
  anchorRef: RefObject<HTMLElement | null>,
  tabKey: string,
) {
  const isFirstMount = useRef(true);

  useLayoutEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    resetSnippetTabScroll(anchorRef.current);
  }, [tabKey, anchorRef]);
}
