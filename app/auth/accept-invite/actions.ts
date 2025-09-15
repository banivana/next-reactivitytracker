"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

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

    // Send email notification
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.admin.getUserById(userId);

      const trainerUserRes = await supabase.auth.admin
        .getUserById(trainerId)
        .catch((err) => {
          console.error("Error fetching trainer user:", err);
          return null;
        });

      if (userError) {
        throw new Error("Failed to fetch user for notification.");
      }

      if (user && user.email) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fullName = `${firstName || ""} ${lastName || ""}`.trim();

        await resend.emails.send({
          from: "ReactivityTracker <onboarding@reactivitytracker.com>",
          to: "hello@reactivitytracker.com",
          subject: "New User Registration - App Link Request",
          html: `
            <p>A new user has completed the invite registration and is requesting an app download link.</p>
            <ul>
              <li><strong>Name:</strong> ${fullName}</li>
              <li><strong>Email:</strong> ${user.email}</li>
              <li><strong>Platform:</strong> ${platform}</li>
              <li><strong>Trainer:</strong> ${trainerUserRes?.data?.user?.email}</li>
            </ul>
          `,
        });
      }
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
      // Do not block the main flow if email fails
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
