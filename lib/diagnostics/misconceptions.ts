export type MisconceptionTag =
  | "off_by_one"
  | "incorrect_loop_condition"
  | "wrong_variable_update"
  | "missing_base_case"
  | "incorrect_data_type"
  | "edge_case_not_handled"
  | "incorrect_return_value"
  | "input_parsing_error";

const RULES: { tag: MisconceptionTag; label: string; test: (code: string) => boolean }[] = [
  {
    tag: "off_by_one",
    label: "Off-by-one error",
    test: (code) => /range\s*\(\s*1\s*,\s*n\s*\)/.test(code) && !/range\s*\(\s*1\s*,\s*n\s*\+\s*1\s*\)/.test(code),
  },
  {
    tag: "incorrect_loop_condition",
    label: "Incorrect loop condition",
    test: (code) => /while\s+True/.test(code) && !/break/.test(code),
  },
  {
    tag: "wrong_variable_update",
    label: "Wrong variable update",
    test: (code) => /for\s+\w+\s+in\s+range/.test(code) && !/\w+\s*\+=/.test(code) && /total\s*=\s*0/.test(code),
  },
  {
    tag: "missing_base_case",
    label: "Missing base case",
    test: (code) => /def\s+\w+\([^)]*\):/.test(code) && code.includes("return ") && !/if\s+/.test(code) && /\w+\(/.test(code.split("def")[1] ?? ""),
  },
  {
    tag: "incorrect_return_value",
    label: "Incorrect return value",
    test: (code) => /print\s*\(/.test(code) && !/return\s+/.test(code) && /def\s+/.test(code),
  },
  {
    tag: "input_parsing_error",
    label: "Input parsing error",
    test: (code) => /input\s*\(/.test(code) && !/int\s*\(/.test(code) && /range\s*\(\s*input/.test(code),
  },
  {
    tag: "incorrect_data_type",
    label: "Incorrect data type",
    test: (code) => /\+\s*"/.test(code) && /int\s*\(/.test(code) === false && /input/.test(code),
  },
];

export function classifyMisconceptions(code: string): { tag: MisconceptionTag; label: string }[] {
  const src = code ?? "";
  return RULES.filter((r) => r.test(src)).map(({ tag, label }) => ({ tag, label }));
}
