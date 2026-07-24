export type GlobalRole = "executive" | "member";
export type StaffRole = "director" | "instructor";
export type MembershipStatus = "pending" | "approved" | "rejected";
export type ChapterStatus = "open" | "coming";

export type ChapterRow = {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  region: string | null;
  status: ChapterStatus;
  blurb: string | null;
};

export type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  global_role: GlobalRole;
};

export type MembershipRow = {
  id: string;
  chapter_id: string;
  user_id: string;
  status: MembershipStatus;
  track: "l1" | "l2" | "l3" | null;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

export type StaffRow = {
  id: string;
  chapter_id: string;
  user_id: string;
  role: StaffRole;
};
