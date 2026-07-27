import { curriculumCatalog } from "@/lib/curriculum/catalog";
import { pythonDiagnosticQuestions } from "@/lib/diagnostics/questions";

export const syntaxia = {
  name: "Syntaxia",
  /** Brand-first hero wordmark lives on the homepage; this is the outcome line under it. */
  tagline: "The operating system for serious CS programs.",
  headline: "Place every student. Catch who is stuck. Run the next meeting.",
  description:
    "Syntaxia is software for schools, clubs, and after-school programs that teach computer science in leveled tracks, curriculum, diagnostics, code submissions, attendance, and instructor interventions in one place.",
  icp: "Built for chapter directors, instructors, and program leads, not another generic LMS.",
  emails: {
    founders: "founders@syntaxia.org",
    support: "support@syntaxia.org",
    sales: "sales@syntaxia.org",
    privacy: "privacy@syntaxia.org",
  },
  email: "sales@syntaxia.org",
  instagram: "theapsdsclub",
  instagramUrl: "https://www.instagram.com/theapsdsclub/",
};

export const apsds = {
  name: "APSDS",
  fullName: "Algorithmic Problem Solving and Data Structures",
  tagline: "Learn computer science the way it sticks.",
  mission:
    "APSDS is the flagship computer science program powered by Syntaxia, leveled tracks, weekly meetings, real projects, and competition support across Bay Area schools.",
  relationship:
    "APSDS is Syntaxia’s first customer: we operate the program ourselves, ship the product against our own weekly meetings, and expand chapter by chapter.",
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

/**
 * Only numbers we can verify from public chapter list / shipped product surface.
 * Framed as product readiness + wedge depth, not invented growth metrics.
 */
export const verifiedTraction = {
  updated: "July 2026",
  stage: "Early · dogfooding on our own program",
  items: [
    {
      label: "Named school chapters live",
      value: String(openChapters.length),
      detail: openChapters.map((c) => c.shortName).join(" · "),
    },
    {
      label: "Leveled curriculum tracks",
      value: "3",
      detail: "L1 Foundations · L2 Practical · L3 Advanced",
    },
    {
      label: "Materials in product catalog",
      value: String(curriculumCatalog.length),
      detail: "Lessons, tests, projects, competition prep",
    },
    {
      label: "Placement diagnostic items",
      value: String(pythonDiagnosticQuestions.length),
      detail: "Python foundations → track recommendation",
    },
  ],
  proofLine: `Live at ${openChapters.map((c) => c.shortName).join(", ")} · Built by operating APSDS ourselves`,
  honesty:
    "We do not publish estimated TAM, projected ARR, waitlist counts, or interest-only school lists as traction.",
} as const;

export const problemPoints = [
  {
    title: "Wrong level on day one",
    body: "Students get dumped into one room. Beginners stall; advanced kids coast.",
  },
  {
    title: "Work lives in Drive",
    body: "Curriculum, homework, and solutions scatter across folders no instructor can audit.",
  },
  {
    title: "Stuck students stay invisible",
    body: "Without submissions and misconception tags, the next meeting is guesswork.",
  },
] as const;

export const tracks = [
  {
    id: "l1",
    level: "L1",
    name: "Foundations",
    accent: "#b08d57",
    summary: "Python from the ground up: syntax, logic, and first algorithms.",
  },
  {
    id: "l2",
    level: "L2",
    name: "Practical",
    accent: "#7a8790",
    summary: "Projects that move: games, animation, and applied problem solving.",
  },
  {
    id: "l3",
    level: "L3",
    name: "Advanced",
    accent: "#d4af37",
    summary: "Data structures, contests, mentorship, and deeper builds.",
  },
] as const;

export const howItWorks = [
  {
    id: "diagnose",
    title: "Diagnose",
    body: "Students take a short programming diagnostic inside Syntaxia.",
    preview: "diagnostic",
  },
  {
    id: "place",
    title: "Place",
    body: "Each student lands on L1, L2, or L3 with a starting lesson and confidence.",
    preview: "placement",
  },
  {
    id: "learn",
    title: "Learn",
    body: "Structured materials, Monaco code workspace, in-browser run, and submit.",
    preview: "learn",
  },
  {
    id: "intervene",
    title: "Intervene",
    body: "Instructors see pending members, tagged misconceptions, and attendance gaps.",
    preview: "intervene",
  },
] as const;

export const productFeatures = [
  {
    title: "Student placement",
    body: "Diagnostic testing and automatic level recommendations with instructor override.",
    status: "live" as const,
  },
  {
    title: "Structured curriculum",
    body: "Lessons, homework, quizzes, projects, and competition preparation.",
    status: "live" as const,
  },
  {
    title: "Code submissions",
    body: "Students write in Monaco, run Python in a browser WASM sandbox, submit work, and get misconception tags.",
    status: "partial" as const,
    note: "Editor · Run · Grade · Submit live · remote multi-tenant jail still planned",
  },
  {
    title: "Deterministic autograding",
    body: "Hidden and visible test cases for Python Starter prompts; categories shown on visible failures only.",
    status: "partial" as const,
    note: "Live on python-starter-slides · expanding catalog",
  },
  {
    title: "Instructor ops",
    body: "Progress, attendance roster, misconception tags, and an intervention queue.",
    status: "live" as const,
  },
  {
    title: "Chapter operations",
    body: "Memberships, roles, cohorts, and curriculum visibility controls.",
    status: "partial" as const,
    note: "Memberships, roles & cohorts live · announcements expanding",
  },
  {
    title: "Socratic support",
    body: "Progressive hints from failed categories and misconception tags, never dumps a full solution.",
    status: "partial" as const,
    note: "Rule-based hints live · model-backed hints later",
  },
  {
    title: "Concept mastery",
    body: "Per-concept scores from diagnostics and graded submissions.",
    status: "live" as const,
  },
] as const;

export const founders = [
  {
    name: "Mittansh Bhatia",
    role: "Founder",
    bio: "Operates APSDS and is building Syntaxia from the same weekly ops pain: placement, curriculum, submissions, and chapter management.",
  },
] as const;

export const founderStory = {
  title: "We built the software we needed to run APSDS.",
  body: "As APSDS expanded across schools, we were manually placing students, distributing curriculum, reviewing assignments, tracking memberships, and juggling L1 / L2 / L3 in Drive and spreadsheets. Syntaxia is that stack, productized.",
  before: [
    "Drive folders per chapter",
    "Spreadsheets for placement",
    "Scattered assignment review",
    "Manual membership tracking",
  ],
  after: [
    "One instructor dashboard",
    "Diagnostic placement + override",
    "In-platform code submit",
    "Roles, cohorts, attendance",
  ],
} as const;

/**
 * Testimonials reserved until named quotes are approved in writing.
 * Do not invent attributed quotes for the marketing site.
 */
export const testimonials: {
  quote: string;
  role: string;
  organization: string;
}[] = [];

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
      "Curriculum catalog",
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
      "Diagnostics & placement",
      "Instructor dashboard",
      "Attendance & interventions",
      "Code submissions (browser run + grade)",
      "Email support",
      "Remote isolated runner, planned",
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
      "Organization analytics, expanding",
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
  { href: "/#how", label: "How it works" },
  { href: "/#traction", label: "Traction" },
  { href: "/pricing", label: "Pricing" },
  { href: "/apsds", label: "APSDS" },
] as const;

export const footerLinks = [
  { href: "/#product", label: "Product" },
  { href: "/demo", label: "Demo" },
  { href: "/pricing", label: "Pricing" },
  { href: "/start", label: "Start a pilot" },
  { href: "/apsds", label: "APSDS" },
  { href: "/privacy", label: "Privacy" },
  { href: "/student-privacy", label: "Student privacy" },
  { href: "/security", label: "Security" },
  { href: "/terms", label: "Terms" },
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
  {
    title: "Email founders",
    body: "Tell us your organization, estimated students, and launch window.",
  },
  {
    title: "Tour the product",
    body: "Walk the demo, then sign in to try placement and materials for real.",
  },
  {
    title: "Pilot one cohort",
    body: "Run diagnose → place → submit → intervene on a single group first.",
  },
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
