/**
 * This script extracts all unique locations used by users in their triggers (events table)
 * and inserts them into a new public.locations table with user_id and label fields.
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

async function extractUserLocations(userId) {
  console.log(`Processing locations for user: ${userId}`);

  try {
    // Get distinct locations for this user from events table
    const { data: locations, error: locationsError } = await supabaseAdmin
      .from("events")
      .select("location")
      .eq("user_id", userId)
      .not("location", "is", null)
      .not("location", "eq", ""); // Exclude empty strings

    if (locationsError) {
      console.error(
        `Error fetching locations for user ${userId}:`,
        locationsError.message
      );
      return [];
    }

    if (!locations || locations.length === 0) {
      console.log(`No locations found for user ${userId}`);
      return [];
    }

    // Extract unique locations (filter out duplicates)
    const uniqueLocations = [
      ...new Set(locations.map((l) => l.location).filter(Boolean)),
    ];
    console.log(
      `Found ${
        uniqueLocations.length
      } unique locations for user ${userId}: ${uniqueLocations.join(", ")}`
    );

    return uniqueLocations;
  } catch (error) {
    console.error(`Unexpected error processing user ${userId}:`, error);
    return [];
  }
}

async function insertLocationsToTable(userId, locations) {
  if (locations.length === 0) {
    return { success: 0, failed: 0 };
  }

  console.log(`Inserting ${locations.length} locations for user ${userId}`);

  let successCount = 0;
  let failedCount = 0;

  for (const location of locations) {
    try {
      // Check if this user-location combination already exists
      const { data: existingLocation, error: checkError } = await supabaseAdmin
        .from("locations")
        .select("id")
        .eq("user_id", userId)
        .eq("label", location)
        .maybeSingle();

      if (checkError) {
        console.error(
          `Error checking existing location for user ${userId}, location "${location}":`,
          checkError.message
        );
        failedCount++;
        continue;
      }

      if (existingLocation) {
        console.log(
          `Location "${location}" already exists for user ${userId}. Skipping.`
        );
        successCount++; // Count as success since it's already there
        continue;
      }

      // Insert the new location
      const { error: insertError } = await supabaseAdmin
        .from("locations")
        .insert([
          {
            user_id: userId,
            label: location,
          },
        ]);

      if (insertError) {
        console.error(
          `Error inserting location "${location}" for user ${userId}:`,
          insertError.message
        );
        failedCount++;
      } else {
        console.log(
          `Successfully inserted location "${location}" for user ${userId}`
        );
        successCount++;
      }
    } catch (error) {
      console.error(
        `Unexpected error inserting location "${location}" for user ${userId}:`,
        error
      );
      failedCount++;
    }
  }

  return { success: successCount, failed: failedCount };
}

async function main() {
  console.log("🚀 Starting location extraction process...");

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
    let totalLocationsInserted = 0;
    let totalLocationsFailed = 0;
    let usersWithLocations = 0;

    // Process each user
    for (const user of users.users) {
      console.log(
        `\n--- Processing user ${totalUsersProcessed + 1}/${
          users.users.length
        }: ${user.email} ---`
      );

      const locations = await extractUserLocations(user.id);

      if (locations.length > 0) {
        usersWithLocations++;
        const result = await insertLocationsToTable(user.id, locations);
        totalLocationsInserted += result.success;
        totalLocationsFailed += result.failed;
      }

      totalUsersProcessed++;
    }

    // Show final summary
    console.log("\n🎉 === EXTRACTION COMPLETE ===");
    console.log(`📊 Users processed: ${totalUsersProcessed}`);
    console.log(`👥 Users with locations: ${usersWithLocations}`);
    console.log(
      `✅ Locations successfully inserted: ${totalLocationsInserted}`
    );
    console.log(`❌ Locations failed to insert: ${totalLocationsFailed}`);
    console.log("===============================");
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
