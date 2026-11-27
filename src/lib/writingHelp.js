// Ready-made writing for common roles. Text in [brackets] is for the user to replace with their own details.
export const ROLES = [
  {
    title: "Software Engineer",
    keywords: ["software", "developer", "engineer", "programmer", "backend", "full stack", "full-stack"],
    summaries: [
      "Software engineer with [X] years of experience building reliable web services and APIs. Comfortable across the stack, with a focus on clean code, automated testing and shipping features that users notice.",
      "Detail-oriented developer who turns complex requirements into simple, maintainable software. Experienced with [languages] and cloud platforms, and known for improving performance and developer workflows.",
      "Engineer who enjoys owning features end to end, from design discussions to production monitoring. Brings strong problem-solving skills and a habit of leaving codebases better than I found them.",
    ],
    bullets: [
      "Built and launched [feature] used by [number] customers, increasing [metric] by [X]%",
      "Reduced API response times by [X]% by profiling slow queries and adding caching",
      "Introduced automated tests and CI checks that cut production bugs by [X]%",
      "Migrated [service] to [cloud platform], lowering hosting costs by [X]% a year",
      "Mentored [number] junior developers through code reviews and pair programming",
      "Designed a REST/GraphQL API consumed by web and mobile apps with 99.9% uptime",
      "Worked with product and design to deliver [project] two weeks ahead of schedule",
      "Refactored legacy modules, reducing build time from [X] to [Y] minutes",
    ],
    skills: ["JavaScript", "TypeScript", "Python", "Java", "SQL", "REST APIs", "Git", "Docker", "AWS", "Unit testing"],
  },
  {
    title: "Frontend Developer",
    keywords: ["frontend", "front-end", "front end", "react", "web developer", "ui developer"],
    summaries: [
      "Frontend developer with [X] years of experience creating fast, accessible and responsive interfaces. Skilled in React and modern CSS, with a good eye for design detail.",
      "Developer who bridges design and engineering, turning mock-ups into polished, reusable components. Passionate about performance, accessibility and smooth user experiences.",
      "Web developer focused on building interfaces people enjoy using. Experienced with component libraries, state management and testing in production React apps.",
    ],
    bullets: [
      "Built a shared component library used across [number] products, speeding up delivery by [X]%",
      "Improved page load time by [X]% through code splitting, image optimisation and caching",
      "Raised accessibility to WCAG AA standard across the main customer journeys",
      "Rebuilt the checkout flow in React, lifting conversion by [X]%",
      "Worked closely with designers to create a consistent, responsive design system",
      "Added end-to-end tests that caught [number] regressions before release",
      "Converted [number] legacy pages to a modern framework with zero downtime",
      "Set up analytics events that helped the product team prioritise features",
    ],
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Accessibility", "Figma", "Jest"],
  },
  {
    title: "Data Analyst",
    keywords: ["data analyst", "analyst", "analytics", "bi", "business intelligence", "reporting"],
    summaries: [
      "Data analyst with [X] years of experience turning raw data into clear insights and dashboards that guide business decisions. Strong in SQL, Excel and visualisation tools.",
      "Analytical problem solver who enjoys finding the story in the numbers. Experienced in cleaning data, building reports and presenting findings to non-technical teams.",
      "Curious, detail-focused analyst who automates reporting and helps teams measure what matters.",
    ],
    bullets: [
      "Built [number] dashboards in [tool] used weekly by leadership to track KPIs",
      "Automated monthly reporting, saving the team [X] hours per month",
      "Analysed customer behaviour to find a churn driver, helping reduce churn by [X]%",
      "Cleaned and merged data from [number] sources into a single trusted dataset",
      "Ran A/B test analyses that informed [number] product decisions",
      "Presented findings to senior stakeholders in clear, visual summaries",
      "Wrote SQL queries and views that cut report run time by [X]%",
      "Defined key metrics and data definitions adopted across [number] teams",
    ],
    skills: ["SQL", "Excel", "Power BI", "Tableau", "Python", "Data cleaning", "Statistics", "A/B testing", "Data visualisation", "Google Analytics"],
  },
  {
    title: "Data Scientist",
    keywords: ["data scientist", "machine learning", "ml", "ai", "scientist"],
    summaries: [
      "Data scientist with [X] years of experience building predictive models that improve products and save costs. Comfortable taking projects from exploration to production.",
      "Machine learning practitioner who combines statistics, coding and business sense to solve real problems.",
      "Data scientist skilled in Python, experimentation and communicating results clearly to stakeholders.",
    ],
    bullets: [
      "Built a [type] model that improved [metric] by [X]% compared with the previous approach",
      "Deployed models to production with monitoring for data drift and accuracy",
      "Designed experiments that measured the impact of [feature] on revenue",
      "Created a recommendation system that increased engagement by [X]%",
      "Reduced fraud losses by [X]% with an anomaly detection pipeline",
      "Shared insights through notebooks and dashboards used by [number] teams",
      "Improved data pipelines, cutting model training time by [X]%",
      "Partnered with engineers to turn prototypes into reliable services",
    ],
    skills: ["Python", "Pandas", "scikit-learn", "SQL", "Machine learning", "Statistics", "TensorFlow", "Experiment design", "Data visualisation", "Spark"],
  },
  {
    title: "Product Manager",
    keywords: ["product manager", "product owner", "pm", "product"],
    summaries: [
      "Product manager with [X] years of experience leading cross-functional teams to ship products customers love. Data-informed, user-focused and clear in communication.",
      "Strategic product leader who turns customer problems into roadmaps, priorities and measurable outcomes.",
      "Product owner experienced in discovery, agile delivery and aligning stakeholders around a shared vision.",
    ],
    bullets: [
      "Led a team of [number] to launch [product], reaching [number] users in [X] months",
      "Defined the product roadmap and OKRs, growing revenue by [X]% year over year",
      "Ran [number] customer interviews to uncover needs that shaped the next release",
      "Prioritised the backlog using impact and effort, raising delivery speed by [X]%",
      "Improved onboarding, increasing activation rate from [X]% to [Y]%",
      "Aligned engineering, design, sales and support around quarterly goals",
      "Introduced product analytics to track feature adoption and retention",
      "Wrote clear requirements and user stories adopted as the team standard",
    ],
    skills: ["Product strategy", "Roadmapping", "User research", "Agile / Scrum", "Jira", "Analytics", "A/B testing", "Stakeholder management", "Prioritisation", "Wireframing"],
  },
  {
    title: "Project Manager",
    keywords: ["project manager", "project coordinator", "program manager", "pmp", "delivery"],
    summaries: [
      "Project manager with [X] years of experience delivering projects on time and within budget. Skilled at planning, risk management and keeping teams aligned.",
      "Organised, calm leader who brings structure to complex projects and clear communication to stakeholders.",
      "Certified project manager experienced with agile and waterfall delivery across [industry].",
    ],
    bullets: [
      "Delivered [number] projects worth [amount] on time and within budget",
      "Managed schedules, budgets and risks for teams of up to [number] people",
      "Introduced a project tracking process that cut delays by [X]%",
      "Coordinated vendors and internal teams across [number] locations",
      "Reported progress to senior stakeholders through weekly status updates",
      "Identified and resolved risks early, saving an estimated [amount]",
      "Ran sprint planning and retrospectives that improved team velocity by [X]%",
      "Created templates and playbooks now used across the department",
    ],
    skills: ["Project planning", "Risk management", "Budgeting", "Agile", "Scrum", "MS Project", "Jira", "Stakeholder communication", "Scheduling", "Vendor management"],
  },
  {
    title: "Graphic Designer",
    keywords: ["graphic designer", "designer", "visual designer", "brand designer", "illustrator"],
    summaries: [
      "Graphic designer with [X] years of experience creating brand identities, campaigns and print materials. Known for clear visual systems and close work with marketing teams.",
      "Creative designer who turns ideas into bold, memorable visuals across digital and print.",
      "Designer with a strong sense of typography, layout and colour, who delivers polished work on tight deadlines.",
    ],
    bullets: [
      "Designed brand identities for [number] clients, including logos, colour and type systems",
      "Created campaign visuals that lifted engagement by [X]%",
      "Built a shared design system that cut production time from [X] to [Y] days",
      "Produced print materials, packaging and signage for [number] events",
      "Worked with copywriters and marketers to deliver [number] campaigns a quarter",
      "Prepared print-ready files and managed relationships with printers",
      "Designed social media templates used by the marketing team every week",
      "Presented concepts to clients and refined them based on feedback",
    ],
    skills: ["Adobe Photoshop", "Adobe Illustrator", "InDesign", "Figma", "Typography", "Branding", "Layout design", "Print production", "Colour theory", "Social media design"],
  },
  {
    title: "UX/UI Designer",
    keywords: ["ux", "ui", "product designer", "interaction designer", "user experience"],
    summaries: [
      "UX/UI designer with [X] years of experience designing intuitive digital products. Combines user research, prototyping and visual design to solve real user problems.",
      "Product designer who cares about clarity, accessibility and measurable outcomes.",
      "Designer experienced in turning research insights into wireframes, prototypes and polished interfaces.",
    ],
    bullets: [
      "Redesigned the [feature] flow, improving task completion by [X]%",
      "Ran [number] usability tests and turned findings into design improvements",
      "Built and maintained a design system used by [number] designers and developers",
      "Created wireframes and interactive prototypes in Figma for [number] features",
      "Improved accessibility across the app to meet WCAG AA",
      "Worked with engineers to make sure designs shipped as intended",
      "Mapped user journeys that revealed [number] key pain points",
      "Raised app store rating from [X] to [Y] after a redesign",
    ],
    skills: ["Figma", "User research", "Wireframing", "Prototyping", "Usability testing", "Design systems", "Accessibility", "Information architecture", "Interaction design", "Visual design"],
  },
  {
    title: "Marketing Manager",
    keywords: ["marketing", "marketing manager", "brand manager", "growth"],
    summaries: [
      "Marketing manager with [X] years of experience planning campaigns that grow brand awareness and revenue. Data-driven, creative and comfortable leading teams.",
      "Results-focused marketer experienced across digital, content and brand, with a track record of hitting growth targets.",
      "Marketing leader who builds clear strategies, strong teams and campaigns customers remember.",
    ],
    bullets: [
      "Planned and launched [number] campaigns that grew revenue by [X]%",
      "Managed a marketing budget of [amount] and improved return on spend by [X]%",
      "Grew social media following from [X] to [Y] in [number] months",
      "Led a team of [number] marketers and agencies",
      "Launched [product] to market, reaching [number] customers in the first quarter",
      "Improved email open rates by [X]% through segmentation and testing",
      "Built marketing dashboards to track leads, conversion and cost per acquisition",
      "Developed brand guidelines adopted across all channels",
    ],
    skills: ["Marketing strategy", "Campaign management", "SEO", "Content marketing", "Email marketing", "Social media", "Google Ads", "Analytics", "Budget management", "Brand management"],
  },
  {
    title: "Sales Representative",
    keywords: ["sales", "account executive", "business development", "sales representative", "account manager"],
    summaries: [
      "Sales professional with [X] years of experience building relationships and closing deals. Consistently meets and exceeds targets.",
      "Persuasive, customer-focused seller who understands client needs and turns them into long-term partnerships.",
      "Account manager known for strong pipelines, clear communication and high customer retention.",
    ],
    bullets: [
      "Exceeded annual sales target by [X]%, generating [amount] in revenue",
      "Built a pipeline of [number] qualified leads through outreach and referrals",
      "Closed [number] new accounts, including [notable client]",
      "Raised customer retention to [X]% through regular check-ins and support",
      "Ranked in the top [X]% of the sales team for [number] quarters",
      "Gave product demos to [number] prospects a month",
      "Negotiated contracts worth up to [amount]",
      "Used CRM data to forecast sales with [X]% accuracy",
    ],
    skills: ["Prospecting", "Negotiation", "CRM (Salesforce, HubSpot)", "Account management", "Cold calling", "Presentations", "Pipeline management", "Closing", "Customer relationships", "Forecasting"],
  },
  {
    title: "Customer Service Representative",
    keywords: ["customer service", "customer support", "support", "call center", "call centre", "customer success"],
    summaries: [
      "Customer service professional with [X] years of experience resolving issues quickly and kindly. Patient, clear and focused on customer satisfaction.",
      "Friendly problem solver who turns unhappy customers into loyal ones.",
      "Support specialist experienced with phone, email and chat, known for high satisfaction scores.",
    ],
    bullets: [
      "Handled [number] customer queries a day with a [X]% satisfaction score",
      "Resolved [X]% of issues on the first contact",
      "Reduced average response time from [X] to [Y] hours",
      "Wrote help articles that cut repeat questions by [X]%",
      "Trained [number] new team members on tools and processes",
      "Escalated product issues with clear reports that helped fix recurring bugs",
      "Handled complaints calmly and turned them into positive outcomes",
      "Met or exceeded quality targets every month",
    ],
    skills: ["Customer support", "Communication", "Problem solving", "Zendesk", "CRM", "Active listening", "Conflict resolution", "Live chat", "Time management", "Product knowledge"],
  },
  {
    title: "Accountant",
    keywords: ["accountant", "accounting", "bookkeeper", "finance", "auditor", "tax"],
    summaries: [
      "Accountant with [X] years of experience in financial reporting, reconciliations and tax. Accurate, organised and comfortable working to deadlines.",
      "Detail-driven finance professional who keeps books clean and helps businesses understand their numbers.",
      "Qualified accountant experienced in month-end close, audits and process improvement.",
    ],
    bullets: [
      "Managed month-end close for [number] entities, finishing [X] days faster",
      "Prepared financial statements and reports for management and auditors",
      "Reconciled accounts with [X]% accuracy and resolved discrepancies",
      "Prepared tax returns and ensured compliance with local regulations",
      "Automated invoice processing, saving [X] hours per month",
      "Supported annual audits with no major findings",
      "Built budgets and forecasts used in quarterly planning",
      "Reduced overdue receivables by [X]% through better follow-up",
    ],
    skills: ["Financial reporting", "Reconciliations", "Tax preparation", "Excel", "QuickBooks", "Xero", "SAP", "Budgeting", "Audit", "Accounts payable / receivable"],
  },
  {
    title: "Human Resources Specialist",
    keywords: ["hr", "human resources", "recruiter", "talent", "people operations", "recruitment"],
    summaries: [
      "HR specialist with [X] years of experience in recruitment, onboarding and employee relations. People-focused, discreet and organised.",
      "Recruiter who finds great people quickly and gives every candidate a positive experience.",
      "People operations professional who builds fair processes and a strong workplace culture.",
    ],
    bullets: [
      "Hired [number] employees across [number] departments in [timeframe]",
      "Reduced time to hire from [X] to [Y] days",
      "Designed an onboarding programme that improved first-year retention by [X]%",
      "Handled employee relations cases fairly and in line with policy",
      "Ran engagement surveys and action plans that raised scores by [X]%",
      "Managed HR records and payroll inputs for [number] staff",
      "Updated policies to meet new employment regulations",
      "Organised training sessions attended by [number] employees",
    ],
    skills: ["Recruitment", "Onboarding", "Employee relations", "HR policies", "Interviewing", "Payroll", "HRIS", "Training", "Performance management", "Employment law"],
  },
  {
    title: "Teacher",
    keywords: ["teacher", "tutor", "educator", "lecturer", "instructor", "teaching"],
    summaries: [
      "Teacher with [X] years of experience creating engaging lessons that help every student make progress. Patient, organised and passionate about learning.",
      "Educator who builds supportive classrooms and uses data to tailor teaching to each learner.",
      "Dedicated teacher experienced with [subject] across [age group], known for strong results and positive relationships.",
    ],
    bullets: [
      "Taught [subject] to classes of up to [number] students",
      "Raised exam pass rates from [X]% to [Y]%",
      "Planned lessons that used group work, technology and hands-on activities",
      "Supported students with additional needs through tailored learning plans",
      "Led the [subject] department's curriculum review",
      "Organised [event/club] attended by [number] students",
      "Communicated progress to parents through regular reports and meetings",
      "Mentored [number] trainee teachers",
    ],
    skills: ["Lesson planning", "Classroom management", "Curriculum design", "Assessment", "Differentiation", "Google Classroom", "Communication", "Mentoring", "Student support", "Educational technology"],
  },
  {
    title: "Nurse",
    keywords: ["nurse", "nursing", "rn", "healthcare", "clinical", "care"],
    summaries: [
      "Registered nurse with [X] years of experience delivering safe, compassionate patient care in [setting]. Calm under pressure and a strong team player.",
      "Caring healthcare professional skilled in assessment, medication management and patient education.",
      "Nurse experienced in fast-paced wards, known for clear communication with patients, families and doctors.",
    ],
    bullets: [
      "Provided care for up to [number] patients per shift in a [type] unit",
      "Administered medication and treatments safely and accurately",
      "Monitored patients and escalated changes quickly to the medical team",
      "Educated patients and families on recovery and care at home",
      "Kept clear, accurate records in [system]",
      "Helped reduce patient falls on the ward by [X]%",
      "Trained new nurses and students on ward procedures",
      "Took part in audits that improved infection control",
    ],
    skills: ["Patient care", "Medication administration", "Patient assessment", "Electronic health records", "Infection control", "Wound care", "BLS / ALS", "Communication", "Teamwork", "Time management"],
  },
  {
    title: "Administrative Assistant",
    keywords: ["administrative", "admin", "assistant", "office", "receptionist", "secretary", "executive assistant"],
    summaries: [
      "Administrative assistant with [X] years of experience keeping offices running smoothly. Organised, reliable and quick to learn new systems.",
      "Proactive assistant who manages calendars, documents and communications so teams can focus on their work.",
      "Executive assistant known for discretion, attention to detail and excellent time management.",
    ],
    bullets: [
      "Managed calendars, travel and meetings for [number] managers",
      "Organised [number] events and meetings, from booking to follow-up",
      "Created a filing system that made documents faster to find",
      "Handled [number] calls and emails a day professionally",
      "Prepared reports, presentations and meeting minutes",
      "Ordered office supplies and cut costs by [X]%",
      "Welcomed visitors and kept the reception area organised",
      "Trained new staff on office procedures and tools",
    ],
    skills: ["Microsoft Office", "Google Workspace", "Calendar management", "Scheduling", "Data entry", "Customer service", "Organisation", "Communication", "Record keeping", "Event planning"],
  },
];

