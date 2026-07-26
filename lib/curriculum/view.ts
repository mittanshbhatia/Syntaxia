import type { CurriculumMaterial } from "@/lib/curriculum/catalog";
import { materialBodies } from "@/lib/curriculum/bodies";
import { getLesson } from "@/lib/curriculum/lessons";

export function getMaterialBody(material: CurriculumMaterial): string | null {
  if (material.bodyKey && materialBodies[material.bodyKey]) {
    return materialBodies[material.bodyKey];
  }
  const lesson = getLesson(material.id);
  if (!lesson) return null;
  return [lesson.intro, ...lesson.sections.map((s) => `${s.heading}\n\n${s.body}`)].join("\n\n");
}
