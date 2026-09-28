import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND_NAME } from "@/lib/brand";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center text-lg font-semibold text-brand-800">
          {BRAND_NAME}
        </Link>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-semibold text-stone-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-stone-600">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-sm text-stone-600">{footer}</div>}
      </div>
    </main>
  );
}
