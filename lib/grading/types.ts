export type TestVisibility = "visible" | "hidden";

export type GradeTest = {
  id: string;
  /** Shown to student on failure for visible tests only (category, not raw expected). */
  category: string;
  visibility: TestVisibility;
  /** Optional stdin fed to the program. */
  stdin?: string;
  /** Code appended after the student source (e.g. print(square(6))). */
  after?: string;
  /** Code prepended (e.g. nums = [...]). */
  before?: string;
  /** Exact expected stdout after trim / newline normalize. */
  expectedStdout: string;
};

export type GradeCaseResult = {
  id: string;
  category: string;
  visibility: TestVisibility;
  passed: boolean;
  /** Only returned for visible tests when failed. */
  detail?: string;
};

export type GradeReport = {
  materialId: string;
  promptId: string;
  passed: number;
  total: number;
  results: GradeCaseResult[];
  runtimeError?: string;
};
