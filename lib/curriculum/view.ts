import type { CurriculumMaterial } from "@/lib/curriculum/catalog";
import { materialBodies } from "@/lib/curriculum/bodies";

/** Fallback in-page copy so every material is viewable without leaving Syntaxia. */
const FALLBACK_DETAILS: Record<string, string> = {
  "python-starter-slides":
    "APSDS Python Starter is the shared intro-to-Python slide deck.\n\nUse it for early L1 meetings (slides 1–74 across the year) and L2 recap sessions.\n\nOpen Drive for the latest slide file and class practice prompts.",
  "l2-teaching-pack":
    "L2 Teaching Materials pack includes PyGame labs, Meeting 10 videos, mouse/button exercises, and project assets for Pong and Snake.\n\nOpen Drive for the Level 2 folder used in club meetings.",
  "search-sort-code":
    "Reference implementations for binary search, linear search, bubble sort, insertion sort, and selection sort.\n\nUsed in L2 Meeting 5 and related practice. Open Drive for the code files.",
  "big-o-worksheet":
    "Worksheet: how to do time complexity / Big-O notation.\n\nUsed in late L1 sessions with whiteboard practice. Open Drive for the printable worksheet.",
  "acsl-worksheets":
    "ACSL contest practice worksheets and CWLesson materials.\n\nChapters cover ACSL registration fees. Open Drive for the current contest worksheet set.",
  "python-foundations-test-1":
    "26-27 Python Foundations Test 1.\n\nStaff: keep this hidden until test day, then unhide for members.\n\nOpen Drive for the active test version.",
  "python-foundations-test-2":
    "26-27 Python Foundations Test 2.\n\nStaff: keep this hidden until test day, then unhide for members.\n\nOpen Drive for the active test version.",
  "ultimate-cumulative-test":
    "Ultimate Cumulative Python Foundations Test used early in L2.\n\nStaff: keep hidden until the assessment window, then unhide.\n\nOpen Drive for the test packet.",
  "pop-quiz-slot":
    "Pop quiz slot.\n\nDirectors/executives: leave hidden by default. Unhide when the quiz should appear on member dashboards.\n\nOpen Drive (or paste quiz content here later) for the live quiz.",
  "weekly-practice":
    "Weekly practice set between meetings.\n\nInstructors post the current problem set on Drive/Schoology. Open Drive for this week’s practice.",
  "pygame-basic-exercises":
    "Assignment: create basic_exercises.py and complete YoungWonks-style basic PyGame shape exercises.\n\nOpen Drive for starter notes and draw syntax examples.",
  "stars-project":
    "Assignment: stars.py — first OOP animation with falling and twinkling stars.\n\nOpen Drive for walkthrough slides and sample structure.",
  "ball-game-project":
    "Assignment: paddle ball-collection game with scoring.\n\nOpen Drive for project brief and starter snippets.",
  "tic-tac-toe-project":
    "Assignment: tic_tac_toe.py — full board-game logic project.\n\nOpen Drive for concept notes and reference logic.",
  "pong-project":
    "Assignment: pong.py — classic Pong from L2 teaching materials.\n\nOpen Drive for assets and reference code.",
  "snake-project":
    "Assignment: snake.py — focus on list append/pop for the snake body.\n\nOpen Drive for project materials.",
  "games-menu-project":
    "Assignment: Games.py — combine prior games into one menu-driven program.\n\nOpen Drive for menu/event-loop guidance.",
  "grades-overview":
    "Chapter grades and progress notes.\n\nStaff: unhide when you want members to see scores. Open Drive for the grading sheet.",
  "chapter-directory":
    "Chapter directory: campus contacts, roster links, and chapter announcements.\n\nOpen Drive for the shared chapter folder.",
};

export function getMaterialBody(material: CurriculumMaterial): string | null {
  if (material.bodyKey && materialBodies[material.bodyKey]) {
    return materialBodies[material.bodyKey];
  }
  return FALLBACK_DETAILS[material.id] ?? null;
}

export function googleDocPreviewUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  return `https://docs.google.com/document/d/${match[1]}/preview`;
}
