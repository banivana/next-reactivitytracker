import { createServerSupabaseClient } from "@/utils/supabase-server";
import { redirect } from "next/navigation";

export const getUser = async () => {
  const supabase = await createServerSupabaseClient();

  // Get the user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If there's no user, redirect to login
  if (error || !user) {
    redirect("/login");
  }

  console.log("getting profile for", user.id);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
  }

  const isTrainer = profile?.is_trainer === true;

  return {
    user,
    profile,
    isTrainer,
  };
};
