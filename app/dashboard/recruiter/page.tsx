import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { RecruiterDashboardClient } from "./client";

export default async function RecruiterDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "recruiter") {
    redirect("/dashboard/model");
  }

  // Get recruited models
  const { data: recruits } = await supabase
    .from("profiles")
    .select("id, email, display_name, created_at")
    .eq("recruited_by", user.id)
    .eq("role", "model");

  return (
    <RecruiterDashboardClient
      userEmail={user.email || ""}
      displayName={profile.display_name || user.email?.split("@")[0] || "Recruiter"}
      referralCode={profile.referral_code || user.id.slice(0, 8)}
      recruits={recruits || []}
    />
  );
}
