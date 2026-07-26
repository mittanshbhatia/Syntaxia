export const syntaxia = {
  name: "Syntaxia",
  tagline: "Run a serious computer science program without building everything yourself.",
  description:
    "Syntaxia helps schools, clubs, and after-school programs run structured computer science education with curriculum, code submissions, student placement, and instructor analytics.",
  emails: {
    founders: "founders@syntaxia.org",
    support: "support@syntaxia.org",
    sales: "sales@syntaxia.org",
    privacy: "privacy@syntaxia.org",
  },
  /** Primary public contact for sales/pilots */
  email: "sales@syntaxia.org",
  instagram: "theapsdsclub",
  instagramUrl: "https://www.instagram.com/theapsdsclub/",
};

export const apsds = {
  name: "APSDS",
  fullName: "Algorithmic Problem Solving and Data Structures",
  tagline: "Learn computer science the way it sticks.",
  mission:
    "APSDS is the flagship computer science program powered by Syntaxia — leveled tracks, weekly meetings, real projects, and competition support across Bay Area schools.",
  relationship:
    "APSDS is Syntaxia's first deployment, testing ground, and distribution network — proof that the founders understand the problem.",
  email: "support@syntaxia.org",
  chapterEmail: "team.apsds@gmail.com",
  instagram: "theapsdsclub",
  instagramUrl: "https://www.instagram.com/theapsdsclub/",
  video: {
    src: "/media/apsds-hype-2026.mp4",
    label: "APSDS 2026-27 film",
  },
};

/** Marketing copy for chapters; live chapter access uses Supabase `chapters`. */
export const chapters = [
  {
    id: "bisv",
    slug: "bisv",
    name: "BASIS Independent Silicon Valley",
    shortName: "BISV",
    region: "Bay Area, CA",
    status: "open" as const,
    blurb:
      "The founding school of APSDS and the executive capital campus. Weekly after-school sessions across L1, L2, and L3.",
    logo: "/brand/BISV_APSDS_Logo.JPG",
    founding: true,
  },
  {
    id: "lynbrook",
    slug: "lynbrook",
    name: "Lynbrook High School",
    shortName: "Lynbrook",
    region: "San Jose, CA",
    status: "open" as const,
    blurb: "APSDS chapter at Lynbrook High School.",
    logo: "/brand/schools/lynbrook.svg",
    founding: false,
  },
  {
    id: "harker",
    slug: "harker",
    name: "The Harker School",
    shortName: "Harker",
    region: "San Jose, CA",
    status: "open" as const,
    blurb: "APSDS chapter at The Harker School.",
    logo: "/brand/schools/harker.svg",
    founding: false,
  },
] as const;

export type Chapter = (typeof chapters)[number];

export const openChapters = chapters.filter((c) => c.status === "open");

export function getMarketingChapter(slug: string) {
  return chapters.find((c) => c.slug === slug) ?? null;
}

/** Only numbers we can verify from the public chapter list / product surface. */
export const verifiedTraction = {
  updated: "July 2026",
  items: [
    { label: "Active school chapters", value: String(openChapters.length) },
    { label: "Curriculum tracks", value: "3" },
    { label: "Paying customers outside APSDS", value: "0" },
  ],
  proofLine: `Used across ${openChapters.length} school chapters · Built from operating APSDS ourselves`,
} as const;

export const tracks = [
  {
    id: "l1",
    level: "L1",
    name: "Foundations",
    accent: "#c4a574",
    summary: "Python from the ground up: syntax, logic, and first algorithms.",
  },
  {
    id: "l2",
    level: "L2",
    name: "Practical",
    accent: "#b8bcc4",
    summary: "Projects that move: games, animation, and applied problem solving.",
  },
  {
    id: "l3",
    level: "L3",
    name: "Advanced",
    accent: "#f0c44d",
    summary: "Data structures, contests, mentorship, and deeper builds.",
  },
] as const;

export const howItWorks = [
  {
    id: "diagnose",
    title: "Diagnose",
    body: "Students complete a short programming diagnostic.",
    preview: "diagnostic",
  },
  {
    id: "place",
    title: "Place",
    body: "Syntaxia assigns each student to the correct track and starting point.",
    preview: "placement",
  },
  {
    id: "learn",
    title: "Learn",
    body: "Students complete structured lessons and submit code inside Syntaxia.",
    preview: "learn",
  },
  {
    id: "intervene",
    title: "Intervene",
    body: "Instructors see who is stuck, why they are stuck, and what to do next.",
    preview: "intervene",
  },
] as const;

export const productFeatures = [
  {
    title: "Student placement",
    body: "Diagnostic testing and automatic level recommendations.",
    status: "live" as const,
  },
  {
    title: "Structured curriculum",
    body: "Lessons, homework, quizzes, projects, and competition preparation.",
    status: "live" as const,
  },
  {
    title: "Code submissions",
    body: "Students submit and eventually execute code directly inside Syntaxia.",
    status: "partial" as const,
    note: "Text submission live · in-browser run & autograding coming soon",
  },
  {
    title: "Instructor dashboard",
    body: "Progress, attendance, misconceptions, and intervention alerts.",
    status: "partial" as const,
    note: "Progress & materials live · attendance & intervention queue coming soon",
  },
  {
    title: "Chapter operations",
    body: "Memberships, roles, cohorts, announcements, and curriculum visibility.",
    status: "partial" as const,
    note: "Memberships & roles live · cohorts coming soon",
  },
  {
    title: "Socratic support",
    body: "Hints that help students debug instead of immediately showing answers.",
    status: "soon" as const,
    note: "Coming soon",
  },
] as const;

