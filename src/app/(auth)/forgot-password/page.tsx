"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthCard } from "@/components/auth-card";
import { Alert, Button, Field } from "@/components/ui";
import { api } from "@/lib/api";
import { toFormError, type FormError } from "@/lib/errors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api("/auth/forgot-password", { method: "POST", auth: false, body: { email } });
      setSent(true);
    } catch (err) {
      setError(toFormError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={<Link href="/login" className="font-medium text-brand-700 hover:underline">Back to log in</Link>}
    >
      {sent ? (
        <Alert tone="success">If an account exists for {email}, a reset link is on its way.</Alert>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {error && Object.keys(error.fields).length === 0 && <Alert>{error.message}</Alert>}
          <Field id="email" label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={error?.fields.email} />
          <Button type="submit" className="w-full" loading={submitting}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
