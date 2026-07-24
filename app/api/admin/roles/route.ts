import { createClient as createServiceClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Gate =
  | { ok: true; userId: string; admin: SupabaseClient }
  | { ok: false; response: NextResponse };

async function requireExecutive(): Promise<Gate> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("global_role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.global_role !== "executive") {
    return { ok: false, response: NextResponse.json({ error: "Executives only" }, { status: 403 }) };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Missing Supabase service role" }, { status: 500 }),
    };
  }

  return {
    ok: true,
    userId: user.id,
    admin: createServiceClient(url, serviceKey),
  };
}

export async function GET() {
  const gate = await requireExecutive();
  if (!gate.ok) return gate.response;

  const [{ data: profiles }, { data: staff }, { data: chapters }] = await Promise.all([
    gate.admin
      .from("profiles")
      .select("id, email, display_name, global_role, created_at")
      .order("created_at", { ascending: false }),
    gate.admin.from("chapter_staff").select("id, chapter_id, user_id, role"),
    gate.admin.from("chapters").select("id, slug, short_name, name").order("short_name"),
  ]);

  return NextResponse.json({
    profiles: profiles ?? [],
    staff: staff ?? [],
    chapters: chapters ?? [],
  });
}

export async function POST(request: Request) {
  const gate = await requireExecutive();
  if (!gate.ok) return gate.response;

  const body = (await request.json()) as {
    action: "set_executive" | "unset_executive" | "assign_staff" | "remove_staff";
    userId?: string;
    chapterId?: string;
    role?: "director" | "instructor";
    staffId?: string;
  };

  if (body.action === "set_executive" || body.action === "unset_executive") {
    if (!body.userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }
    if (body.action === "unset_executive" && body.userId === gate.userId) {
      return NextResponse.json(
        { error: "You cannot remove your own executive role" },
        { status: 400 },
      );
    }
    const { error } = await gate.admin
      .from("profiles")
      .update({
        global_role: body.action === "set_executive" ? "executive" : "member",
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "assign_staff") {
    if (!body.userId || !body.chapterId || !body.role) {
      return NextResponse.json({ error: "userId, chapterId, role required" }, { status: 400 });
    }
    const { error } = await gate.admin.from("chapter_staff").upsert(
      {
        user_id: body.userId,
        chapter_id: body.chapterId,
        role: body.role,
      },
      { onConflict: "chapter_id,user_id" },
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "remove_staff") {
    if (!body.staffId) {
      return NextResponse.json({ error: "staffId required" }, { status: 400 });
    }
    const { error } = await gate.admin.from("chapter_staff").delete().eq("id", body.staffId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
