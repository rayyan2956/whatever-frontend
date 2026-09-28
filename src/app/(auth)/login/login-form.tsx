"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { GoogleButton } from "@/components/google-button";
import { Alert, Button, Field } from "@/components/ui";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toFormError, type FormError } from "@/lib/errors";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const [unverified, setUnverified] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setUnverified(false);
    try {
      await login(email, password);
      router.replace(redirectTo);
    } catch (err) {
      setUnverified(err instanceof ApiError && err.code === "EMAIL_NOT_VERIFIED");
      setError(toFormError(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && (
          <Alert>
            {error.message}
            {unverified && (
              <>
                {" "}
                <Link href={`/verify-email?email=${encodeURIComponent(email)}`} className="font-medium underline">
                  Resend the link
                </Link>
              </>
            )}
          </Alert>
        )}
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error?.fields.email}
        />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error?.fields.password}
        />
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-brand-700 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" loading={submitting}>
          Log in
        </Button>
      </form>
      <GoogleButton redirectTo={redirectTo} />
    </div>
  );
}
