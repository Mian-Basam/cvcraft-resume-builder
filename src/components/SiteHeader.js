import Link from "next/link";

export default function SiteHeader({ active, children }) {
  const link = (href, label, key) => (
    <Link
      href={href}
      className={`rounded-md px-3 py-1.5 text-sm font-medium ${
        active === key ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
          CV<span className="text-indigo-600">Craft</span>
        </Link>
        <nav className="flex gap-1">
          {link("/templates", "Templates", "templates")}
          {link("/documents", "My documents", "documents")}
          {link("/editor", "Editor", "editor")}
        </nav>
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </header>
  );
}
