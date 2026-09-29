import Link from "next/link";
import { Card } from "@/components/ui";

export const metadata = { title: "Account deleted" };

export default function AccountDeletedPage() {
  return (
    <main className="mx-auto w-full max-w-lg px-4 py-16">
      <Card>
        <h1 className="text-xl font-semibold text-stone-900">Your account was deleted</h1>
        <p className="mt-2 text-sm text-stone-600">
          You&apos;ve been logged out on all devices. If you deleted it by mistake, contact our support
          team and we can restore it.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-brand-700 hover:underline">
          Back to home
        </Link>
      </Card>
    </main>
  );
}
