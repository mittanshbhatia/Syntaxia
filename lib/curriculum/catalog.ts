export type MaterialSection =
  | "course_plans"
  | "teaching_materials"
  | "online_tests"
  | "quizzes"
  | "homework"
  | "assignments"
  | "competition_prep"
  | "grades"
  | "chapter_directory"
  | "club_resources";

export type MaterialTrack = "l1" | "l2" | "l3" | "all";

export type CurriculumMaterial = {
  id: string;
  title: string;
  section: MaterialSection;
  track: MaterialTrack;
  summary: string;
  /** When false, default hidden from members until staff enables it. */
  defaultVisible: boolean;
  staffOnly?: boolean;
  assetUrl?: string;
  bodyKey?: string;
};

export const SECTION_META: Record<
  MaterialSection,
  { label: string; description: string }
> = {
  course_plans: {
    label: "Course plans",
    description: "Week-by-week plans for each track.",
  },
  teaching_materials: {
    label: "Teaching materials",
    description: "Lessons, code, worksheets, and practice on Syntaxia.",
  },
  online_tests: {
    label: "Online tests",
    description: "Foundations and cumulative assessments you complete here.",
  },
  quizzes: {
    label: "Quizzes",
    description: "Short checks and pop quizzes completed on Syntaxia.",
  },
  homework: {
    label: "Homework",
    description: "Practice you submit between meetings.",
  },
  assignments: {
    label: "Assignments",
    description: "Projects you build and submit on Syntaxia.",
  },
  competition_prep: {
    label: "Competition prep",
    description: "ACSL and APCSA workshop materials.",
  },
  grades: {
    label: "Grades",
    description: "Scores and progress for your chapter.",
  },
  chapter_directory: {
    label: "Chapter directory",
    description: "People and campus info for your chapter.",
  },
  club_resources: {
    label: "Club resources",
    description: "Posters, flyers, and club overview docs.",
  },
};

export const SECTION_KEYS = Object.keys(SECTION_META) as MaterialSection[];

