"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { api, type User } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toFormError, type FormError } from "@/lib/errors";
import { AvatarEditor } from "./avatar-editor";
import { Alert, Button, Card, Field } from "./ui";

const CNIC_ERROR_FIELDS = { CNIC_LOCKED: "cnic", CNIC_ALREADY_REGISTERED: "cnic" };

type ProfileForm = { name: string; phone: string; city: string; cnic: string };

const formFrom = (user: User): ProfileForm => ({
  name: user.name,
  phone: user.phone ?? "",
  city: user.city ?? "",
  cnic: "",
});

// PRD §4.1: name, phone, city and photo are editable. Email never changes; the
// CNIC can be added once and is locked after that.
export function ProfileCard({ user }: { user: User }) {
  const { setUser } = useAuth();
  const [form, setForm] = useState(() => formFrom(user));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof ProfileForm) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: e.target.value }));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const cnic = form.cnic.trim();
    if (
      cnic &&
      !window.confirm(`Save CNIC ${cnic}? You won't be able to change it later.`)
    ) {
      return;
    }
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await api<User>("/me", {
        method: "PATCH",
        body: {
          name: form.name,
          // Empty clears the field.
          phone: form.phone.trim() || null,
          city: form.city.trim() || null,
          ...(cnic ? { cnic } : {}),
        },
      });
      setUser(updated);
      setForm(formFrom(updated));
      setSaved(true);
    } catch (err) {
      setError(toFormError(err, CNIC_ERROR_FIELDS));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <h2 className="font-semibold text-stone-900">Profile</h2>
      <div className="mt-5">
        <AvatarEditor user={user} />
      </div>
      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        {saved && <Alert tone="success">Profile saved.</Alert>}
        {error && Object.keys(error.fields).length === 0 && <Alert>{error.message}</Alert>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="name" label="Full name" autoComplete="name" required value={form.name} onChange={update("name")} error={error?.fields.name} />
          <Field id="email" label="Email" type="email" value={user.email} readOnly disabled hint="Your email can't be changed." />
          <Field
            id="phone"
            label="Mobile number"
            type="tel"
            autoComplete="tel"
            placeholder="03001234567"
            value={form.phone}
            onChange={update("phone")}
            error={error?.fields.phone}
          />
          <Field id="city" label="City" autoComplete="address-level2" placeholder="Lahore" value={form.city} onChange={update("city")} error={error?.fields.city} />
          {user.cnic ? (
            <Field id="cnic" label="CNIC" value={user.cnic} readOnly disabled hint="Your CNIC is saved and can't be changed." />
          ) : (
            <Field
              id="cnic"
              label="CNIC (optional)"
              inputMode="numeric"
              placeholder="35202-1234567-1"
              value={form.cnic}
              onChange={update("cnic")}
              error={error?.fields.cnic}
              hint="You can add it once. It can't be changed later."
            />
          )}
        </div>
        <Button type="submit" loading={submitting}>
          Save profile
        </Button>
      </form>
    </Card>
  );
}
