/** Public demo credentials for YC / investor walkthroughs. Not secret. */
export const DEMO_PASSWORD = "DemoYC2026!";

export const demoAccounts = {
  student: {
    role: "student" as const,
    email: "demo.student@syntaxia.org",
    displayName: "Demo Student",
    password: DEMO_PASSWORD,
    next: "/dashboard/materials/python-starter-slides",
    blurb: "Approved BISV member. Placement, curriculum, Monaco Run/Grade/Hint/Submit.",
  },
  director: {
    role: "director" as const,
    email: "demo.director@syntaxia.org",
    displayName: "Demo Director",
    password: DEMO_PASSWORD,
    next: "/dashboard/program",
    blurb: "Chapter director + executive. Approve members, cohorts, attendance, interventions, admin.",
  },
  pending: {
    role: "pending" as const,
    email: "demo.pending@syntaxia.org",
    displayName: "Demo Pending Student",
    password: DEMO_PASSWORD,
    next: "/members/bisv",
    blurb: "Pending membership so directors can practice approve/reject in Admin.",
  },
} as const;

export type DemoRole = keyof typeof demoAccounts;

export const demoFeatures = [
  {
    id: "auth",
    title: "Auth & roles",
    status: "live" as const,
    detail: "Email/password + Google. Member, instructor, director, executive.",
    href: "/auth/sign-in",
  },
  {
    id: "chapters",
    title: "Chapter memberships",
    status: "live" as const,
    detail: "Request access, pending queue, approve/reject, track assignment.",
    href: "/members",
  },
  {
    id: "placement",
    title: "Diagnostic placement",
    status: "live" as const,
    detail: "18-question Python diagnostic → L1 / L2 / L3 with instructor override.",
    href: "/dashboard/program",
  },
  {
    id: "curriculum",
    title: "Curriculum catalog",
    status: "live" as const,
    detail: "Leveled materials, visibility controls, in-product lesson workspace.",
    href: "/dashboard",
  },
  {
    id: "code",
    title: "Code workspace",
    status: "live" as const,
    detail: "Monaco editor, Pyodide run, deterministic autograder, submit + tags.",
    href: "/dashboard/materials/python-starter-slides",
  },
  {
    id: "ai",
    title: "AI coach hints",
    status: "live" as const,
    detail: "Socratic hints from grade failures + misconception tags; LLM when OPENAI_API_KEY is set.",
    href: "/dashboard/materials/python-starter-slides",
  },
  {
    id: "mastery",
    title: "Concept mastery",
    status: "live" as const,
    detail: "Per-concept scores from diagnostics and graded submissions.",
    href: "/dashboard/program",
  },
  {
    id: "interventions",
    title: "Intervention queue",
    status: "live" as const,
    detail: "Pending members, misconception tags, inactive submitters.",
    href: "/dashboard/program",
  },
  {
    id: "attendance",
    title: "Cohorts & attendance",
    status: "live" as const,
    detail: "Create cohorts, meeting roster, mark present/absent/late.",
    href: "/dashboard/program",
  },
  {
    id: "admin",
    title: "Control management",
    status: "live" as const,
    detail: "Staff roles, curriculum visibility, membership review.",
    href: "/admin",
  },
] as const;

export const demoWalkthrough = [
  {
    step: "01",
    title: "Enter as student",
    body: "Open Python Starter. Write code, Run, Grade, ask for an AI Hint, then Submit.",
  },
  {
    step: "02",
    title: "Take placement",
    body: "On Program tools, run the diagnostic and land on L1 / L2 / L3.",
  },
  {
    step: "03",
    title: "Enter as director",
    body: "Approve the pending demo member, open the intervention queue, create a cohort, take attendance.",
  },
  {
    step: "04",
    title: "Control panel",
    body: "In Admin, toggle material visibility and assign staff roles.",
  },
] as const;
