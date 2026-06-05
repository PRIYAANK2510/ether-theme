/** Scroll Y where the snippet tab bar pins below the site topbar. */
export function snippetTabPinScrollY(anchor: HTMLElement) {
  const topbarHeight =
    Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--topbar-height",
      ),
    ) || 80;

  const { top } = anchor.getBoundingClientRect();
  return Math.max(0, top + window.scrollY - topbarHeight);
}

/** True when the user has scrolled past the tab bar's natural position. */
export function isSnippetTabBarPinned(anchor: HTMLElement) {
  return window.scrollY >= snippetTabPinScrollY(anchor) - 1;
}

/** If pinned, scroll so the tab bar sits below the topbar and new content starts underneath. */
export function resetSnippetTabScroll(anchor: HTMLElement | null) {
  if (!anchor || !isSnippetTabBarPinned(anchor)) return;

  window.scrollTo({
    top: snippetTabPinScrollY(anchor),
    left: 0,
    behavior: "instant",
  });
}
