/**
 * This script checks if all users have a corresponding row in the public.profiles table.
 * If a user doesn't have a profile, it creates one with their user_id and default triggers.
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the .env file"
  );
  process.exit(1);
}

// Initialize Supabase client with service role privileges
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Default triggers configuration
const DEFAULT_TRIGGERS = [
  { trigger: "dog", icon: { fa6: "dog" } },
  { trigger: "stranger", icon: { fa6: "person" } },
  { trigger: "bike", icon: { fa6: "person-biking" } },
];

async function checkUserProfile(userId) {
  console.log(`Checking profile for user: ${userId}`);

  try {
    // Check if user already has a profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("triggers")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      console.error(
        `Error checking profile for user ${userId}:`,
        profileError.message
      );
      return { exists: false, error: profileError.message };
    }

    if (profile) {
      console.log(`Profile already exists for user ${userId}`);
      return { exists: true, error: null };
    }

    console.log(`No profile found for user ${userId}, will create one`);
    return { exists: false, error: null };
  } catch (error) {
    console.error(
      `Unexpected error checking profile for user ${userId}:`,
      error
    );
    return { exists: false, error: error.message };
  }
}

async function createUserProfile(userId) {
  console.log(`Creating profile for user: ${userId}`);

  try {
    // Insert new profile with default triggers
    const { error: insertError } = await supabaseAdmin.from("profiles").insert([
      {
        user_id: userId,
        triggers: DEFAULT_TRIGGERS,
      },
    ]);

    if (insertError) {
      console.error(
        `Error creating profile for user ${userId}:`,
        insertError.message
      );
      return { success: false, error: insertError.message };
    }

    console.log(`Successfully created profile for user ${userId}`);
    return { success: true, error: null };
  } catch (error) {
    console.error(
      `Unexpected error creating profile for user ${userId}:`,
      error
    );
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log("🚀 Starting user profile creation process...");

  try {
    // Get all users from auth.users
    console.log("📋 Fetching all users...");
    const { data: users, error: usersError } =
      await supabaseAdmin.auth.admin.listUsers({
        perPage: 1000, // Adjust if you have more than 1000 users
      });

    if (usersError) {
      console.error("❌ Error fetching users:", usersError);
      return;
    }

    console.log(`📊 Found ${users.users.length} total users`);

    let totalUsersProcessed = 0;
    let profilesAlreadyExist = 0;
    let profilesCreated = 0;
    let profilesFailedToCreate = 0;

    // Process each user
    for (const user of users.users) {
      console.log(
        `\n--- Processing user ${totalUsersProcessed + 1}/${
          users.users.length
        }: ${user.email} ---`
      );

      // Check if profile exists
      const profileCheck = await checkUserProfile(user.id);

      if (profileCheck.error) {
        console.error(`Failed to check profile for user ${user.id}`);
        profilesFailedToCreate++;
      } else if (profileCheck.exists) {
        profilesAlreadyExist++;
      } else {
        // Create profile
        const createResult = await createUserProfile(user.id);

        if (createResult.success) {
          profilesCreated++;
        } else {
          profilesFailedToCreate++;
        }
      }

      totalUsersProcessed++;
    }

    // Show final summary
    console.log("\n🎉 === PROFILE CREATION COMPLETE ===");
    console.log(`📊 Users processed: ${totalUsersProcessed}`);
    console.log(`✅ Profiles already existed: ${profilesAlreadyExist}`);
    console.log(`🆕 Profiles created: ${profilesCreated}`);
    console.log(`❌ Profiles failed to create: ${profilesFailedToCreate}`);
    console.log("=====================================");
  } catch (error) {
    console.error("💥 Unexpected error in main function:", error);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error("💥 Unhandled error:", error);
  process.exit(1);
});
