// Only allow same-site relative paths, so ?next= can't send users to another site.
export function safeNext(next: string | string[] | undefined, fallback = "/") {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//")
    ? next
    : fallback;
}
