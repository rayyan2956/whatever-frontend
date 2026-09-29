"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { BRAND_NAME, VENDOR_APP_URL } from "@/lib/brand";
import { Avatar } from "./ui";

export function SiteHeader() {
  const { status, user } = useAuth();

  return (
    <header className="border-b border-sand-200 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-brand-800">
          {BRAND_NAME}
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          <a href={VENDOR_APP_URL} className="hidden rounded-lg px-3 py-2 text-stone-700 hover:bg-sand-100 sm:block">
            List your tours
          </a>
          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-medium text-stone-900 hover:bg-sand-100"
            >
              <Avatar name={user.name} src={user.avatarUrl} className="size-7 text-xs" />
              {user.name.split(" ")[0]}
            </Link>
          ) : status === "anonymous" ? (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-stone-700 hover:bg-sand-100">
                Log in
              </Link>
              <Link href="/register" className="rounded-lg bg-brand-700 px-3 py-2 font-medium text-white hover:bg-brand-800">
                Sign up
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
