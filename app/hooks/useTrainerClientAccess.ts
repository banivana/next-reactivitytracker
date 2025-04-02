import { createServerSupabaseClient } from "@/utils/supabase-server";

export type TrainerClientAccessResult = {
  hasAccess: boolean;
  relationship: any | null;
  error: Error | null;
};

export async function checkTrainerClientAccess(
  trainerId: string,
  clientId: string,
): Promise<TrainerClientAccessResult> {
  const supabase = await createServerSupabaseClient();

  // Check if the trainer has access to this client
  const { data: relationship, error } = await supabase
    .from("trainer_client")
    .select("*")
    .eq("trainer", trainerId)
    .eq("client", clientId)
    .maybeSingle();

  if (error) {
    console.error("Error checking trainer-client relationship:", error);
    return {
      hasAccess: false,
      relationship: null,
      error,
    };
  }

  return {
    hasAccess: !!relationship,
    relationship,
    error: null,
  };
}
