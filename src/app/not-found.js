import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata = { title: "Page not found | CVCraft" };

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
        <p className="text-sm font-semibold text-indigo-600">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/" className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700">
            Go home
          </Link>
          <Link href="/templates" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-800">
            Browse templates
          </Link>
        </div>
      </main>
    </div>
  );
}