export const founderStory = {
  title: "Built from real experience",
  body: "We built Syntaxia after operating APSDS across multiple schools. As the program expanded, we were manually placing students, distributing curriculum, reviewing assignments, tracking chapter memberships, and managing different student levels. Syntaxia is the software we needed ourselves.",
  before: [
    "Drive folders per chapter",
    "Spreadsheets for placement",
    "Scattered assignment review",
    "Manual membership tracking",
  ],
  after: [
    "One instructor dashboard",
    "Diagnostic placement",
    "In-platform submissions",
    "Roles, chapters, and materials",
  ],
} as const;

/**
 * Testimonials use roles/orgs only until named quotes are approved in writing.
 * Do not invent full names claiming permission.
 */
export const testimonials = [
  {
    quote:
      "Before Syntaxia, we tracked curriculum and submissions across four different tools. Our chapter now manages materials and membership from one place.",
    role: "Chapter director",
    organization: "APSDS · Bay Area chapter",
  },
  {
    quote:
      "Placement into L1–L3 stopped us from restarting every beginner every year. Students finally move forward instead of looping.",
    role: "Instructor",
    organization: "APSDS network",
  },
  {
    quote:
      "I always know which lesson I am on and what to submit next. It feels like a real class, not a club Discord.",
    role: "Student",
    organization: "APSDS · L1 Foundations",
  },
] as const;

export const pricingPlans = [
  {
    id: "community",
    name: "Community",
    price: "Free",
    cadence: "",
    blurb: "For approved student-led and nonprofit chapters.",
    cta: "Apply for Community",
    href: "/start",
    featured: false,
    features: [
      "One chapter",
      "Basic curriculum",
      "Membership management",
      "Limited assignments",
    ],
  },
  {
    id: "program",
    name: "Program",
    price: "$199",
    cadence: "/month",
    blurb: "For tutoring centers and after-school programs.",
    cta: "Start a pilot",
    href: "mailto:sales@syntaxia.org?subject=Syntaxia%20Program%20plan",
    featured: true,
    features: [
      "Up to 100 students",
      "Diagnostics",
      "Autograding",
      "Instructor dashboard",
      "Progress reports",
      "Email support",
    ],
  },
  {
    id: "school",
    name: "School",
    price: "From $3,000",
    cadence: "/year",
    blurb: "For schools and larger organizations.",
    cta: "Talk to founders",
    href: "mailto:sales@syntaxia.org?subject=Syntaxia%20School%20plan",
    featured: false,
    features: [
      "Multiple cohorts",
      "Administrator controls",
      "Instructor onboarding",
      "School data agreement",
      "Priority support",
      "Organization analytics",
    ],
  },
  {
    id: "founding",
    name: "Founding pilot",
    price: "$750",
    cadence: "/semester",
    blurb: "For the first five outside programs.",
    cta: "Claim a founding seat",
    href: "mailto:founders@syntaxia.org?subject=Syntaxia%20Founding%20pilot",
    featured: false,
    features: [
      "Setup help",
      "One curriculum track",
      "Founder support",
      "Product feedback meetings",
      "Discounted renewal",
    ],
  },
] as const;

export const navLinks = [
  { href: "/#product", label: "Product" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/#results", label: "Results" },
  { href: "/pricing", label: "Pricing" },
  { href: "/apsds", label: "APSDS" },
] as const;

export const footerLinks = [
  { href: "/#product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Demo" },
  { href: "/apsds", label: "APSDS" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/security", label: "Security" },
  { href: "/contact", label: "Contact" },
  { href: "/auth/sign-in", label: "Sign in" },
] as const;

export const pillars = [
  {
    title: "Teach for real",
    body: "Weekly meetings, practice, and projects",
  },
  {
    title: "Grow by level",
    body: "Students place into L1, L2, or L3 and advance every year",
  },
  {
    title: "Compete with support",
    body: "ACSL prep and APCSA workshops, with chapters covering contest fees.",
  },
  {
    title: "Scale to new schools",
    body: "Shared standards allow for efficient expansion of APSDS",
  },
] as const;

export const joinSteps = [
  { title: "Find your chapter", body: "See open locations and reach out to the team." },
  { title: "Get placed", body: "A short diagnostic points you to the right track." },
  { title: "Show up weekly", body: "Focused sessions, projects, and competitions." },
] as const;

export const startSteps = [
  { title: "Tell us your school" },
  { title: "Receive the playbook" },
  { title: "Launch locally" },
] as const;

export const dashboardSections = [
  "Course plans",
  "Teaching materials",
  "Online tests",
  "Quizzes",
  "Homework",
  "Assignments",
  "Competition prep",
  "Grades",
  "Chapter directory",
  "Club resources",
] as const;
