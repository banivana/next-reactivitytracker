/**
 * This script checks the events table for a given user and updates trigger locations
 * from labels to IDs if a matching label exists in the locations table.
 *
 * Usage:
 *   node updateTriggerLocationsToIds.js <user_id>                # Dry run (just console log)
 *   node updateTriggerLocationsToIds.js <user_id> --commit       # Actually update the database
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
  console.log(
    "Usage: node updateTriggerLocationsToIds.js <user_id> [--commit]"
  );
  console.log(
    "  --commit: Actually perform the database updates (default is dry-run)"
  );
  process.exit(1);
}

function isUUID(str) {
  // Simple UUID validation - UUIDs are 36 characters with hyphens in specific positions
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

async function getLocationMappings(userId) {
  console.log(`🔍 Fetching location mappings for user: ${userId}`);

  try {
    // Get all locations for this user from locations table
    const { data: locations, error: locationsError } = await supabaseAdmin
      .from("locations")
      .select("id, label")
      .eq("user_id", userId);

    if (locationsError) {
      console.error(
        `❌ Error fetching locations for user ${userId}:`,
        locationsError.message
      );
      return {};
    }

    if (!locations || locations.length === 0) {
      console.log(
        `📭 No locations found in locations table for user ${userId}`
      );
      return {};
    }

    // Create a mapping from label to id
    const labelToIdMap = {};
    locations.forEach((location) => {
      labelToIdMap[location.label] = location.id;
    });

    console.log(`📍 Found ${locations.length} locations in locations table:`);
    locations.forEach((location, index) => {
      console.log(`   ${index + 1}. "${location.label}" → ${location.id}`);
    });

    return labelToIdMap;
  } catch (error) {
    console.error(
      `💥 Unexpected error fetching locations for user ${userId}:`,
      error
    );
    return {};
  }
}

async function findTriggersWithLabelLocations(userId, labelToIdMap) {
  console.log(
    `\n🔍 Finding triggers with label-based locations for user: ${userId}`
  );

  try {
    // Get all events for this user that have locations
    const { data: events, error: eventsError } = await supabaseAdmin
      .from("events")
      .select("id, location")
      .eq("user_id", userId)
      .not("location", "is", null)
      .not("location", "eq", "");

    if (eventsError) {
      console.error(
        `❌ Error fetching events for user ${userId}:`,
        eventsError.message
      );
      return [];
    }

    if (!events || events.length === 0) {
      console.log(`📭 No events with locations found for user ${userId}`);
      return [];
    }

    console.log(
      `📋 Found ${events.length} events with locations for user ${userId}`
    );

    // Find events that have label-based locations that can be updated
    const updatableEvents = [];
    const labelLocationCount = {};
    const idLocationCount = {};

    events.forEach((event) => {
      const location = event.location;

      if (isUUID(location)) {
        // This is already an ID
        idLocationCount[location] = (idLocationCount[location] || 0) + 1;
      } else {
        // This is a label
        labelLocationCount[location] = (labelLocationCount[location] || 0) + 1;

        // Check if we have a matching location in the locations table
        if (labelToIdMap[location]) {
          updatableEvents.push({
            eventId: event.id,
            currentLocation: location,
            newLocationId: labelToIdMap[location],
          });
        }
      }
    });

    console.log(`\n📊 Location breakdown:`);
    if (Object.keys(idLocationCount).length > 0) {
      console.log(
        `   🔗 Events with ID-based locations: ${Object.values(
          idLocationCount
        ).reduce((a, b) => a + b, 0)}`
      );
      Object.entries(idLocationCount).forEach(([id, count]) => {
        console.log(`      ${id}: ${count} events`);
      });
    }

    if (Object.keys(labelLocationCount).length > 0) {
      console.log(
        `   🏷️  Events with label-based locations: ${Object.values(
          labelLocationCount
        ).reduce((a, b) => a + b, 0)}`
      );
      Object.entries(labelLocationCount).forEach(([label, count]) => {
        const canUpdate = labelToIdMap[label]
          ? "✅ can update"
          : "❌ no matching location";
        console.log(`      "${label}": ${count} events (${canUpdate})`);
      });
    }

    console.log(`\n🔄 Events that can be updated: ${updatableEvents.length}`);
    if (updatableEvents.length > 0) {
      console.log(`📝 Update plan:`);
      const updateGroups = {};
      updatableEvents.forEach((event) => {
        const key = `${event.currentLocation} → ${event.newLocationId}`;
        if (!updateGroups[key]) {
          updateGroups[key] = [];
        }
        updateGroups[key].push(event.eventId);
      });

      Object.entries(updateGroups).forEach(([change, eventIds]) => {
        console.log(`   "${change}": ${eventIds.length} events`);
      });
    }

    return updatableEvents;
  } catch (error) {
    console.error(
      `💥 Unexpected error finding triggers for user ${userId}:`,
      error
    );
    return [];
  }
}

async function updateTriggerLocations(updatableEvents) {
  if (updatableEvents.length === 0) {
    return { success: 0, failed: 0 };
  }

  console.log(`\n💾 Updating ${updatableEvents.length} trigger locations...`);

  let successCount = 0;
  let failedCount = 0;

  for (const event of updatableEvents) {
    try {
      // Update the event's location
      const { error: updateError } = await supabaseAdmin
        .from("events")
        .update({ location: event.newLocationId })
        .eq("id", event.eventId);

      if (updateError) {
        console.error(
          `   ❌ Error updating event ${event.eventId} (${event.currentLocation} → ${event.newLocationId}):`,
          updateError.message
        );
        failedCount++;
      } else {
        console.log(
          `   ✅ Updated event ${event.eventId}: "${event.currentLocation}" → ${event.newLocationId}`
        );
        successCount++;
      }
    } catch (error) {
      console.error(
        `   💥 Unexpected error updating event ${event.eventId}:`,
        error
      );
      failedCount++;
    }
  }

  return { success: successCount, failed: failedCount };
}

async function main() {
  console.log("🚀 Starting trigger location update process...");
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

    // Get location mappings (label → id) for this user
    const labelToIdMap = await getLocationMappings(userId);

    if (Object.keys(labelToIdMap).length === 0) {
      console.log("\n🎉 === PROCESS COMPLETE ===");
      console.log(
        "📊 No locations found in locations table - nothing to update"
      );
      console.log(
        "💡 Tip: Run extractLocationsForUser.js first to populate the locations table"
      );
      console.log("===============================");
      return;
    }

    // Find triggers that have label-based locations that can be updated
    const updatableEvents = await findTriggersWithLabelLocations(
      userId,
      labelToIdMap
    );

    if (updatableEvents.length === 0) {
      console.log("\n🎉 === PROCESS COMPLETE ===");
      console.log(
        "📊 No triggers found with label-based locations that can be updated"
      );
      console.log(
        "✅ All trigger locations are either already IDs or don't have matching labels"
      );
      console.log("===============================");
      return;
    }

    // Show summary of what would be done
    console.log("\n📋 === SUMMARY ===");
    console.log(
      `🔄 Total triggers that can be updated: ${updatableEvents.length}`
    );

    // Perform updates if in commit mode
    let updateResult = { success: 0, failed: 0 };
    if (commitMode) {
      updateResult = await updateTriggerLocations(updatableEvents);
    } else {
      console.log("\n⚠️  DRY RUN MODE: No changes were made to the database");
      console.log(
        "   Run with --commit flag to actually update the trigger locations"
      );
    }

    // Show final summary
    console.log("\n🎉 === PROCESS COMPLETE ===");
    console.log(`👤 User processed: ${user.user.email || userId}`);
    console.log(`🔄 Triggers that could be updated: ${updatableEvents.length}`);
    if (commitMode) {
      console.log(`💾 Successfully updated: ${updateResult.success}`);
      console.log(`❌ Failed to update: ${updateResult.failed}`);
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
