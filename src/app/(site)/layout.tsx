import { SiteHeader } from "@/components/site-header";
import { BRAND_NAME } from "@/lib/brand";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <footer className="border-t border-sand-200">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-stone-500">
          © {new Date().getFullYear()} {BRAND_NAME}. Tours and transport across Pakistan.
        </div>
      </footer>
    </>
  );
}
