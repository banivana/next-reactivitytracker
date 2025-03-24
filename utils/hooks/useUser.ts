import { createServerSupabaseClient } from "@/utils/supabase-server";
import { redirect } from "next/navigation";

export const useUser = async () => {
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
  }

  const isTrainer = profile?.is_trainer === true;

  if (!isTrainer) {
    redirect("/restricted");
  }

  return {
    user,
    profile,
    isTrainer,
  };
};
