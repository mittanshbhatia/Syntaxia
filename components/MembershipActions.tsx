"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export function MembershipActions({
  membershipId,
  status,
}: {
  membershipId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setStatus(next: "approved" | "rejected" | "pending") {
    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("chapter_memberships")
        .update({
          status: next,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq("id", membershipId);

      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "approved" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => setStatus("approved")}
          className="btn btn-primary px-3 py-1.5 text-xs"
        >
          Approve
        </button>
      ) : null}
      {status !== "rejected" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => setStatus("rejected")}
          className="btn btn-ghost px-3 py-1.5 text-xs"
        >
          Reject
        </button>
      ) : null}
      {status !== "pending" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => setStatus("pending")}
          className="btn btn-ghost px-3 py-1.5 text-xs"
        >
          Reset pending
        </button>
      ) : null}
    </div>
  );
}
