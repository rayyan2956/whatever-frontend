import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { safeNext } from "@/lib/redirect";
import { LoginForm } from "./login-form";

export const metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  return (
    <AuthCard
      title="Log in"
      subtitle="Welcome back. Log in to see and manage your trips."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-medium text-brand-700 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm redirectTo={safeNext(next, "/account")} />
    </AuthCard>
  );
}
