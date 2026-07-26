import type { GradeTest } from "@/lib/grading/types";

/** Deterministic tests keyed by materialId → promptId. Hidden cases never reveal expected output. */
export const gradeCatalog: Record<string, Record<string, GradeTest[]>> = {
  "python-starter-slides": {
    "ps-input": [
      {
        id: "sum-a",
        category: "two positive integers",
        visibility: "visible",
        stdin: "3\n4\n",
        expectedStdout: "7",
      },
      {
        id: "sum-b",
        category: "includes zero",
        visibility: "hidden",
        stdin: "0\n12\n",
        expectedStdout: "12",
      },
      {
        id: "sum-c",
        category: "negatives",
        visibility: "hidden",
        stdin: "-2\n5\n",
        expectedStdout: "3",
      },
    ],
    "ps-while": [
      {
        id: "countdown",
        category: "prints 5 down to 1",
        visibility: "visible",
        expectedStdout: "5\n4\n3\n2\n1",
      },
    ],
    "ps-for": [
      {
        id: "sum-10",
        category: "sum 1..10",
        visibility: "visible",
        expectedStdout: "55",
      },
    ],
    "ps-list": [
      {
        id: "max-a",
        category: "find largest in list",
        visibility: "visible",
        before: "nums = [3, 9, 1, 7]\n",
        expectedStdout: "9",
      },
      {
        id: "max-b",
        category: "largest at end",
        visibility: "hidden",
        before: "nums = [1, 2, 8]\n",
        expectedStdout: "8",
      },
    ],
    "ps-func": [
      {
        id: "sq-6",
        category: "square(6)",
        visibility: "visible",
        after: "print(square(6))",
        expectedStdout: "36",
      },
      {
        id: "sq-0",
        category: "square(0)",
        visibility: "hidden",
        after: "print(square(0))",
        expectedStdout: "0",
      },
      {
        id: "sq-neg",
        category: "square(-3)",
        visibility: "hidden",
        after: "print(square(-3))",
        expectedStdout: "9",
      },
    ],
    "ps-if": [
      {
        id: "grade-a",
        category: "score in A range",
        visibility: "visible",
        stdin: "95\n",
        before: "score = int(input())\n",
        expectedStdout: "A",
      },
      {
        id: "grade-b",
        category: "score in B range",
        visibility: "hidden",
        stdin: "85\n",
        before: "score = int(input())\n",
        expectedStdout: "B",
      },
      {
        id: "grade-f",
        category: "failing score",
        visibility: "hidden",
        stdin: "50\n",
        before: "score = int(input())\n",
        expectedStdout: "F",
      },
    ],
  },
};

export function getGradeTests(materialId: string, promptId: string): GradeTest[] {
  return gradeCatalog[materialId]?.[promptId] ?? [];
}

export function hasAutograder(materialId: string, promptId: string): boolean {
  return getGradeTests(materialId, promptId).length > 0;
}

/** Concept tags used for mastery updates when a prompt is graded. */
export const promptConcepts: Record<string, Record<string, string[]>> = {
  "python-starter-slides": {
    "ps-input": ["variables", "types"],
    "ps-while": ["loops"],
    "ps-for": ["loops"],
    "ps-list": ["lists", "loops"],
    "ps-func": ["functions"],
    "ps-if": ["conditionals"],
    "ps-var": ["variables"],
    "ps-base": ["types"],
  },
};

export function conceptsForPrompt(materialId: string, promptId: string): string[] {
  return promptConcepts[materialId]?.[promptId] ?? [];
}
