import Link from "next/link";
import { AuthCard } from "@/components/auth-card";
import { RegisterForm } from "./register-form";

export const metadata = { title: "Create an account" };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create an account"
      subtitle="Book tours, group trips and transport across Pakistan."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-700 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
