"use client";

import { useState, type FormEvent } from "react";
import { GoogleButton } from "@/components/google-button";
import { Alert, Button, Field } from "@/components/ui";
import { api } from "@/lib/api";
import { toFormError, type FormError } from "@/lib/errors";

export function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: e.target.value }));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api("/auth/register", {
        method: "POST",
        auth: false,
        body: { ...form, phone: form.phone || undefined },
      });
      setSentTo(form.email);
    } catch (err) {
      setError(toFormError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (sentTo) {
    return (
      <Alert tone="success">
        We sent a verification link to <strong>{sentTo}</strong>. Open it to activate your account,
        then log in.
      </Alert>
    );
  }

  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && Object.keys(error.fields).length === 0 && <Alert>{error.message}</Alert>}
        <Field id="name" label="Full name" autoComplete="name" required value={form.name} onChange={update("name")} error={error?.fields.name} />
        <Field id="email" label="Email" type="email" autoComplete="email" required value={form.email} onChange={update("email")} error={error?.fields.email} />
        <Field
          id="phone"
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          placeholder="+923001234567"
          value={form.phone}
          onChange={update("phone")}
          error={error?.fields.phone}
        />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          hint="At least 8 characters, with a letter and a number."
          value={form.password}
          onChange={update("password")}
          error={error?.fields.password}
        />
        <Button type="submit" className="w-full" loading={submitting}>
          Create account
        </Button>
      </form>
      <GoogleButton redirectTo="/account" />
    </div>
  );
}
