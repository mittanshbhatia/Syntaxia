import type { MisconceptionTag } from "@/lib/diagnostics/misconceptions";
import type { GradeReport } from "@/lib/grading/types";

const HINT_BANK: Record<string, string[]> = {
  "ps-while": [
    "What should the loop variable start at, and when should the loop stop?",
    "If you print inside the loop, does the variable change each time, and in which direction?",
    "Try writing the five numbers you expect on paper, then match the loop bounds to that list.",
  ],
  "ps-for": [
    "Which range produces the integers 1 through 10 inclusive?",
    "Where do you accumulate the running total, before the loop, or inside it?",
    "After the loop finishes, what should you print: the counter, or the accumulated sum?",
  ],
  "ps-func": [
    "Does your function return a value, or only print inside the function?",
    "What should square(n) give back for the caller to print?",
    "Check the name and parameter: the autograder calls square(...).",
  ],
  "ps-list": [
    "Walk the list once. What do you compare each element against?",
    "What should your ‘largest so far’ start as, and when do you update it?",
    "Remember: the prompt asks you not to use max().",
  ],
  "ps-input": [
    "How many values do you need to read, and what type should they be?",
    "After reading both numbers, what single value should be printed?",
    "Watch for leftover newlines, print only the sum.",
  ],
  "ps-if": [
    "Order the conditions from highest score band to lowest.",
    "What happens for a score that is exactly on a boundary (90, 80, 70)?",
    "The harness sets `score` from input, branch on that variable and print one letter.",
  ],
  "ps-var": [
    "Do you have one string variable and one integer variable?",
    "Can you print both on a single line with one print call?",
  ],
};

const TAG_HINTS: Partial<Record<MisconceptionTag, string>> = {
  off_by_one: "Are your range bounds inclusive where you need them to be?",
  incorrect_loop_condition: "Will this loop ever stop? Where is the exit condition?",
  wrong_variable_update: "Is the accumulator actually changing inside the loop?",
  missing_base_case: "What happens on the smallest input, do you handle it?",
  incorrect_return_value: "Should this function return a value for the caller, instead of only printing?",
  input_parsing_error: "Did you convert input() results to the right type before using them?",
  incorrect_data_type: "Are you mixing strings and numbers without converting?",
  edge_case_not_handled: "What about zero, negatives, or an empty collection?",
};

export function getSocraticHints(opts: {
  promptId: string;
  report?: GradeReport | null;
  tags?: { tag: string; label: string }[];
  hintIndex: number;
}): { hint: string; index: number; total: number } | null {
  const bank = [...(HINT_BANK[opts.promptId] ?? [])];

  if (opts.report) {
    const failedVisible = opts.report.results.filter((r) => !r.passed && r.visibility === "visible");
    for (const f of failedVisible) {
      bank.push(`Look at the failed category “${f.category}”. What assumption might be wrong there?`);
    }
    if (opts.report.runtimeError) {
      bank.unshift("Read the error message carefully, which line is Python pointing at?");
    }
  }

  for (const t of opts.tags ?? []) {
    const extra = TAG_HINTS[t.tag as MisconceptionTag];
    if (extra) bank.push(extra);
  }

  // De-dupe while preserving order
  const hints = [...new Set(bank)];
  if (!hints.length) return null;

  const index = Math.min(Math.max(opts.hintIndex, 0), hints.length - 1);
  return { hint: hints[index]!, index, total: hints.length };
}
