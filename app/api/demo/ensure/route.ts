import { NextResponse } from "next/server";
import { demoAccounts, type DemoRole } from "@/lib/demo";
import { createAdminClient } from "@/lib/supabase/admin";

async function findUserIdByEmail(admin: ReturnType<typeof createAdminClient>, email: string) {
  const normalized = email.toLowerCase();
  // Prefer listUsers pagination for small projects
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === normalized);
    if (hit) return hit.id;
    if (data.users.length < 200) return null;
    page += 1;
    if (page > 20) return null;
  }
}

async function ensureAuthUser(
  admin: ReturnType<typeof createAdminClient>,
  email: string,
  password: string,
  displayName: string,
) {
  const existingId = await findUserIdByEmail(admin, email);
  if (existingId) {
    await admin.auth.admin.updateUserById(existingId, {
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName, demo: true },
    });
    return existingId;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName, demo: true },
  });
  if (error || !data.user) {
    throw new Error(error?.message ?? "Could not create demo user");
  }
  return data.user.id;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { role?: DemoRole };
    const role = body.role && body.role in demoAccounts ? body.role : null;
    const admin = createAdminClient();

    const { data: chapter, error: chapterError } = await admin
      .from("chapters")
      .select("id, slug")
      .eq("slug", "bisv")
      .maybeSingle();

    if (chapterError || !chapter) {
      return NextResponse.json(
        {
          error:
            "BISV chapter missing. Run supabase/schema.sql seeds on your Supabase project first.",
        },
        { status: 500 },
      );
    }

    const targets = role ? [demoAccounts[role]] : Object.values(demoAccounts);
    const ensured: { role: string; email: string; userId: string }[] = [];

    for (const account of targets) {
      const userId = await ensureAuthUser(
        admin,
        account.email,
        account.password,
        account.displayName,
      );

      await admin.from("profiles").upsert({
        id: userId,
        email: account.email,
        display_name: account.displayName,
        global_role: account.role === "director" ? "executive" : "member",
      });

      if (account.role === "student") {
        await admin.from("chapter_memberships").upsert(
          {
            chapter_id: chapter.id,
            user_id: userId,
            status: "approved",
            track: "l1",
            reviewed_at: new Date().toISOString(),
          },
          { onConflict: "chapter_id,user_id" },
        );
      }

      if (account.role === "pending") {
        await admin.from("chapter_memberships").upsert(
          {
            chapter_id: chapter.id,
            user_id: userId,
            status: "pending",
            track: null,
          },
          { onConflict: "chapter_id,user_id" },
        );
      }

      if (account.role === "director") {
        await admin.from("chapter_staff").upsert(
          {
            chapter_id: chapter.id,
            user_id: userId,
            role: "director",
          },
          { onConflict: "chapter_id,user_id" },
        );
        await admin.from("chapter_memberships").upsert(
          {
            chapter_id: chapter.id,
            user_id: userId,
            status: "approved",
            track: "l3",
            reviewed_at: new Date().toISOString(),
          },
          { onConflict: "chapter_id,user_id" },
        );

        // Ensure a demo cohort exists for attendance
        const { data: existingCohorts } = await admin
          .from("cohorts")
          .select("id")
          .eq("chapter_id", chapter.id)
          .eq("name", "YC Demo L1")
          .limit(1);

        if (!existingCohorts?.length) {
          await admin.from("cohorts").insert({
            chapter_id: chapter.id,
            name: "YC Demo L1",
            track: "l1",
            instructor_id: userId,
            meeting_schedule: "Wednesdays after school",
            status: "active",
            current_lesson: "python-starter-slides",
          });
        }
      }

      ensured.push({ role: account.role, email: account.email, userId });
    }

    return NextResponse.json({
      ok: true,
      chapter: chapter.slug,
      password: demoAccounts.student.password,
      accounts: ensured.map((e) => ({
        role: e.role,
        email: e.email,
        next: demoAccounts[e.role as DemoRole].next,
      })),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Demo ensure failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
