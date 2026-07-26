import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    orgType?: "school" | "club" | "tutoring" | "nonprofit" | "other";
    estimatedStudents?: number;
    track?: "l1" | "l2" | "l3";
    planId?: string;
    contactName?: string;
    contactEmail?: string;
    notes?: string;
    inviteEmails?: string[];
  } | null;

  if (!body?.name?.trim() || !body.orgType || !body.contactEmail?.trim()) {
    return NextResponse.json(
      { error: "name, orgType, and contactEmail are required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data: org, error } = await supabase
    .from("organizations")
    .insert({
      name: body.name.trim(),
      org_type: body.orgType,
      estimated_students: body.estimatedStudents ?? null,
      track: body.track ?? null,
      plan_id: body.planId ?? "founding",
      contact_email: body.contactEmail.trim().toLowerCase(),
      contact_name: body.contactName?.trim() ?? null,
      notes: body.notes?.trim() ?? null,
      created_by: user.id,
      status: "pending",
    })
    .select("id, name, org_type, plan_id, status, created_at")
    .single();

  if (error || !org) {
    return NextResponse.json(
      {
        error: error?.message ?? "Could not create organization",
        hint: "Run supabase/phase6_orgs.sql if the organizations table is missing.",
      },
      { status: 500 },
    );
  }

  const invites = (body.inviteEmails ?? [])
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10);

  if (invites.length) {
    await supabase.from("organization_invites").insert(
      invites.map((email) => ({
        organization_id: org.id,
        email,
        role: "instructor",
      })),
    );
  }

  return NextResponse.json({ organization: org, invites: invites.length });
}
