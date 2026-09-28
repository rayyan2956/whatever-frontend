"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { toFormError } from "@/lib/errors";
import { Alert } from "./ui";

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Google Identity Services returns an ID token, which the API verifies.
export function GoogleButton({ redirectTo }: { redirectTo: string }) {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-stone-400">
        <span className="h-px flex-1 bg-stone-200" />
        or
        <span className="h-px flex-1 bg-stone-200" />
      </div>
      <div className="flex justify-center">
        <GoogleLogin
          width="320"
          text="continue_with"
          onSuccess={async ({ credential }) => {
            if (!credential) return;
            try {
              await loginWithGoogle(credential);
              router.replace(redirectTo);
            } catch (err) {
              setError(toFormError(err).message);
            }
          }}
          onError={() => setError("Google sign-in didn't complete. Please try again.")}
        />
      </div>
      {error && <Alert>{error}</Alert>}
    </div>
  );
}
