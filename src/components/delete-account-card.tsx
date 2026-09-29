"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useState, type FormEvent } from "react";
import type { User } from "@/api/types";
import { api } from "@/lib/api";
import { toFormError, type FormError } from "@/lib/errors";
import { GOOGLE_CLIENT_ID } from "./google-button";
import { Alert, Button, Card, Field } from "./ui";

// PRD §4.1. The API soft-deletes: the account stops working at once but can be
// restored by support. Password accounts confirm with the password; Google-only
// accounts confirm by signing in with Google again.
export function DeleteAccountCard({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  async function deleteAccount(confirmation: { password: string } | { googleIdToken: string }) {
    setSubmitting(true);
    setError(null);
    try {
      await api("/me", { method: "DELETE", body: confirmation });
      // Full page load: drops the in-memory token and every cached screen, and
      // leaves /account before its auth guard can redirect to /login.
      window.location.replace("/account/deleted");
    } catch (err) {
      setError(toFormError(err));
      setSubmitting(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void deleteAccount({ password });
  }

  return (
    <Card className="border-red-200">
      <h2 className="font-semibold text-stone-900">Delete account</h2>
      <p className="mt-1 text-sm text-stone-600">
        You&apos;ll be logged out everywhere and won&apos;t be able to log in again. Your email and
        CNIC can&apos;t be used for a new account.
      </p>

      {!open ? (
        <Button variant="danger" className="mt-5" onClick={() => setOpen(true)}>
          Delete my account
        </Button>
      ) : (
        <div className="mt-5 space-y-4">
          {error && Object.keys(error.fields).length === 0 && <Alert>{error.message}</Alert>}
          {user.hasPassword ? (
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <Field
                id="delete-password"
                label="Enter your password to confirm"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error?.fields.password}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="submit"
                  className="bg-red-700 text-white hover:bg-red-800 disabled:bg-red-700/60"
                  loading={submitting}
                  disabled={!password}
                >
                  Delete account
                </Button>
                <Button type="button" variant="secondary" disabled={submitting} onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : GOOGLE_CLIENT_ID ? (
            <div className="space-y-3">
              <p className="text-sm text-stone-700">Sign in with Google again to confirm.</p>
              <GoogleLogin
                text="continue_with"
                onSuccess={({ credential }) => {
                  if (credential) void deleteAccount({ googleIdToken: credential });
                }}
                onError={() =>
                  setError({ message: "Google sign-in didn't complete. Please try again.", fields: {} })
                }
              />
              <Button type="button" variant="secondary" disabled={submitting} onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Alert>Google sign-in isn&apos;t available right now, so we can&apos;t confirm it&apos;s you.</Alert>
          )}
        </div>
      )}
    </Card>
  );
}
