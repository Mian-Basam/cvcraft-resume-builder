// Section keys in their default order. The editor lets people drag to reorder and hide them.
export const DEFAULT_SECTION_ORDER = [
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
  "languages",
  "certifications",
  "interests",
];

// Shape of a resume with nothing filled in; saved data is merged over this.
export const emptyResume = {
  personal: { name: "", title: "", photo: "", email: "", phone: "", address: "", website: "", summary: "" },
  experience: [],
  education: [],
  projects: [],
  skills: [],
  languages: [],
  certifications: [],
  interests: [],
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
};

// Example content shown until the user types their own.
export const sampleResume = {
  personal: {
    name: "Jordan Ellis",
    title: "Graphic Designer",
    photo: "",
    email: "jordan.ellis@email.com",
    phone: "+1 555 014 2299",
    address: "Austin, TX",
    website: "jordanellis.design",
    summary:
      "Graphic designer with 6+ years of experience creating brand identities, digital campaigns and print collateral. Known for clear visual systems and close work with marketing teams.",
  },
  experience: [
    {
      id: "e1",
      role: "Senior Graphic Designer",
      company: "Northwind Studio",
      location: "Austin, TX",
      start: "2021",
      end: "Present",
      bullets:
        "Led rebrands for 12 clients, lifting average engagement by 30%\nBuilt a shared design system used by a team of 8 designers",
    },
    {
      id: "e2",
      role: "Graphic Designer",
      company: "Bluepeak Agency",
      location: "Dallas, TX",
      start: "2018",
      end: "2021",
      bullets:
        "Designed social and print campaigns for retail and hospitality brands\nCut production time from 5 days to 3 with reusable layouts",
    },
  ],
  education: [
    {
      id: "ed1",
      degree: "BFA, Graphic Design",
      school: "University of Texas",
      start: "2014",
      end: "2018",
      grade: "GPA 3.7",
    },
  ],
  projects: [
    {
      id: "p1",
      name: "City Arts Festival Identity",
      link: "jordanellis.design/festival",
      description: "Logo, poster series and wayfinding for a festival with 40,000 visitors",
    },
  ],
  skills: [
    { id: "s1", name: "Brand Identity", level: 90 },
    { id: "s2", name: "Typography", level: 85 },
    { id: "s3", name: "Adobe Creative Suite", level: 95 },
    { id: "s4", name: "Figma", level: 80 },
    { id: "s5", name: "Art Direction", level: 75 },
  ],
  languages: [
    { id: "l1", name: "English", level: 100 },
    { id: "l2", name: "Spanish", level: 70 },
  ],
  certifications: [{ id: "c1", name: "Adobe Certified Professional", issuer: "Adobe", year: "2022" }],
  interests: [
    { id: "i1", name: "Photography" },
    { id: "i2", name: "Travel" },
    { id: "i3", name: "Music" },
  ],
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
};
