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

const TRAINER_ID = "b879030d-1a16-4b9c-b05a-988212b99ada";

async function addAllUsersToTrainer() {
  try {
    console.log("🔍 Fetching all users...");

    // Get all users from auth.users
    const { data: users, error: usersError } =
      await supabaseAdmin.auth.admin.listUsers({
        perPage: 1000,
      });

    if (usersError) {
      console.error("❌ Error fetching users:", usersError);
      return;
    }

    console.log(`📊 Found ${users.users.length} total users`);

    // Get existing trainer-client relationships for this trainer
    const { data: existingRelations, error: existingError } =
      await supabaseAdmin
        .from("trainer_client")
        .select("client")
        .eq("trainer", TRAINER_ID);

    if (existingError) {
      console.error("❌ Error fetching existing relations:", existingError);
      return;
    }

    const existingClientIds = new Set(
      existingRelations?.map((r) => r.client) || []
    );
    console.log(
      `📋 Found ${existingClientIds.size} existing client relationships`
    );

    // Filter out users that are already clients of this trainer
    const newUsers = users.users.filter(
      (user) => !existingClientIds.has(user.id)
    );
    console.log(`➕ Adding ${newUsers.length} new users as clients`);

    if (newUsers.length === 0) {
      console.log("✅ All users are already clients of this trainer");
      return;
    }

    // Prepare data for bulk insert
    const relationshipData = newUsers.map((user) => ({
      trainer: TRAINER_ID,
      client: user.id,
      first_name:
        user.user_metadata?.first_name ||
        user.email?.split("@")[0] ||
        "Unknown",
      last_name: user.user_metadata?.last_name || "",
    }));

    // Insert new relationships
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from("trainer_client")
      .insert(relationshipData)
      .select();

    if (insertError) {
      console.error("❌ Error inserting relationships:", insertError);
      return;
    }

    console.log(
      `✅ Successfully added ${insertData.length} users as clients to trainer ${TRAINER_ID}`
    );

    // Show summary
    console.log("\n📈 Summary:");
    console.log(`- Total users: ${users.users.length}`);
    console.log(`- Existing clients: ${existingClientIds.size}`);
    console.log(`- New clients added: ${insertData.length}`);
    console.log(
      `- Total clients now: ${existingClientIds.size + insertData.length}`
    );
  } catch (error) {
    console.error("💥 Unexpected error:", error);
  }
}

// Run the script
addAllUsersToTrainer();
