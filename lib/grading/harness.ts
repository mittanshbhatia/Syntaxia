import type { GradeCaseResult, GradeReport, GradeTest } from "@/lib/grading/types";

export function normalizeStdout(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/^\n+/, "")
    .replace(/\n+$/, "");
}

export function buildHarness(studentCode: string, test: GradeTest): string {
  const before = test.before ?? "";
  const after = test.after ?? "";
  const stdin = test.stdin ?? "";
  return `
import sys
from io import StringIO
sys.stdin = StringIO(${JSON.stringify(stdin)})
${before}${studentCode}
${after}
`.trimStart();
}

export function summarizeResults(
  materialId: string,
  promptId: string,
  tests: GradeTest[],
  outcomes: { id: string; passed: boolean; stdout: string; stderr: string }[],
  runtimeError?: string,
): GradeReport {
  const results: GradeCaseResult[] = tests.map((test) => {
    const outcome = outcomes.find((o) => o.id === test.id);
    const passed = Boolean(outcome?.passed);
    const result: GradeCaseResult = {
      id: test.id,
      category: test.category,
      visibility: test.visibility,
      passed,
    };
    if (!passed && test.visibility === "visible") {
      if (outcome?.stderr) {
        result.detail = "Runtime or syntax error on this case.";
      } else {
        result.detail = `Failed category: ${test.category}`;
      }
    }
    return result;
  });

  return {
    materialId,
    promptId,
    passed: results.filter((r) => r.passed).length,
    total: results.length,
    results,
    runtimeError,
  };
}
