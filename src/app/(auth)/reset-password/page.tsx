import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { Alert } from "@/components/ui";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { token } = await searchParams;
  return (
    <AuthCard title="Choose a new password">
      {typeof token === "string" && token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <Alert>
          This reset link is incomplete.{" "}
          <Link href="/forgot-password" className="font-medium underline">
            Request a new one
          </Link>
          .
        </Alert>
      )}
    </AuthCard>
  );
}