// Strong verbs to start bullet points with.
export const ACTION_VERBS = [
  "achieved", "analysed", "analyzed", "automated", "boosted", "built", "championed", "coached", "collaborated", "completed", "coordinated", "created",
  "cut", "decreased", "defined", "delivered", "designed", "developed", "directed", "drove", "enabled", "engineered", "established", "exceeded", "expanded",
  "generated", "grew", "guided", "handled", "helped", "hired", "identified", "implemented", "improved", "increased", "introduced", "launched", "led",
  "managed", "mentored", "migrated", "negotiated", "organised", "organized", "oversaw", "partnered", "planned", "prepared", "presented", "produced",
  "raised", "ran", "rebuilt", "reduced", "redesigned", "refactored", "resolved", "saved", "set", "shipped", "simplified", "spearheaded", "streamlined",
  "supported", "taught", "trained", "transformed", "wrote", "added", "ranked", "closed", "handled", "provided", "administered", "monitored", "educated",
  "kept", "took", "welcomed", "ordered", "assisted", "converted", "worked", "ran", "updated", "used", "gave", "prepared", "reconciled",
];

// Overused phrases that don't tell an employer much.
export const WEAK_PHRASES = [
  "hard worker", "hardworking", "hard-working", "team player", "go-getter", "think outside the box", "detail oriented person",
  "responsible for", "duties included", "worked on", "helped with", "synergy", "self-starter", "results-driven", "dynamic individual",
];

