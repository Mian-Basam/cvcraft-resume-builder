// Shape of a cover letter, and example content shown until the user writes their own.
export const emptyCover = {
  personal: { name: "", title: "", photo: "", email: "", phone: "", address: "", website: "" },
  recipient: { name: "", title: "", company: "", address: "" },
  date: "",
  subject: "",
  greeting: "",
  body: "",
  closing: "",
};

export const sampleCover = {
  personal: {
    name: "Jordan Ellis",
    title: "Graphic Designer",
    photo: "",
    email: "jordan.ellis@email.com",
    phone: "+1 555 014 2299",
    address: "Austin, TX",
    website: "jordanellis.design",
  },
  recipient: { name: "Alex Morgan", title: "Creative Director", company: "Brightline Media", address: "Austin, TX" },
  date: "",
  subject: "Application for Senior Graphic Designer",
  greeting: "Dear Alex Morgan,",
  body: [
    "I am excited to apply for the Senior Graphic Designer role at Brightline Media. For the past six years I have created brand identities, campaigns and print work for clients ranging from local start-ups to national retailers, and I would love to bring that experience to your team.",
    "At Northwind Studio I led rebrands for 12 clients, lifting their average engagement by 30%, and built a shared design system that cut production time from five days to three. I enjoy working closely with marketing teams, turning loose briefs into clear visual systems that are easy to roll out.",
    "Brightline's recent work for the city arts festival is exactly the kind of bold, purposeful design I want to make more of. I would welcome the chance to talk about how I could help your studio deliver its next projects.",
    "Thank you for your time and consideration.",
  ].join("\n\n"),
  closing: "Kind regards,",
};

// "24 November 2026" style date used when the letter has no date typed in.
export function todayLong() {
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
