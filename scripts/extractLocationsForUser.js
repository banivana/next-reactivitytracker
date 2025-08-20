/**
 * This script extracts all unique locations used by a specific user in their triggers (events table)
 * and inserts them into the public.locations table with user_id and label fields.
 *
 * Usage:
 *   node extractLocationsForUser.js <user_id>                    # Dry run (just console log)
 *   node extractLocationsForUser.js <user_id> --commit          # Actually insert to database
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

// Parse command line arguments
const args = process.argv.slice(2);
const userId = args[0];
const commitMode = args.includes("--commit");

if (!userId) {
  console.error("❌ Error: User ID is required");
  console.log("Usage: node extractLocationsForUser.js <user_id> [--commit]");
  console.log(
    "  --commit: Actually perform the database insertions (default is dry-run)"
  );
  process.exit(1);
}

async function extractUserLocations(userId) {
  console.log(`🔍 Processing locations for user: ${userId}`);

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
        `❌ Error fetching locations for user ${userId}:`,
        locationsError.message
      );
      return [];
    }

    if (!locations || locations.length === 0) {
      console.log(`📭 No locations found for user ${userId}`);
      return [];
    }

    // Extract unique locations (filter out duplicates)
    const uniqueLocations = [
      ...new Set(locations.map((l) => l.location).filter(Boolean)),
    ];
    console.log(
      `📍 Found ${uniqueLocations.length} unique locations for user ${userId}:`
    );
    uniqueLocations.forEach((location, index) => {
      console.log(`   ${index + 1}. "${location}"`);
    });

    return uniqueLocations;
  } catch (error) {
    console.error(`💥 Unexpected error processing user ${userId}:`, error);
    return [];
  }
}

async function checkExistingLocations(userId, locations) {
  if (locations.length === 0) {
    return { newLocations: [], existingLocations: [] };
  }

  console.log(`\n🔍 Checking existing locations for user ${userId}...`);

  const newLocations = [];
  const existingLocations = [];

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
          `❌ Error checking existing location for user ${userId}, location "${location}":`,
          checkError.message
        );
        continue;
      }

      if (existingLocation) {
        console.log(`   ✅ "${location}" already exists in locations table`);
        existingLocations.push(location);
      } else {
        console.log(`   🆕 "${location}" is new and will be inserted`);
        newLocations.push(location);
      }
    } catch (error) {
      console.error(
        `💥 Unexpected error checking location "${location}" for user ${userId}:`,
        error
      );
    }
  }

  return { newLocations, existingLocations };
}

async function insertLocationsToTable(userId, locations) {
  if (locations.length === 0) {
    return { success: 0, failed: 0 };
  }

  console.log(
    `\n💾 Inserting ${locations.length} new locations for user ${userId}...`
  );

  let successCount = 0;
  let failedCount = 0;

  for (const location of locations) {
    try {
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
          `   ❌ Error inserting location "${location}":`,
          insertError.message
        );
        failedCount++;
      } else {
        console.log(`   ✅ Successfully inserted location "${location}"`);
        successCount++;
      }
    } catch (error) {
      console.error(
        `   💥 Unexpected error inserting location "${location}":`,
        error
      );
      failedCount++;
    }
  }

  return { success: successCount, failed: failedCount };
}

async function main() {
  console.log("🚀 Starting location extraction process for specific user...");
  console.log(`👤 Target User ID: ${userId}`);
  console.log(
    `🔧 Mode: ${
      commitMode ? "COMMIT (will make changes)" : "DRY RUN (preview only)"
    }`
  );
  console.log("─".repeat(60));

  try {
    // First, verify the user exists
    const { data: user, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError) {
      console.error(`❌ Error fetching user ${userId}:`, userError.message);
      return;
    }

    if (!user) {
      console.error(`❌ User ${userId} not found`);
      return;
    }

    console.log(`✅ User found: ${user.user.email || "No email"}`);

    // Extract locations from events
    const locations = await extractUserLocations(userId);

    if (locations.length === 0) {
      console.log("\n🎉 === PROCESS COMPLETE ===");
      console.log("📊 No locations found for this user");
      console.log("===============================");
      return;
    }

    // Check which locations already exist
    const { newLocations, existingLocations } = await checkExistingLocations(
      userId,
      locations
    );

    // Show summary of what would be done
    console.log("\n📋 === SUMMARY ===");
    console.log(`📍 Total unique locations found: ${locations.length}`);
    console.log(`✅ Already in locations table: ${existingLocations.length}`);
    console.log(`🆕 New locations to insert: ${newLocations.length}`);

    if (newLocations.length > 0) {
      console.log("\n🆕 New locations that would be inserted:");
      newLocations.forEach((location, index) => {
        console.log(`   ${index + 1}. "${location}"`);
      });
    }

    if (existingLocations.length > 0) {
      console.log("\n✅ Existing locations (will be skipped):");
      existingLocations.forEach((location, index) => {
        console.log(`   ${index + 1}. "${location}"`);
      });
    }

    // Perform insertions if in commit mode
    let insertResult = { success: 0, failed: 0 };
    if (commitMode && newLocations.length > 0) {
      insertResult = await insertLocationsToTable(userId, newLocations);
    } else if (!commitMode && newLocations.length > 0) {
      console.log("\n⚠️  DRY RUN MODE: No changes were made to the database");
      console.log("   Run with --commit flag to actually insert the locations");
    }

    // Show final summary
    console.log("\n🎉 === PROCESS COMPLETE ===");
    console.log(`👤 User processed: ${user.user.email || userId}`);
    console.log(`📍 Total locations found: ${locations.length}`);
    console.log(`✅ Already existing: ${existingLocations.length}`);
    console.log(`🆕 New locations: ${newLocations.length}`);
    if (commitMode) {
      console.log(`💾 Successfully inserted: ${insertResult.success}`);
      console.log(`❌ Failed to insert: ${insertResult.failed}`);
    } else {
      console.log(`🔍 Mode: DRY RUN (no changes made)`);
    }
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
