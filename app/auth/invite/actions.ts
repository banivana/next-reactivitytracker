"use server";

import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { getUser } from "@/utils/server/getUser";

interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function createInvite(): Promise<ActionResult> {
  try {
    const { user } = await getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to create an invite",
      };
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Check if user is a trainer
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_trainer")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile?.is_trainer) {
      return {
        success: false,
        error: "Only trainers can create invites",
      };
    }

    // Check if trainer already has an active invite
    const { data: existingInvite, error: checkError } = await supabase
      .from("invites")
      .select("id")
      .eq("trainer_id", user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing invite:", checkError);
      return {
        success: false,
        error: "Failed to check for existing invites",
      };
    }

    if (existingInvite) {
      return {
        success: false,
        error:
          "You already have an active invite. Delete it first to create a new one.",
      };
    }

    // Generate unique invite ID
    const inviteId = nanoid(10); // 10 character ID

    // Create the invite
    const { data: newInvite, error: insertError } = await supabase
      .from("invites")
      .insert({
        invite_id: inviteId,
        trainer_id: user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating invite:", insertError);
      return {
        success: false,
        error: "Failed to create invite",
      };
    }

    // Revalidate the clients page
    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: newInvite,
    };
  } catch (error) {
    console.error("Unexpected error in createInvite:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function deleteInvite(inviteId: string): Promise<ActionResult> {
  try {
    const { user } = await getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to delete an invite",
      };
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Delete the invite (RLS will ensure only the trainer can delete their own invite)
    const { error: deleteError } = await supabase
      .from("invites")
      .delete()
      .eq("invite_id", inviteId)
      .eq("trainer_id", user.id);

    if (deleteError) {
      console.error("Error deleting invite:", deleteError);
      return {
        success: false,
        error: "Failed to delete invite",
      };
    }

    // Revalidate the clients page
    revalidatePath("/dashboard/clients");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error in deleteInvite:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function getTrainerInvite(): Promise<ActionResult> {
  try {
    const { user } = await getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to view invites",
      };
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Get the trainer's active invite
    const { data: invite, error: inviteError } = await supabase
      .from("invites")
      .select("*")
      .eq("trainer_id", user.id)
      .maybeSingle();

    if (inviteError) {
      console.error("Error fetching invite:", inviteError);
      return {
        success: false,
        error: "Failed to fetch invite",
      };
    }

    return {
      success: true,
      data: invite,
    };
  } catch (error) {
    console.error("Unexpected error in getTrainerInvite:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
