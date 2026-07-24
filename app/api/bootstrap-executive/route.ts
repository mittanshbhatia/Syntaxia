import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * One-time bootstrap: if no executives exist yet, the signed-in user
 * (or provided email matching the signed-in user) becomes executive.
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) {
    return NextResponse.json({ error: "Missing service role" }, { status: 500 });
  }

  const admin = createServiceClient(url, serviceKey);

  const { count } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("global_role", "executive");

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: "An executive already exists. Use the admin panel to promote others." },
      { status: 403 },
    );
  }

  const { error } = await admin
    .from("profiles")
    .update({ global_role: "executive", email: user.email })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "You are now an executive." });
}
