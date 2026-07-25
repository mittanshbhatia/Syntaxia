export const syntaxia = {
  name: "Syntaxia",
  tagline: "Where structure meets ambition.",
  description:
    "Syntaxia is the home for APSDS chapters, a growing network of school clubs teaching algorithmic thinking, projects, and competition prep.",
  email: "team.apsds@gmail.com",
  instagram: "theapsdsclub",
  instagramUrl: "https://www.instagram.com/theapsdsclub/",
};

export const apsds = {
  name: "APSDS",
  fullName: "Algorithmic Problem Solving and Data Structures",
  tagline: "Learn computer science the way it sticks.",
  mission:
    "APSDS is Syntaxia's flagship club: leveled tracks, weekly meetings, real projects, and free competition support, coming to schools in the Bay Area.",
  email: "team.apsds@gmail.com",
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

export const tracks = [
  {
    id: "l1",
    level: "L1",
    name: "Foundations",
    accent: "#1f2bd5",
    summary: "Python from the ground up: syntax, logic, and first algorithms.",
  },
  {
    id: "l2",
    level: "L2",
    name: "Practical",
    accent: "#1f2bd5",
    summary: "Projects that move: games, animation, and applied problem solving.",
  },
  {
    id: "l3",
    level: "L3",
    name: "Advanced",
    accent: "#1f2bd5",
    summary: "Data structures, contests, mentorship, and deeper builds.",
  },
] as const;

export const pillars = [
  {
    title: "Teach for real",
    body: "Weekly meetings, practice, and projects, not hangouts dressed up as clubs.",
  },
  {
    title: "Grow by level",
    body: "Students place into L1, L2, or L3 and advance instead of restarting every year.",
  },
  {
    title: "Compete with support",
    body: "ACSL prep and APCSA workshops, with chapters covering contest fees.",
  },
  {
    title: "Scale to new schools",
    body: "Shared standards so new chapters can launch without rebuilding everything.",
  },
] as const;

export const joinSteps = [
  { title: "Find your chapter", body: "See open locations and reach out to the team." },
  { title: "Get placed", body: "A short diagnostic points you to the right track." },
  { title: "Show up weekly", body: "Focused sessions, projects, and competitions." },
] as const;

export const startSteps = [
  { title: "Tell us your school", body: "Share your campus, team, and launch window." },
  { title: "Receive the playbook", body: "Curriculum, diagnostics, ACSL, and workshop structure." },
  { title: "Launch locally", body: "Recruit instructors, run interest meetings, place students." },
] as const;

export const dashboardSections = [
  "Online tests",
  "Quizzes",
  "Homework",
  "Assignments",
  "Teaching materials",
  "Grades",
  "Chapter directory",
] as const;
