import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-bold text-slate-900">
            CV<span className="text-indigo-600">Craft</span>
          </span>{" "}
          · Your resume stays in your browser.
        </div>
        <nav className="flex gap-5">
          <Link href="/templates" className="hover:text-slate-900">
            Templates
          </Link>
          <Link href="/editor" className="hover:text-slate-900">
            Editor
          </Link>
          <Link href="/#faq" className="hover:text-slate-900">
            FAQ
          </Link>
        </nav>
      </div>
    </footer>
  );
}
