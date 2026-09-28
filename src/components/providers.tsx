"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";
import { GOOGLE_CLIENT_ID } from "./google-button";

export function Providers({ children }: { children: ReactNode }) {
  const app = <AuthProvider>{children}</AuthProvider>;
  return GOOGLE_CLIENT_ID ? (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{app}</GoogleOAuthProvider>
  ) : (
    app
  );
}
