import type { BrowserOptions } from "@sentry/nextjs";

// Shared Sentry options for the browser, Node and edge runtimes (PRD §11.4).
// Without NEXT_PUBLIC_SENTRY_DSN, Sentry stays off (local development).
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || undefined;

export const sentryOptions = {
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  initialScope: { tags: { app: "frontend" } },
  // Errors only for now; performance tracing can be turned on later.
  tracesSampleRate: 0,
  // Never send cookies or request bodies (passwords, tokens, CNIC).
  beforeSend(event) {
    if (event.request) {
      delete event.request.cookies;
      delete event.request.data;
    }
    return event;
  },
} satisfies BrowserOptions;
