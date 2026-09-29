"use client";

import { useRouter } from "next/navigation";
import { ChangePasswordCard } from "@/components/change-password-card";
import { DeleteAccountCard } from "@/components/delete-account-card";
import { ProfileCard } from "@/components/profile-card";
import { SessionsCard } from "@/components/sessions-card";
import { Button } from "@/components/ui";
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

      <ProfileCard user={user} />
      {user.hasPassword && <ChangePasswordCard />}
      <SessionsCard />
      <DeleteAccountCard user={user} />
    </main>
  );
}
