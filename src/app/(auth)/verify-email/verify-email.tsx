"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Alert, Button, Field, Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import { toFormError } from "@/lib/errors";

export function VerifyEmail({ token }: { token: string }) {
  const [state, setState] = useState<"verifying" | "done" | { error: string }>("verifying");
  const started = useRef(false);

  useEffect(() => {
    // The token is single-use; don't send it twice in React strict mode.
    if (started.current) return;
    started.current = true;
    api("/auth/verify-email", { method: "POST", auth: false, body: { token } })
      .then(() => setState("done"))
      .catch((err) => setState({ error: toFormError(err).message }));
  }, [token]);

  if (state === "verifying") {
    return (
      <p className="flex items-center gap-2 text-sm text-stone-600">
        <Spinner className="size-4 text-brand-700" /> Verifying your email…
      </p>
    );
  }
  if (state === "done") {
    return (
      <Alert tone="success">
        Your email is verified.{" "}
        <Link href="/login" className="font-medium underline">
          Log in
        </Link>
      </Alert>
    );
  }
  return (
    <div className="space-y-4">
      <Alert>{state.error}</Alert>
      <ResendVerification initialEmail="" />
    </div>
  );
}

export function ResendVerification({ initialEmail }: { initialEmail: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api("/auth/resend-verification", { method: "POST", auth: false, body: { email } });
      setMessage({ tone: "success", text: "If that account needs verifying, we sent a new link." });
    } catch (err) {
      setMessage({ tone: "error", text: toFormError(err).message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <p className="text-sm text-stone-600">Didn&apos;t get the email? We can send a new link.</p>
      {message && <Alert tone={message.tone}>{message.text}</Alert>}
      <Field id="email" label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button type="submit" variant="secondary" className="w-full" loading={submitting}>
        Send a new link
      </Button>
    </form>
  );
}
