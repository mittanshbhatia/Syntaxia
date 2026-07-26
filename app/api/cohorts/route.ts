import { NextResponse } from "next/server";
import { canAccessChapter, canManageVisibility, getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const chapterId = new URL(request.url).searchParams.get("chapterId");
  if (!chapterId) return NextResponse.json({ error: "chapterId required" }, { status: 400 });

  const access = await canAccessChapter(chapterId, user.id);
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createClient();
  const { data: cohorts, error } = await supabase
    .from("cohorts")
    .select(
      "id, name, track, instructor_id, meeting_schedule, start_date, end_date, current_lesson, status, created_at",
    )
    .eq("chapter_id", chapterId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message, cohorts: [] }, { status: 200 });
  }

  return NextResponse.json({ cohorts: cohorts ?? [] });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    chapterId?: string;
    name?: string;
    track?: "l1" | "l2" | "l3";
    meetingSchedule?: string;
    startDate?: string;
    endDate?: string;
    currentLesson?: string;
  } | null;

  if (!body?.chapterId || !body.name || !body.track) {
    return NextResponse.json({ error: "chapterId, name, and track required" }, { status: 400 });
  }

  const allowed = await canManageVisibility(user.id, body.chapterId);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cohorts")
    .insert({
      chapter_id: body.chapterId,
      name: body.name.trim(),
      track: body.track,
      instructor_id: user.id,
      meeting_schedule: body.meetingSchedule ?? null,
      start_date: body.startDate || null,
      end_date: body.endDate || null,
      current_lesson: body.currentLesson ?? null,
      status: "active",
    })
    .select("id, name, track, status, meeting_schedule, start_date, end_date, current_lesson")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cohort: data });
}
