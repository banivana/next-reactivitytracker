/**
 * This script identifies users who have events with location fields that are not UUIDs.
 * It outputs a list of user IDs that need to be processed by the updateEventLocationsToIds.js script.
 *
 * Usage:
 *   node findUsersWithNonUuidLocations.js                    # Find all users with non-UUID locations
 *   node findUsersWithNonUuidLocations.js --json             # Output as JSON array
 *   node findUsersWithNonUuidLocations.js --details          # Show details about each user's non-UUID locations
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
const jsonOutput = args.includes("--json");
const showDetails = args.includes("--details");

function isUUID(str) {
  // Simple UUID validation - UUIDs are 36 characters with hyphens in specific positions
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

async function getUserEmail(userId) {
  try {
    const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(
      userId
    );
    if (error || !user) {
      return null;
    }
    return user.user.email || null;
  } catch {
    return null;
  }
}

async function findUsersWithNonUuidLocations() {
  if (!jsonOutput) {
    console.log(
      "🔍 Searching for users with events that have non-UUID locations..."
    );
    console.log("─".repeat(60));
  }

  try {
    // Get all events with non-null, non-empty locations
    const { data: events, error: eventsError } = await supabaseAdmin
      .from("events")
      .select("user_id, location, date")
      .not("location", "is", null)
      .not("location", "eq", "");

    if (eventsError) {
      console.error("❌ Error fetching events:", eventsError.message);
      process.exit(1);
    }

    if (!events || events.length === 0) {
      if (!jsonOutput) {
        console.log("📭 No events with locations found in the database");
      }
      return [];
    }

    if (!jsonOutput) {
      console.log(`📋 Found ${events.length} events with locations`);
    }

    // Group events by user and analyze locations
    const userAnalysis = new Map();

    for (const event of events) {
      const userId = event.user_id;
      const location = event.location;
      const eventDate = new Date(event.date);

      if (!userAnalysis.has(userId)) {
        userAnalysis.set(userId, {
          totalEvents: 0,
          uuidLocations: 0,
          nonUuidLocations: 0,
          uniqueNonUuidLocations: new Set(),
          email: null,
          lastEventDate: eventDate,
        });
      }

      const analysis = userAnalysis.get(userId);
      analysis.totalEvents++;

      // Update last event date if this event is more recent
      if (eventDate > analysis.lastEventDate) {
        analysis.lastEventDate = eventDate;
      }

      if (isUUID(location)) {
        analysis.uuidLocations++;
      } else {
        analysis.nonUuidLocations++;
        analysis.uniqueNonUuidLocations.add(location);
      }
    }

    if (!jsonOutput) {
      console.log(`👥 Found ${userAnalysis.size} unique users with events`);
    }

    // Filter users who have non-UUID locations and get their emails
    const usersNeedingUpdate = [];

    for (const [userId, analysis] of userAnalysis) {
      if (analysis.nonUuidLocations > 0) {
        if (showDetails || !jsonOutput) {
          analysis.email = await getUserEmail(userId);
        }
        usersNeedingUpdate.push({
          userId,
          email: analysis.email,
          totalEvents: analysis.totalEvents,
          nonUuidLocationCount: analysis.nonUuidLocations,
          uniqueNonUuidLocations: Array.from(analysis.uniqueNonUuidLocations),
          lastEventDate: analysis.lastEventDate,
        });
      }
    }

    // Sort by number of non-UUID locations (descending)
    usersNeedingUpdate.sort(
      (a, b) => b.nonUuidLocationCount - a.nonUuidLocationCount
    );

    if (jsonOutput) {
      // Output just the user IDs as JSON array
      const userIds = usersNeedingUpdate.map((user) => user.userId);
      console.log(JSON.stringify(userIds, null, 2));
    } else {
      console.log("\n🎯 === USERS NEEDING LOCATION UPDATE ===");
      console.log(
        `Found ${usersNeedingUpdate.length} users with non-UUID locations\n`
      );

      if (usersNeedingUpdate.length === 0) {
        console.log("✅ All users already have UUID locations!");
      } else {
        usersNeedingUpdate.forEach((user, index) => {
          console.log(`${index + 1}. User ID: ${user.userId}`);
          if (user.email) {
            console.log(`   Email: ${user.email}`);
          }
          console.log(`   Last event: ${user.lastEventDate.toLocaleDateString()}`);
          console.log(
            `   Events with non-UUID locations: ${user.nonUuidLocationCount}/${user.totalEvents}`
          );

          if (showDetails) {
            console.log(
              `   Unique non-UUID locations (${user.uniqueNonUuidLocations.length}):`
            );
            user.uniqueNonUuidLocations.forEach((location) => {
              console.log(`     - "${location}"`);
            });
          }
          console.log("");
        });

        console.log("📝 User IDs that need processing:");
        const userIds = usersNeedingUpdate.map((user) => user.userId);
        console.log(userIds.join("\n"));

        console.log("\n💡 To process these users, run:");
        console.log("node updateEventLocationsToIds.js --commit");
        console.log("\nOr process individual users:");
        userIds.forEach((userId) => {
          console.log(`node updateEventLocationsToIds.js ${userId} --commit`);
        });
      }
      console.log("===============================");
    }

    return usersNeedingUpdate.map((user) => user.userId);
  } catch (error) {
    console.error("💥 Unexpected error:", error);
    process.exit(1);
  }
}

// Run the script
findUsersWithNonUuidLocations().catch((error) => {
  console.error("💥 Unhandled error:", error);
  process.exit(1);
});