export const curriculumCatalog: CurriculumMaterial[] = [
  {
    id: "l1-course-plan",
    title: "L1 Course Plan · Python Foundations",
    section: "course_plans",
    track: "l1",
    summary: "29-session plan covering Python starter, number bases, ACSL, and sorting.",
    defaultVisible: true,
    bodyKey: "l1-course-plan",
  },
  {
    id: "l2-course-plan",
    title: "L2 Course Plan · Practical Programming",
    section: "course_plans",
    track: "l2",
    summary: "29-session plan: Python review, PyGame projects, Pong, Snake, and ACSL.",
    defaultVisible: true,
    bodyKey: "l2-course-plan",
  },
  {
    id: "l3-course-plan",
    title: "L3 Course Plan · Advanced",
    section: "course_plans",
    track: "l3",
    summary: "Advanced track outline for data structures, contests, and mentorship.",
    defaultVisible: true,
    bodyKey: "l3-course-plan",
  },
  {
    id: "python-starter-slides",
    title: "APSDS Python Starter",
    section: "teaching_materials",
    track: "l1",
    summary: "Full intro-to-Python lesson with practice you complete on Syntaxia.",
    defaultVisible: true,
  },
  {
    id: "l2-teaching-pack",
    title: "L2 Teaching Materials",
    section: "teaching_materials",
    track: "l2",
    summary: "PyGame lessons, events, and OOP animation practice on Syntaxia.",
    defaultVisible: true,
  },
  {
    id: "search-sort-code",
    title: "Search & sort algorithms",
    section: "teaching_materials",
    track: "l2",
    summary: "Reference code and practice for search and sort algorithms.",
    defaultVisible: true,
  },
  {
    id: "big-o-worksheet",
    title: "Big-O / time complexity worksheet",
    section: "teaching_materials",
    track: "l1",
    summary: "Learn Big-O and submit complexity answers on Syntaxia.",
    defaultVisible: true,
  },
  {
    id: "acsl-worksheets",
    title: "ACSL worksheets",
    section: "competition_prep",
    track: "all",
    summary: "ACSL practice problems you complete here.",
    defaultVisible: true,
  },
  {
    id: "apcsa-prep-guide",
    title: "APCSA Prep workshop guide",
    section: "competition_prep",
    track: "all",
    summary: "Workshop sessions and reflection prompts on Syntaxia.",
    defaultVisible: true,
    bodyKey: "apcsa-prep-guide",
  },
  {
    id: "python-foundations-test-1",
    title: "26-27 Python Foundations Test 1",
    section: "online_tests",
    track: "l1",
    summary: "Take Test 1 entirely on Syntaxia when staff unhide it.",
    defaultVisible: false,
  },
  {
    id: "python-foundations-test-2",
    title: "26-27 Python Foundations Test 2",
    section: "online_tests",
    track: "l1",
    summary: "Take Test 2 entirely on Syntaxia when staff unhide it.",
    defaultVisible: false,
  },
  {
    id: "ultimate-cumulative-test",
    title: "Ultimate Cumulative Python Foundations Test",
    section: "online_tests",
    track: "l2",
    summary: "Cumulative assessment completed on Syntaxia.",
    defaultVisible: false,
  },
  {
    id: "pop-quiz-slot",
    title: "Pop quiz",
    section: "quizzes",
    track: "all",
    summary: "Live pop quiz completed on Syntaxia when staff unhide it.",
    defaultVisible: false,
  },
  {
    id: "weekly-practice",
    title: "Weekly practice set",
    section: "homework",
    track: "all",
    summary: "Between-meeting practice submitted on Syntaxia.",
    defaultVisible: true,
  },
  {
    id: "pygame-basic-exercises",
    title: "PyGame basic exercises",
    section: "assignments",
    track: "l2",
    summary: "Shapes and drawing lab submitted on Syntaxia.",
    defaultVisible: true,
  },
  {
    id: "stars-project",
    title: "Stars animation project",
    section: "assignments",
    track: "l2",
    summary: "First OOP animation project submitted on Syntaxia.",
    defaultVisible: true,
  },
  {
    id: "ball-game-project",
    title: "Ball Game project",
    section: "assignments",
    track: "l2",
    summary: "Paddle collection game submitted on Syntaxia.",
    defaultVisible: true,
  },
  {
    id: "tic-tac-toe-project",
    title: "Tic-Tac-Toe project",
    section: "assignments",
    track: "l2",
    summary: "Board-game logic project submitted on Syntaxia.",
    defaultVisible: true,
  },
  {
    id: "pong-project",
    title: "Pong project",
    section: "assignments",
    track: "l2",
    summary: "Classic Pong build submitted on Syntaxia.",
    defaultVisible: true,
  },
  {
    id: "snake-project",
    title: "Snake project",
    section: "assignments",
    track: "l2",
    summary: "Snake with list append/pop submitted on Syntaxia.",
    defaultVisible: true,
  },
  {
    id: "games-menu-project",
    title: "Games menu project",
    section: "assignments",
    track: "l2",
    summary: "Menu-driven games program submitted on Syntaxia.",
    defaultVisible: true,
  },
  {
    id: "grades-overview",
    title: "Grades overview",
    section: "grades",
    track: "all",
    summary: "Your chapter progress notes on Syntaxia.",
    defaultVisible: false,
  },
  {
    id: "chapter-directory",
    title: "Chapter directory",
    section: "chapter_directory",
    track: "all",
    summary: "Campus contacts and chapter notes on Syntaxia.",
    defaultVisible: true,
  },
  {
    id: "club-description",
    title: "APSDS club description",
    section: "club_resources",
    track: "all",
    summary: "Full and short club descriptions for 2026-27.",
    defaultVisible: true,
    bodyKey: "club-description",
  },
  {
    id: "flyer-v1",
    title: "Recruiting flyer v1",
    section: "club_resources",
    track: "all",
    summary: "APSDS flyer displayed on Syntaxia.",
    defaultVisible: true,
    assetUrl: "/posters/flyer-v1.png",
  },
  {
    id: "flyer-v2",
    title: "Recruiting flyer v2",
    section: "club_resources",
    track: "all",
    summary: "Alternate APSDS flyer displayed on Syntaxia.",
    defaultVisible: true,
    assetUrl: "/posters/flyer-v2.png",
  },
  {
    id: "club-fest-poster",
    title: "Club Fest poster",
    section: "club_resources",
    track: "all",
    summary: "Back-to-school festival poster on Syntaxia.",
    defaultVisible: true,
    assetUrl: "/posters/flyer-v2.png",
  },
];

export function getMaterial(id: string) {
  return curriculumCatalog.find((m) => m.id === id) ?? null;
}

export function materialsForSection(section: MaterialSection) {
  return curriculumCatalog.filter((m) => m.section === section && !m.staffOnly);
}
