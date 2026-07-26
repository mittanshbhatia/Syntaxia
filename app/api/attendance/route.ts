import { NextResponse } from "next/server";
import { canManageVisibility, getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cohortId = new URL(request.url).searchParams.get("cohortId");
  if (!cohortId) return NextResponse.json({ error: "cohortId required" }, { status: 400 });

  const supabase = await createClient();
  const { data: cohort } = await supabase
    .from("cohorts")
    .select("id, chapter_id")
    .eq("id", cohortId)
    .maybeSingle();
  if (!cohort) return NextResponse.json({ error: "Cohort not found" }, { status: 404 });

  const allowed = await canManageVisibility(user.id, cohort.chapter_id);
  // Members of cohort can also view
  const { data: membership } = await supabase
    .from("cohort_members")
    .select("id")
    .eq("cohort_id", cohortId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!allowed && !membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: meetings, error } = await supabase
    .from("attendance_meetings")
    .select("id, meeting_date, label, created_at")
    .eq("cohort_id", cohortId)
    .order("meeting_date", { ascending: false });

  if (error) return NextResponse.json({ meetings: [], error: error.message });

  const meetingIds = (meetings ?? []).map((m) => m.id);
  const { data: records } = meetingIds.length
    ? await supabase
        .from("attendance_records")
        .select("id, meeting_id, user_id, status, note")
        .in("meeting_id", meetingIds)
    : { data: [] as { id: string; meeting_id: string; user_id: string; status: string; note: string | null }[] };

  return NextResponse.json({ meetings: meetings ?? [], records: records ?? [] });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    cohortId?: string;
    meetingDate?: string;
    label?: string;
    records?: { userId: string; status: "present" | "late" | "absent" | "excused"; note?: string }[];
  } | null;

  if (!body?.cohortId || !body.meetingDate) {
    return NextResponse.json({ error: "cohortId and meetingDate required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: cohort } = await supabase
    .from("cohorts")
    .select("id, chapter_id")
    .eq("id", body.cohortId)
    .maybeSingle();
  if (!cohort) return NextResponse.json({ error: "Cohort not found" }, { status: 404 });

  const allowed = await canManageVisibility(user.id, cohort.chapter_id);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: meeting, error: meetingError } = await supabase
    .from("attendance_meetings")
    .upsert(
      {
        cohort_id: body.cohortId,
        meeting_date: body.meetingDate,
        label: body.label ?? null,
        created_by: user.id,
      },
      { onConflict: "cohort_id,meeting_date" },
    )
    .select("id, meeting_date, label")
    .single();

  if (meetingError || !meeting) {
    return NextResponse.json({ error: meetingError?.message ?? "Could not save meeting" }, { status: 500 });
  }

  if (body.records?.length) {
    const rows = body.records.map((r) => ({
      meeting_id: meeting.id,
      user_id: r.userId,
      status: r.status,
      note: r.note ?? null,
    }));
    const { error: recError } = await supabase.from("attendance_records").upsert(rows, {
      onConflict: "meeting_id,user_id",
    });
    if (recError) return NextResponse.json({ error: recError.message, meeting }, { status: 500 });
  }

  return NextResponse.json({ meeting });
}
