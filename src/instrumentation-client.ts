import * as Sentry from "@sentry/nextjs";
import { sentryOptions } from "./lib/sentry";

// Runs before the app becomes interactive: catches browser errors from the start.
Sentry.init(sentryOptions);

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
