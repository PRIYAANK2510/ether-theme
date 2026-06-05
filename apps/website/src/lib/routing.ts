export function isSnippetsPath(pathname: string) {
  return pathname === "/snippets" || pathname.startsWith("/snippets/");
}

export function pageTransitionKey(pathname: string) {
  if (isSnippetsPath(pathname)) {
    return "/snippets";
  }
  return pathname;
}
