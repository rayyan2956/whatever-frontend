import * as Sentry from "@sentry/nextjs";
import { sentryOptions } from "./lib/sentry";

// Server-side error reporting for the Node and edge runtimes.
export function register() {
  Sentry.init(sentryOptions);
}

export const onRequestError = Sentry.captureRequestError;
