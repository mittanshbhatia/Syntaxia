import {
  curriculumCatalog,
  SECTION_KEYS,
  SECTION_META,
  type CurriculumMaterial,
  type MaterialSection,
} from "@/lib/curriculum/catalog";
import { createClient } from "@/lib/supabase/server";

export type VisibilityMaps = {
  materials: Record<string, boolean>;
  sections: Record<string, boolean>;
};

export async function getChapterVisibility(chapterId: string): Promise<VisibilityMaps> {
  const supabase = await createClient();
  const [{ data: materialRows, error: materialError }, { data: sectionRows, error: sectionError }] =
    await Promise.all([
      supabase
        .from("chapter_material_visibility")
        .select("material_id, visible_to_members")
        .eq("chapter_id", chapterId),
      supabase
        .from("chapter_section_visibility")
        .select("section_key, visible_to_members")
        .eq("chapter_id", chapterId),
    ]);

  if (materialError || sectionError) {
    return { materials: {}, sections: {} };
  }

  const materials: Record<string, boolean> = {};
  for (const row of materialRows ?? []) {
    materials[row.material_id as string] = Boolean(row.visible_to_members);
  }

  const sections: Record<string, boolean> = {};
  for (const row of sectionRows ?? []) {
    sections[row.section_key as string] = Boolean(row.visible_to_members);
  }

  return { materials, sections };
}

export function isSectionVisible(
  section: MaterialSection,
  maps: VisibilityMaps,
  asStaff: boolean,
) {
  if (asStaff) return true;
  if (section in maps.sections) return maps.sections[section];
  return true;
}

export function isMaterialVisible(
  material: CurriculumMaterial,
  maps: VisibilityMaps,
  asStaff: boolean,
) {
  if (material.staffOnly) return asStaff;
  if (asStaff) return true;
  if (!isSectionVisible(material.section, maps, false)) return false;
  if (material.id in maps.materials) return maps.materials[material.id];
  return material.defaultVisible;
}

export function visibleMaterialsForChapter(maps: VisibilityMaps, asStaff: boolean) {
  return curriculumCatalog.filter((m) => isMaterialVisible(m, maps, asStaff));
}

export function groupedVisibleMaterials(maps: VisibilityMaps, asStaff: boolean) {
  const items = visibleMaterialsForChapter(maps, asStaff);
  return SECTION_KEYS.map((section) => ({
    section,
    meta: SECTION_META[section],
    sectionVisible: isSectionVisible(section, maps, asStaff),
    materials: items.filter((m) => m.section === section),
  })).filter((group) => asStaff || (group.sectionVisible && group.materials.length > 0));
}

export function defaultMaterialVisibility(materialId: string) {
  return curriculumCatalog.find((m) => m.id === materialId)?.defaultVisible ?? true;
}
