"use server";

import { createServerSupabaseClient } from "@/utils/supabase-server";
import { getUser } from "@/utils/server/getUser";
import { checkTrainerClientAccess } from "@/app/hooks/useTrainerClientAccess";
import { revalidatePath } from "next/cache";

export async function updateClientActiveStatus(
  clientId: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await getUser();
    const { hasAccess } = await checkTrainerClientAccess(user.id, clientId);

    if (!hasAccess) {
      return { success: false, error: "Access denied" };
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("trainer_client")
      .update({ active: isActive })
      .eq("trainer", user.id)
      .eq("client", clientId);

    if (error) {
      console.error("Error updating client active status:", error);
      return { success: false, error: "Failed to update client status" };
    }

    // Revalidate relevant paths
    revalidatePath(`/dashboard/clients/${clientId}/settings`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating client active status:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
