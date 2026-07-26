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
  /** Staff-only items never appear for regular members. */
  staffOnly?: boolean;
  driveUrl?: string;
  assetUrl?: string;
  /** Key into materialBodies for in-app text. */
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
    description: "Slides, code, worksheets, and lesson packs.",
  },
  online_tests: {
    label: "Online tests",
    description: "Foundations and cumulative assessments.",
  },
  quizzes: {
    label: "Quizzes",
    description: "Short checks and pop quizzes.",
  },
  homework: {
    label: "Homework",
    description: "Practice assigned between meetings.",
  },
  assignments: {
    label: "Assignments",
    description: "Projects and longer builds.",
  },
  competition_prep: {
    label: "Competition prep",
    description: "ACSL and APCSA workshop materials.",
  },
  grades: {
    label: "Grades",
    description: "Scores and progress tracking.",
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

export const APSDS_DRIVE_ROOT =
  "https://drive.google.com/drive/folders/1G8omn-GHP75fWAZeRL7_7tFjrgjkaRzF?usp=sharing";

export const curriculumCatalog: CurriculumMaterial[] = [
  {
    id: "l1-course-plan",
    title: "L1 Course Plan · Python Foundations",
    section: "course_plans",
    track: "l1",
    summary: "29-session plan covering Python starter, number bases, ACSL, and sorting.",
    defaultVisible: true,
    driveUrl:
      "https://docs.google.com/document/d/1tvZrKBhOokBGSzYaczEzjwc3cNINgPPcdO3XgQg9buk/edit",
    bodyKey: "l1-course-plan",
  },
  {
    id: "l2-course-plan",
    title: "L2 Course Plan · Practical Programming",
    section: "course_plans",
    track: "l2",
    summary: "29-session plan: Python review, PyGame projects, Pong, Snake, and ACSL.",
    defaultVisible: true,
    driveUrl:
      "https://docs.google.com/document/d/1sBn1XvFHSNR2qTkeOwTUbn8woBu_yCUF7CIo2R5ijHU/edit",
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
    title: "APSDS Python Starter slides",
    section: "teaching_materials",
    track: "l1",
    summary: "Core intro-to-Python slide deck used across early L1 and L2 meetings.",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "l2-teaching-pack",
    title: "L2 Teaching Materials pack",
    section: "teaching_materials",
    track: "l2",
    summary: "PyGame exercises, Meeting 10 videos, mouse/button labs, Pong and Snake assets.",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "search-sort-code",
    title: "Search & sort algorithm code",
    section: "teaching_materials",
    track: "l2",
    summary: "Binary, bubble, insertion, linear, and selection sort reference code.",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "big-o-worksheet",
    title: "Big-O / time complexity worksheet",
    section: "teaching_materials",
    track: "l1",
    summary: "How to do time complexity worksheet used in late L1 sessions.",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "acsl-worksheets",
    title: "ACSL worksheets",
    section: "competition_prep",
    track: "all",
    summary: "Contest practice worksheets and CWLesson materials for ACSL prep.",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "apcsa-prep-guide",
    title: "APCSA Prep workshop guide",
    section: "competition_prep",
    track: "all",
    summary: "Seven workshop sessions plus March and May review days.",
    defaultVisible: true,
    driveUrl:
      "https://docs.google.com/document/d/1FBNrruw-_RQ9nj_Pxcu1lILmzgRRpmej3Gw4w9765hM/edit",
    bodyKey: "apcsa-prep-guide",
  },
  {
    id: "python-foundations-test-1",
    title: "26-27 Python Foundations Test 1",
    section: "online_tests",
    track: "l1",
    summary: "First foundations assessment (around late October).",
    defaultVisible: false,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "python-foundations-test-2",
    title: "26-27 Python Foundations Test 2",
    section: "online_tests",
    track: "l1",
    summary: "Second foundations assessment (around February).",
    defaultVisible: false,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "ultimate-cumulative-test",
    title: "Ultimate Cumulative Python Foundations Test",
    section: "online_tests",
    track: "l2",
    summary: "Cumulative placement-style test used early in L2.",
    defaultVisible: false,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "pop-quiz-slot",
    title: "Pop quiz",
    section: "quizzes",
    track: "all",
    summary: "Enable only when you want members to see an active pop quiz.",
    defaultVisible: false,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "weekly-practice",
    title: "Weekly practice set",
    section: "homework",
    track: "all",
    summary: "Between-meeting practice problems posted by instructors.",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "pygame-basic-exercises",
    title: "PyGame basic exercises",
    section: "assignments",
    track: "l2",
    summary: "Shapes and drawing lab (basic_exercises.py).",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "stars-project",
    title: "Stars animation project",
    section: "assignments",
    track: "l2",
    summary: "First OOP animation: falling and twinkling stars.",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "ball-game-project",
    title: "Ball Game project",
    section: "assignments",
    track: "l2",
    summary: "Paddle collection game with scoring.",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "tic-tac-toe-project",
    title: "Tic-Tac-Toe project",
    section: "assignments",
    track: "l2",
    summary: "Full board-game logic project.",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "pong-project",
    title: "Pong project",
    section: "assignments",
    track: "l2",
    summary: "Classic Pong build from Drive teaching materials.",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "snake-project",
    title: "Snake project",
    section: "assignments",
    track: "l2",
    summary: "Snake with list append/pop body mechanics.",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "games-menu-project",
    title: "Games menu project",
    section: "assignments",
    track: "l2",
    summary: "Combine prior games into one menu-driven program.",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "grades-overview",
    title: "Grades overview",
    section: "grades",
    track: "all",
    summary: "Chapter grading sheet and progress notes.",
    defaultVisible: false,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "chapter-directory",
    title: "Chapter directory",
    section: "chapter_directory",
    track: "all",
    summary: "Campus roster links and chapter contacts.",
    defaultVisible: true,
    driveUrl: APSDS_DRIVE_ROOT,
  },
  {
    id: "club-description",
    title: "APSDS club description",
    section: "club_resources",
    track: "all",
    summary: "Full and short club descriptions for 2026-27.",
    defaultVisible: true,
    driveUrl:
      "https://docs.google.com/document/d/16XIqkN4F1fkzWJVbl2386tJqXqN70_aH-U1a1nlBvvA/edit",
    bodyKey: "club-description",
  },
  {
    id: "flyer-v1",
    title: "Recruiting flyer v1",
    section: "club_resources",
    track: "all",
    summary: "Print-ready APSDS flyer.",
    defaultVisible: true,
    assetUrl: "/posters/flyer-v1.png",
  },
  {
    id: "flyer-v2",
    title: "Recruiting flyer v2",
    section: "club_resources",
    track: "all",
    summary: "Alternate APSDS flyer design.",
    defaultVisible: true,
    assetUrl: "/posters/flyer-v2.png",
  },
  {
    id: "club-fest-poster",
    title: "Club Fest poster",
    section: "club_resources",
    track: "all",
    summary: "Back-to-school festival poster.",
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
