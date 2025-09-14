"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

interface AddClientToTrainerParams {
  trainerId: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  platform: "ios" | "android";
}

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function addClientToTrainer({
  trainerId,
  userId,
  firstName,
  lastName,
  platform,
}: AddClientToTrainerParams): Promise<ActionResult> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Double-check that the relationship doesn't already exist
    const { data: existingRelation, error: checkError } = await supabase
      .from("trainer_client")
      .select("id")
      .eq("trainer", trainerId)
      .eq("client", userId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing relation:", checkError);
      return {
        success: false,
        error: "Failed to check existing relationship",
      };
    }

    if (existingRelation) {
      return {
        success: false,
        error: "You are already connected to this trainer",
      };
    }

    // Add the client to the trainer
    const { error: insertError } = await supabase
      .from("trainer_client")
      .insert({
        trainer: trainerId,
        client: userId,
        first_name: firstName,
        last_name: lastName,
      });

    if (insertError) {
      console.error("Error adding client to trainer:", insertError);
      return {
        success: false,
        error: "Failed to add you to the trainer's client list",
      };
    }

    // Update the user's profile with platform information
    if (firstName || lastName) {
      const profileUpdateData: { name?: string; platform?: string } = {
        platform,
      };

      if (firstName && lastName) {
        profileUpdateData.name = `${firstName} ${lastName}`;
      } else if (firstName) {
        profileUpdateData.name = firstName;
      } else if (lastName) {
        profileUpdateData.name = lastName;
      }

      if (profileUpdateData.name) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update(profileUpdateData)
          .eq("user_id", userId);

        if (profileError) {
          console.error("Error updating profile:", profileError);
          // Don't fail the whole operation if profile update fails
        }
      }
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error in addClientToTrainer:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
