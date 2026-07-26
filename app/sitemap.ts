import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://syntaxia.org";
  const paths = [
    "",
    "/demo",
    "/pricing",
    "/apsds",
    "/join",
    "/start",
    "/members",
    "/contact",
    "/privacy",
    "/terms",
    "/security",
    "/student-privacy",
    "/data-deletion",
    "/acceptable-use",
    "/auth/sign-in",
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-07-26"),
    changeFrequency: path === "" || path === "/demo" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/demo" || path === "/pricing" ? 0.9 : 0.6,
  }));
}
