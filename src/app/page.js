import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Icon from "@/components/templates/Icon";
import { HeroStack, TemplateRow } from "@/components/landing/TemplateShowcase";
import { catalog, getCatalogEntry, layouts } from "@/components/templates";
import { palettes } from "@/lib/palettes";

export const metadata = {
  title: "CVCraft – Free Resume & Cover Letter Builder with 300+ Templates",
  description:
    "Create a professional resume in minutes. Pick from 300+ editable templates, write a matching cover letter, see changes live and download a PDF. No sign-up needed.",
};

const POPULAR = [
  "horizon--navy-gold",
  "executive--ocean",
  "sandstone--plum",
  "split--forest",
  "classic--charcoal",
  "midnight--indigo",
].map(getCatalogEntry);

const PREMIUM = [
  "arch--sunset--male",
  "daydream--plum--female",
  "aurora--ocean",
  "scrapbook--forest--female",
  "gazette--teal--male",
  "prestige--navy-gold",
].map(getCatalogEntry);

const FEATURES = [
  { icon: "pen", title: "Live preview with undo", text: "Every change appears as you type, and undo / redo (Ctrl+Z) takes back any edit." },
  { icon: "star", title: "Resume score", text: "A live 0–100 score with tips on action verbs, numbers, length and missing details." },
  { icon: "book", title: "Writing help", text: "Ready-made summaries, bullet points, skills and cover letter paragraphs for 16 common roles." },
  { icon: "mail", title: "Matching cover letters", text: "Six letter designs that copy your resume's colours, font, photo and contact details." },
  { icon: "contact", title: "Multiple resumes", text: "Keep a version for every job: duplicate, rename and manage them in My documents." },
  { icon: "experience", title: "ATS-friendly options", text: "Simple, text-based layouts that applicant tracking systems read cleanly." },
  { icon: "code", title: "Drag-and-drop sections", text: "Reorder sections, hide the ones you don't need and add projects or certifications." },
  { icon: "skills", title: "Colours, fonts and avatars", text: "Ten colour themes, ten fonts, and your photo, initials or a simple avatar." },
  { icon: "user", title: "Private by design", text: "No account and no upload. Everything is saved in your own browser." },
];

const STEPS = [
  { title: "Pick a template", text: "Browse the gallery and filter by style, layout, photo or colour." },
  { title: "Fill in your details", text: "Type into simple forms and watch the resume update next to them." },
  { title: "Download your PDF", text: "Save a print-ready A4 PDF with real, selectable text." },
];

const FAQ = [
  {
    q: "Is CVCraft free?",
    a: "Yes. Every template, colour and font is free to use, and downloading a PDF is free.",
  },
  {
    q: "What are premium templates?",
    a: "Premium templates are our most detailed designs, with extras like skill rings, icon timelines and decorative frames. They're marked with a ★ Premium badge and are currently free to use like every other template.",
  },
  {
    q: "Do I need an account?",
    a: "No. Open the editor and start typing. Your resume is saved automatically in your browser on this device.",
  },
  {
    q: "Where is my data stored?",
    a: "Only in your browser's local storage. Nothing is uploaded to a server. Clearing your browser data, or using another device or browser, means starting again.",
  },
  {
    q: "Which templates are ATS-friendly?",
    a: "Classic, Executive, Minimal, Compact and Timeline Pro use a simple structure without photos or decorative shapes, which applicant tracking systems read most reliably. Use the “ATS-friendly only” filter in the gallery to see them.",
  },
  {
    q: "How do I download my resume as a PDF?",
    a: "Click “Download PDF” in the editor. Your browser's print dialog opens: choose “Save as PDF” as the destination. The text in the PDF stays real text, not an image.",
  },
  {
    q: "Can I change the template after I've written my resume?",
    a: "Yes. Pick another layout, colour or font at any time; your content stays the same.",
  },
  {
    q: "What if my resume is longer than one page?",
    a: "It continues onto a second page. The editor shows a dashed “Page 2” line where the page will break, so you can trim or reorder sections.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader>
        <Link href="/editor" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700">
          Create my resume
        </Link>
      </SiteHeader>

      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              Free · No sign-up · PDF download
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Build a resume that gets you interviews
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              Choose from {catalog.length} professionally designed templates, fill in your details with a live preview and
              download a print-ready PDF in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/editor" className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow hover:bg-indigo-700">
                Create my resume
              </Link>
              <Link
                href="/templates"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:border-slate-400"
              >
                Browse templates
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-center">
              {[
                [catalog.length, "templates"],
                [layouts.length, "layouts"],
                [palettes.length, "colour themes"],
              ].map(([n, label]) => (
                <div key={label} className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200">
                  <dt className="text-2xl font-bold text-slate-900">{n}</dt>
                  <dd className="text-xs text-slate-500">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroStack />
        </div>
      </section>

      {/* Popular templates */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Popular templates</h2>
            <p className="mt-2 text-slate-600">Click any template to start editing it.</p>
          </div>
          <Link href="/templates" className="font-semibold text-indigo-600 hover:text-indigo-800">
            See all {catalog.length} templates →
          </Link>
        </div>
        <TemplateRow entries={POPULAR} />
      </section>

      {/* Premium templates */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-3 py-1 text-xs font-bold text-amber-950">★ Premium</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Premium templates</h2>
              <p className="mt-2 text-slate-600">
                {catalog.filter((c) => c.premium).length} of our most detailed designs, with skill rings, icon timelines and
                decorative frames. Free to use.
              </p>
            </div>
            <Link href="/templates" className="font-semibold text-amber-700 hover:text-amber-900">
              See premium templates →
            </Link>
          </div>
          <TemplateRow entries={PREMIUM} />
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">Everything you need, nothing you don&apos;t</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                  <Icon name={f.icon} size={20} color="#4f46e5" />
                </div>
                <h3 className="font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">Three steps to a finished resume</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-slate-200 p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">{i + 1}</span>
              <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">Frequently asked questions</h2>
          <div className="mt-10 space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                  {item.q}
                  <span className="text-slate-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="bg-indigo-600">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Ready to build your resume?</h2>
          <p className="max-w-xl text-indigo-100">Start with a template and have a finished PDF in minutes.</p>
          <Link href="/editor" className="rounded-lg bg-white px-6 py-3 font-semibold text-indigo-700 shadow hover:bg-indigo-50">
            Create my resume
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