// Picks the role that best matches some text (usually the job title).
export function guessRole(text = "") {
  const t = text.toLowerCase();
  if (!t.trim()) return null;
  let best = null;
  let bestScore = 0;
  for (const r of ROLES) {
    const score = r.keywords.reduce((n, k) => (t.includes(k) ? n + k.length : n), 0) + (t.includes(r.title.toLowerCase()) ? 50 : 0);
    if (score > bestScore) {
      best = r;
      bestScore = score;
    }
  }
  return best;
}

// Paragraph ideas for cover letters. {role}, {company} and {name} are filled in from the letter.
export const LETTER_PARAGRAPHS = {
  Opening: [
    "I am excited to apply for the {role} position at {company}. With [X] years of experience in [field], I am confident I can make a strong contribution to your team.",
    "When I saw that {company} is looking for a {role}, I knew I had to apply. Your work on [project or value] is exactly the kind of work I want to be part of.",
    "I am writing to express my interest in the {role} role at {company}. My background in [field] and my passion for [topic] make me a great fit for this position.",
  ],
  Experience: [
    "In my current role at [company], I [main achievement], which [result with a number]. I also [second achievement], showing that I can deliver results quickly.",
    "Over the past [X] years I have developed strong skills in [skill], [skill] and [skill]. For example, I recently [specific project] that [measurable result].",
    "I enjoy working closely with colleagues across teams. At [company], I partnered with [team] to [goal], and we [result].",
  ],
  "Why this company": [
    "I admire how {company} [something specific about the company], and I would love to help you [goal the company has].",
    "{company}'s focus on [value or mission] matches what I care about most in my work, and I am excited by the chance to contribute to it.",
  ],
  Closing: [
    "Thank you for considering my application. I would welcome the chance to discuss how I can help {company} reach its goals.",
    "I would love to talk more about how my experience fits the {role} role. Thank you for your time, and I look forward to hearing from you.",
    "Thank you for reading my letter. I have attached my resume and am happy to share more examples of my work.",
  ],
};
