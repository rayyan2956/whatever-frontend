// API client with in-memory access token and single-flight refresh (PRD §11.2).
// The refresh token lives in an httpOnly cookie set by the API; this code never sees it.
// Request and response types are generated from the API spec (see src/api/types.ts).

import * as Sentry from "@sentry/nextjs";
import type { AuthSession } from "@/api/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";
const CLIENT_APP = "frontend";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: Record<string, string[]>,
    readonly requestId?: string,
  ) {
    super(message);
  }
}

let accessToken: string | null = null;
let refreshInFlight: Promise<AuthSession | null> | null = null;
let onSessionEnded: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

// Called when a refresh fails, so the app can drop the user back to logged-out.
export function setSessionEndedHandler(handler: (() => void) | null) {
  onSessionEnded = handler;
}

function send(path: string, init: RequestInit, withAuth: boolean) {
  const headers = new Headers(init.headers);
  headers.set("X-Client-App", CLIENT_APP);
  if (init.body) headers.set("Content-Type", "application/json");
  if (withAuth && accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  return fetch(`${API_URL}${path}`, { ...init, headers, credentials: "include" });
}

async function parse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const error = body?.error;
    const apiError = new ApiError(
      res.status,
      error?.code ?? "UNKNOWN",
      error?.message ?? "Something went wrong. Please try again.",
      error?.details,
      error?.requestId,
    );
    // Server faults only; 4xx are expected. The requestId links this report to
    // the API's own Sentry event and logs.
    if (res.status >= 500) {
      Sentry.captureException(apiError, {
        tags: { requestId: apiError.requestId, apiCode: apiError.code },
      });
    }
    throw apiError;
  }
  return body as T;
}

// Only one refresh runs at a time; parallel callers share its result.
export function refreshSession(): Promise<AuthSession | null> {
  refreshInFlight ??= (async () => {
    try {
      const res = await send("/auth/refresh", { method: "POST" }, false);
      if (!res.ok) {
        accessToken = null;
        return null;
      }
      const session = (await res.json()) as AuthSession;
      accessToken = session.accessToken;
      return session;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  // false for public endpoints (login, register...)
  auth?: boolean;
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const init: RequestInit = {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  };

  let res = await send(path, init, auth);
  if (auth && res.status === 401) {
    const error = await res.clone().json().catch(() => null);
    if (error?.error?.code === "TOKEN_EXPIRED") {
      const session = await refreshSession();
      if (session) {
        res = await send(path, init, auth);
      } else {
        onSessionEnded?.();
      }
    } else {
      accessToken = null;
      onSessionEnded?.();
    }
  }
  return parse<T>(res);
}
