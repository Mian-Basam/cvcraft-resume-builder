// Scores a resume out of 100 with practical tips. Each check has a weight; the score is the
// share of weight passed. Checks only look at sections the user has not hidden.
import { ACTION_VERBS, WEAK_PHRASES } from "./writingHelp";

const words = (t = "") => t.trim().split(/\s+/).filter(Boolean);
const lines = (t = "") => t.split("\n").map((l) => l.replace(/^[-•*\s]+/, "").trim()).filter(Boolean);

export function scoreResume(resume) {
  const hidden = new Set(resume.hiddenSections || []);
  const p = resume.personal || {};
  const exp = hidden.has("experience") ? [] : resume.experience || [];
  const bullets = exp.flatMap((e) => lines(e.bullets));
  const allText = [p.summary, ...bullets, ...(resume.projects || []).map((x) => x.description)].join(" ").toLowerCase();
  const checks = [];
  const add = (group, weight, ok, label, tip) => checks.push({ group, weight, ok: Boolean(ok), label, tip });

  // Contact
  add("Contact", 6, p.name?.trim(), "Full name added", "Add your full name at the top.");
  add("Contact", 4, p.title?.trim(), "Job title added", "Add the job title you're aiming for, e.g. “Marketing Manager”.");
  add("Contact", 6, /\S+@\S+\.\S+/.test(p.email || ""), "Valid email", "Add an email address employers can reach you on.");
  add("Contact", 4, (p.phone || "").replace(/\D/g, "").length >= 7, "Phone number", "Add a phone number.");
  add("Contact", 2, p.address?.trim(), "Location", "Add your city so recruiters know where you're based.");
  add("Contact", 2, p.website?.trim(), "Website or profile link", "Add a portfolio, LinkedIn or GitHub link.");

  // Summary
  const sw = words(p.summary).length;
  if (hidden.has("summary")) {
    add("Summary", 8, false, "Summary is hidden", "Show a short summary: it is the first thing recruiters read.");
  } else {
    add("Summary", 8, sw >= 25 && sw <= 90, `Summary length (${sw} words)`, sw < 25 ? "Write a 2–4 sentence summary (about 30–80 words)." : "Shorten your summary to about 30–80 words.");
  }

  // Experience
  if (exp.length === 0) {
    // One combined check, so an empty section isn't counted against several times.
    add("Experience", 44, false, "Work experience", "Add your work experience (internships and volunteering count) with 2–5 achievements each.");
  } else {
    add("Experience", 10, true, "At least one job", "");
    add("Experience", 4, exp.every((e) => e.start?.trim()), "Dates on every job", "Add a start and end date to each job.");
    add("Experience", 8, exp.every((e) => lines(e.bullets).length >= 2), "2+ achievements per job", "Give each job at least 2 bullet points about what you achieved.");
    const verbShare = bullets.length ? bullets.filter((b) => ACTION_VERBS.includes(b.split(/\s+/)[0].toLowerCase())).length / bullets.length : 0;
    add("Experience", 8, verbShare >= 0.7, `Bullets start with action verbs (${Math.round(verbShare * 100)}%)`, "Start bullets with strong verbs like “Led”, “Built”, “Increased”.");
    const numShare = bullets.length ? bullets.filter((b) => /\d/.test(b)).length / bullets.length : 0;
    add("Experience", 10, numShare >= 0.4, `Results with numbers (${Math.round(numShare * 100)}% of bullets)`, "Add numbers to at least 40% of bullets: %, money saved, people, time.");
    const longBullets = bullets.filter((b) => words(b).length > 30).length;
    add("Experience", 4, longBullets === 0, "Bullets are short and clear", `Shorten ${longBullets} bullet(s) to under 30 words.`);
  }

  // Writing
  const firstPerson = (allText.match(/\b(i|me|my)\b/g) || []).length;
  add("Writing", 4, firstPerson <= 1, "No “I / me / my”", "Remove “I”, “me” and “my”: write “Led a team…”, not “I led a team…”.");
  const weak = WEAK_PHRASES.filter((w) => allText.includes(w));
  add("Writing", 4, weak.length === 0, "No overused phrases", `Replace vague phrases (${weak.slice(0, 3).join(", ")}) with real results.`);
  const placeholders = (allText.match(/\[[^\]]+\]/g) || []).length;
  add("Writing", 6, placeholders === 0, "No [placeholders] left", `Replace the ${placeholders} [bracketed] placeholder(s) with your own details.`);

  // Other sections
  add("Sections", 6, !hidden.has("education") && (resume.education || []).length > 0, "Education", "Add your education.");
  const skills = hidden.has("skills") ? 0 : (resume.skills || []).filter((s) => s.name?.trim()).length;
  add("Sections", 6, skills >= 5 && skills <= 15, `Skills (${skills})`, skills < 5 ? "List at least 5 relevant skills." : "Keep to your 15 most relevant skills.");

  // Length
  const total = words([p.summary, ...bullets, ...(resume.projects || []).map((x) => x.description)].join(" ")).length;
  add("Length", 6, total >= 150 && total <= 750, `Length (${total} words)`, total < 150 ? "Add more detail: aim for 250–650 words." : "Trim to fit one or two pages: aim for under 700 words.");

  const totalWeight = checks.reduce((n, c) => n + c.weight, 0);
  const got = checks.reduce((n, c) => n + (c.ok ? c.weight : 0), 0);
  const score = Math.round((got / totalWeight) * 100);
  const label = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Needs work" : "Getting started";
  return { score, label, checks };
}
