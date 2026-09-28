"use client";

import { useRouter } from "next/navigation";
import { ChangePasswordCard } from "@/components/change-password-card";
import { SessionsCard } from "@/components/sessions-card";
import { Button, Card } from "@/components/ui";
import { useAuth } from "@/lib/auth";

export function AccountView() {
  const { user, logout } = useAuth();
  const router = useRouter();
  if (!user) return null;

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Your account</h1>
          <p className="mt-1 text-sm text-stone-600">Your trips and bookings will show up here.</p>
        </div>
        <Button
          variant="secondary"
          onClick={async () => {
            await logout();
            router.replace("/");
          }}
        >
          Log out
        </Button>
      </div>

      <Card>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-stone-500">Name</dt>
            <dd className="mt-1 font-medium text-stone-900">{user.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">Email</dt>
            <dd className="mt-1 font-medium text-stone-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">Phone</dt>
            <dd className="mt-1 font-medium text-stone-900">{user.phone ?? "Not added"}</dd>
          </div>
        </dl>
      </Card>

      {user.hasPassword && <ChangePasswordCard />}
      <SessionsCard />
    </main>
  );
}
