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

// --- Configuration ---
const TRAINER_ID = "f00ac3b7-6dde-42d0-853f-5599e2fd37d6";
const CLIENT_IDS = [
  "142e9bb9-25db-47d0-afd6-ea70fdfa8bcd", // Replace with actual client emails
  "e7e46c13-0163-4d42-89dc-964cc16f090b",
  "d850004d-e5fa-4072-a2ed-6a6a5568d140",
  "ffe483a7-d623-49e1-ab01-1664530e358b",
  "a1ce7900-ba91-4816-a262-fb03386010b3",
  "407140f2-a819-4556-85d3-ecde5618aea6",
  "e6623b97-bf93-4728-93db-f544bebf9f97",
  "3e7d5282-469c-4bb7-8ced-169f739d1818",
  "897476d5-7c19-40bb-a7af-d4a77a85bfc7",
  "16bc0481-a168-453b-8f5c-7df65f72905c",
  "0d3e3fba-5362-460a-b7c8-5a53b0a763d4",
  "3466bb40-d9ae-4238-9442-c305bdcfaba1",
  "7afd307a-b9bb-4b4d-ae2e-4e3c791f72a0",
];
// ---------------------

async function addClientToTrainer(clientId, email) {
  console.log(`Attempting to add client ${clientId} to trainer ${TRAINER_ID}`);

  // 1. Check if the relationship already exists
  const { data: existingRelation, error: checkError } = await supabaseAdmin
    .from("trainer_client")
    .select("id") // Select a minimal field to check existence
    .eq("trainer", TRAINER_ID)
    .eq("client", clientId)
    .maybeSingle(); // Use maybeSingle to get one or null

  if (checkError) {
    console.error(
      `Error checking existing relationship for client ${clientId} and trainer ${TRAINER_ID}:`,
      checkError.message
    );
    return false; // Indicate failure due to check error
  }

  if (existingRelation) {
    console.warn(
      `Client ${clientId} already assigned to trainer ${TRAINER_ID}. Skipping.`
    );
    return true; // Indicate success (or skipped status) as it's already assigned
  }

  // 2. If not exists, attempt to insert
  const { error: insertError } = await supabaseAdmin
    .from("trainer_client")
    .insert([
      {
        trainer: TRAINER_ID,
        client: clientId,
        first_name: email.split("@")[0], // Consider fetching/using actual first name if available
      },
    ])
    .select(); // Keep select() if you need the inserted data, otherwise remove

  if (insertError) {
    // This error handling might become less critical if the check above works,
    // but keep it for other potential insert errors.
    console.error(
      `Error adding client ${clientId} to trainer ${TRAINER_ID}:`,
      insertError.message
    );
    return false;
  }

  console.log(
    `Successfully added client ${clientId} to trainer ${TRAINER_ID}.`
  );
  return true;
}

async function main() {
  console.log(`Processing ${CLIENT_IDS.length} client ids...`);

  let successCount = 0;
  let failCount = 0;

  for (const clientId of CLIENT_IDS) {
    const client = await supabaseAdmin.auth.admin.getUserById(clientId);
    if (!client) {
      console.warn(`Could not find client with id: ${clientId}`);
      failCount++;
      continue;
    }
    console.log(`\nProcessing client: ${client.data.user.email}`);

    const success = await addClientToTrainer(clientId, client.data.user.email);
    if (success) {
      successCount++;
    } else {
      failCount++; // Increment fail count if insertion failed (excluding duplicates)
    }
  }

  console.log("\n--- Script Finished ---");
  console.log(`Successfully added ${successCount} clients.`);
  console.log(
    `Failed to process/add ${failCount} clients (due to missing users or DB errors).`
  );
  console.log("-----------------------");
}

main().catch((error) => {
  console.error("Unhandled error in main function:", error);
  process.exit(1);
});
