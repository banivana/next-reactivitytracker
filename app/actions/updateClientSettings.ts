"use server";

import { createServerSupabaseClient } from "@/utils/supabase-server";
import { getUser } from "@/utils/server/getUser";
import { checkTrainerClientAccess } from "@/app/hooks/useTrainerClientAccess";
import { revalidatePath } from "next/cache";

export async function updateClientSettings(
  clientId: string,
  firstName: string,
  lastName: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await getUser();
    const { hasAccess } = await checkTrainerClientAccess(user.id, clientId);

    if (!hasAccess) {
      return { success: false, error: "Access denied" };
    }

    if (!firstName.trim() && !lastName.trim()) {
      return { success: false, error: "At least one name field is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("trainer_client")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        active: isActive,
      })
      .eq("trainer", user.id)
      .eq("client", clientId);

    if (error) {
      console.error("Error updating client settings:", error);
      return { success: false, error: "Failed to update client settings" };
    }

    // Revalidate relevant paths
    revalidatePath(`/dashboard/clients/${clientId}/settings`);
    revalidatePath(`/dashboard/clients/${clientId}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating client settings:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
