"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { toFormError, type FormError } from "@/lib/errors";
import { Alert, Button, Card, Field } from "./ui";

export function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const [saved, setSaved] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      await api("/auth/change-password", { method: "POST", body: { currentPassword, newPassword } });
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(toFormError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <h2 className="font-semibold text-stone-900">Change password</h2>
      <p className="mt-1 text-sm text-stone-600">Other devices will be logged out.</p>
      <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
        {saved && <Alert tone="success">Password changed.</Alert>}
        {error && Object.keys(error.fields).length === 0 && <Alert>{error.message}</Alert>}
        <Field id="currentPassword" label="Current password" type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} error={error?.fields.currentPassword} />
        <Field id="newPassword" label="New password" type="password" autoComplete="new-password" hint="At least 8 characters, with a letter and a number." value={newPassword} onChange={(e) => setNewPassword(e.target.value)} error={error?.fields.newPassword} />
        <Button type="submit" loading={submitting}>Save password</Button>
      </form>
    </Card>
  );
}
