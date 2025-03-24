import { createServerSupabaseClient } from "@/utils/supabase-server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function useUserProfile() {
  const supabase = createServerSupabaseClient();

  // Get the user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If there's no user, redirect to login
  if (error || !user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    // We don't redirect here, just log the error
    // This allows components to handle the error appropriately
  }

  const isTrainer = profile?.is_trainer === true;

  // Redirect non-trainers to the restricted page
  // If currentPath is provided, use it to avoid redirect loops
  if (!isTrainer) {
    redirect("/restricted");
  }

  return {
    user,
    profile,
    isTrainer,
  };
}
