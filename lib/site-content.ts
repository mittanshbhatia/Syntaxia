import { founderStory, homepageProblem, syntaxia } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";

export const SITE_CONTENT_KEYS = [
  "home.hero.tagline",
  "home.hero.headline",
  "home.problem.title",
  "home.product.title",
  "home.product.subtitle",
  "home.how.title",
  "home.different.title",
  "home.traction.title",
  "home.story.title",
  "home.story.body",
  "home.cta.title",
  "home.cta.body",
] as const;

export type SiteContentKey = (typeof SITE_CONTENT_KEYS)[number];
export type SiteContentMap = Record<SiteContentKey, string>;

export type SiteContentField = {
  key: SiteContentKey;
  label: string;
  section: string;
  description: string;
  maxLength: number;
  defaultValue: string;
};

export const SITE_CONTENT_FIELDS: readonly SiteContentField[] = [
  {
    key: "home.hero.tagline",
    label: "Hero tagline",
    section: "Homepage hero",
    description: "The short line beneath the Syntaxia wordmark.",
    maxLength: 140,
    defaultValue: syntaxia.tagline,
  },
  {
    key: "home.hero.headline",
    label: "Hero supporting line",
    section: "Homepage hero",
    description: "The supporting sentence beneath the main tagline.",
    maxLength: 180,
    defaultValue: syntaxia.headline,
  },
  {
    key: "home.problem.title",
    label: "Problem headline",
    section: "Problem",
    description: "The headline introducing the problem Syntaxia solves.",
    maxLength: 140,
    defaultValue: homepageProblem.title,
  },
  {
    key: "home.product.title",
    label: "Product headline",
    section: "Product",
    description: "The main product positioning statement.",
    maxLength: 180,
    defaultValue: syntaxia.wedge,
  },
  {
    key: "home.product.subtitle",
    label: "Product supporting line",
    section: "Product",
    description: "The line above the product preview cards.",
    maxLength: 180,
    defaultValue: "Student, teacher, and parent views of the same loop.",
  },
  {
    key: "home.how.title",
    label: "How it works headline",
    section: "How it works",
    description: "The headline above the four-step product flow.",
    maxLength: 120,
    defaultValue: "Four steps. No folders.",
  },
  {
    key: "home.different.title",
    label: "Differentiation headline",
    section: "Why we're different",
    description: "The headline above Syntaxia's differentiators.",
    maxLength: 120,
    defaultValue: "Actually useful.",
  },
  {
    key: "home.traction.title",
    label: "Proof headline",
    section: "Trusted by",
    description: "The headline above verified traction and chapter proof.",
    maxLength: 120,
    defaultValue: "Proof over adjectives.",
  },
  {
    key: "home.story.title",
    label: "Founder story headline",
    section: "Founder story",
    description: "The headline introducing Syntaxia's classroom origin.",
    maxLength: 160,
    defaultValue: founderStory.title,
  },
  {
    key: "home.story.body",
    label: "Founder story body",
    section: "Founder story",
    description: "The main paragraph describing how Syntaxia was built.",
    maxLength: 500,
    defaultValue: founderStory.body,
  },
  {
    key: "home.cta.title",
    label: "Closing CTA headline",
    section: "Closing call to action",
    description: "The final homepage headline.",
    maxLength: 160,
    defaultValue: "Bring modern computer science to your school.",
  },
  {
    key: "home.cta.body",
    label: "Closing CTA supporting line",
    section: "Closing call to action",
    description: "The sentence above the final action buttons.",
    maxLength: 220,
    defaultValue: "Request a demo, or start a chapter this semester.",
  },
];

export const SITE_CONTENT_FIELD_BY_KEY = new Map(
  SITE_CONTENT_FIELDS.map((field) => [field.key, field]),
);

export function getDefaultSiteContent(): SiteContentMap {
  return Object.fromEntries(
    SITE_CONTENT_FIELDS.map((field) => [field.key, field.defaultValue]),
  ) as SiteContentMap;
}

export async function getSiteContent(): Promise<SiteContentMap> {
  const content = getDefaultSiteContent();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("key, value")
      .in("key", [...SITE_CONTENT_KEYS]);

    if (error) return content;

    for (const row of data ?? []) {
      if (SITE_CONTENT_KEYS.includes(row.key as SiteContentKey) && typeof row.value === "string") {
        content[row.key as SiteContentKey] = row.value;
      }
    }
  } catch {
    // Keep code defaults available before the migration is applied or during a transient outage.
  }

  return content;
}
