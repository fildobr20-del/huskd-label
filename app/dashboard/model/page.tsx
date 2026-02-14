import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ModelDashboardClient } from "./client";

export default async function ModelDashboardPage() {
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

  if (!profile || profile.role !== "model") {
    redirect("/dashboard/recruiter");
  }

  return (
    <ModelDashboardClient
      userEmail={user.email || ""}
      displayName={profile.display_name || user.email?.split("@")[0] || "Model"}
    />
  );
}
