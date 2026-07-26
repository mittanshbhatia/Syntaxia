export type DiagnosticConcept =
  | "variables"
  | "types"
  | "conditionals"
  | "loops"
  | "functions"
  | "lists"
  | "debugging"
  | "algorithms";

export type DiagnosticQuestion = {
  key: string;
  concept: DiagnosticConcept;
  prompt: string;
  choices: string[];
  /** 0-based index of correct choice */
  correctIndex: number;
};

export const PYTHON_DIAGNOSTIC_SLUG = "python-foundations";

export const pythonDiagnosticQuestions: DiagnosticQuestion[] = [
  {
    key: "var-1",
    concept: "variables",
    prompt: "After `x = 3` then `x = x + 2`, what is the value of `x`?",
    choices: ["3", "5", "2", "Error"],
    correctIndex: 1,
  },
  {
    key: "var-2",
    concept: "variables",
    prompt: "Which name is a valid Python variable?",
    choices: ["2cool", "cool-2", "cool_2", "class"],
    correctIndex: 2,
  },
  {
    key: "type-1",
    concept: "types",
    prompt: "What is `type(3.0)`?",
    choices: ["int", "float", "str", "bool"],
    correctIndex: 1,
  },
  {
    key: "type-2",
    concept: "types",
    prompt: "What does `int(\"12\")` evaluate to?",
    choices: ['"12"', "12", "12.0", "Error"],
    correctIndex: 1,
  },
  {
    key: "cond-1",
    concept: "conditionals",
    prompt: "For `n = 0`, what prints?\n```\nif n > 0:\n    print(\"pos\")\nelif n == 0:\n    print(\"zero\")\nelse:\n    print(\"neg\")\n```",
    choices: ["pos", "zero", "neg", "Nothing"],
    correctIndex: 1,
  },
  {
    key: "cond-2",
    concept: "conditionals",
    prompt: "Which condition is True when `x = 7`?",
    choices: ["x < 5 and x > 8", "x < 5 or x > 8", "not (x == 7)", "x >= 7 and x < 10"],
    correctIndex: 3,
  },
  {
    key: "loop-1",
    concept: "loops",
    prompt: "What does `list(range(1, 5))` produce?",
    choices: ["[1, 2, 3, 4, 5]", "[1, 2, 3, 4]", "[0, 1, 2, 3, 4]", "[1, 5]"],
    correctIndex: 1,
  },
  {
    key: "loop-2",
    concept: "loops",
    prompt: "How many times does this print?\n```\ni = 0\nwhile i < 3:\n    print(i)\n    i += 1\n```",
    choices: ["2", "3", "4", "Infinite"],
    correctIndex: 1,
  },
  {
    key: "loop-3",
    concept: "loops",
    prompt: "Common off-by-one: to include both ends of 1..n inclusive in `range`, use:",
    choices: ["range(1, n)", "range(1, n + 1)", "range(0, n)", "range(n)"],
    correctIndex: 1,
  },
  {
    key: "fn-1",
    concept: "functions",
    prompt: "What does this return?\n```\ndef add(a, b):\n    return a + b\nadd(2, 3)\n```",
    choices: ["None", "5", "23", "Error"],
    correctIndex: 1,
  },
  {
    key: "fn-2",
    concept: "functions",
    prompt: "A function without a `return` statement returns:",
    choices: ["0", "False", "None", "Error"],
    correctIndex: 2,
  },
  {
    key: "list-1",
    concept: "lists",
    prompt: "For `a = [10, 20, 30]`, what is `a[1]`?",
    choices: ["10", "20", "30", "Error"],
    correctIndex: 1,
  },
  {
    key: "list-2",
    concept: "lists",
    prompt: "What does `[1, 2, 3] + [4]` equal?",
    choices: ["[1, 2, 7]", "[1, 2, 3, 4]", "[5]", "Error"],
    correctIndex: 1,
  },
  {
    key: "list-3",
    concept: "lists",
    prompt: "`len([\"a\", \"b\", \"c\"])` is:",
    choices: ["2", "3", "4", "Error"],
    correctIndex: 1,
  },
  {
    key: "dbg-1",
    concept: "debugging",
    prompt: "This crashes. Why?\n```\nnums = [1, 2, 3]\nprint(nums[3])\n```",
    choices: ["Syntax error", "IndexError", "TypeError", "It prints 3"],
    correctIndex: 1,
  },
  {
    key: "dbg-2",
    concept: "debugging",
    prompt: "Best first step when output is wrong but no crash occurs:",
    choices: [
      "Delete the file and rewrite",
      "Print intermediate values / check loop bounds",
      "Ignore tests",
      "Change the language",
    ],
    correctIndex: 1,
  },
  {
    key: "algo-1",
    concept: "algorithms",
    prompt: "To find the maximum in a list of n numbers by scanning once, time is roughly:",
    choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 2,
  },
  {
    key: "algo-2",
    concept: "algorithms",
    prompt: "Binary search on a sorted list of n items is typically:",
    choices: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctIndex: 1,
  },
];

export type PlacementResult = {
  recommendedTrack: "l1" | "l2" | "l3";
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  startingLesson: string;
  score: number;
  total: number;
  byConcept: Record<string, { correct: number; total: number }>;
};

export function scoreDiagnostic(
  answers: Record<string, number | null>,
  questions: DiagnosticQuestion[] = pythonDiagnosticQuestions,
): PlacementResult {
  const byConcept: Record<string, { correct: number; total: number }> = {};
  let correct = 0;

  for (const q of questions) {
    const bucket = byConcept[q.concept] ?? { correct: 0, total: 0 };
    bucket.total += 1;
    const selected = answers[q.key];
    if (selected === q.correctIndex) {
      bucket.correct += 1;
      correct += 1;
    }
    byConcept[q.concept] = bucket;
  }

  const total = questions.length;
  const pct = total ? correct / total : 0;

  const strengths = Object.entries(byConcept)
    .filter(([, v]) => v.total > 0 && v.correct / v.total >= 0.75)
    .map(([k]) => k);

  const weaknesses = Object.entries(byConcept)
    .filter(([, v]) => v.total > 0 && v.correct / v.total < 0.5)
    .map(([k]) => k);

  let recommendedTrack: "l1" | "l2" | "l3" = "l1";
  let startingLesson = "Variables & types";
  if (pct >= 0.85 && (byConcept.algorithms?.correct ?? 0) >= 1) {
    recommendedTrack = "l3";
    startingLesson = "Complexity & contest warmups";
  } else if (pct >= 0.6) {
    recommendedTrack = "l2";
    startingLesson = "Applied projects · lists & functions";
  } else {
    recommendedTrack = "l1";
    startingLesson =
      weaknesses.includes("loops") || weaknesses.includes("conditionals")
        ? "Conditionals & loops"
        : "Variables & types";
  }

  const confidence = Math.round(Math.min(95, Math.max(35, pct * 100 - (weaknesses.length * 4))));

  return {
    recommendedTrack,
    confidence,
    strengths,
    weaknesses,
    startingLesson,
    score: correct,
    total,
    byConcept,
  };
}
