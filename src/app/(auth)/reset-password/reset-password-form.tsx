"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Alert, Button, Field } from "@/components/ui";
import { api } from "@/lib/api";
import { toFormError, type FormError } from "@/lib/errors";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api("/auth/reset-password", {
        method: "POST",
        auth: false,
        body: { token, newPassword: password },
      });
      setDone(true);
    } catch (err) {
      setError(toFormError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Alert tone="success">
        Password changed. You&apos;ve been logged out everywhere.{" "}
        <Link href="/login" className="font-medium underline">
          Log in
        </Link>
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && Object.keys(error.fields).length === 0 && <Alert>{error.message}</Alert>}
      <Field
        id="newPassword"
        label="New password"
        type="password"
        autoComplete="new-password"
        required
        hint="At least 8 characters, with a letter and a number."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error?.fields.newPassword}
      />
      <Button type="submit" className="w-full" loading={submitting}>
        Save password
      </Button>
    </form>
  );
}
