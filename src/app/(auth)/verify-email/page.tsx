import { AuthCard } from "@/components/auth-card";
import { ResendVerification, VerifyEmail } from "./verify-email";

export const metadata = { title: "Verify your email" };

export default async function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  const { token, email } = await searchParams;
  return (
    <AuthCard title="Verify your email">
      {typeof token === "string" && token ? (
        <VerifyEmail token={token} />
      ) : (
        <ResendVerification initialEmail={typeof email === "string" ? email : ""} />
      )}
    </AuthCard>
  );
}
