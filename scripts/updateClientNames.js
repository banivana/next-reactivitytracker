/**
 * This script updates the first_name field in the trainer_client table
 * by extracting the username part from the email addresses of clients.
 */

// Load environment variables
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with admin privileges
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function updateClientNames() {
  console.log("Starting to update client names...");

  try {
    // Step 1: Get all rows from trainer_client table where first_name is null or empty
    const { data: clients, error: clientError } = await supabaseAdmin
      .from("trainer_client")
      .select("client, first_name, last_name")
      .or("first_name.is.null,first_name.eq.");

    if (clientError) {
      throw new Error(`Error fetching clients: ${clientError.message}`);
    }

    console.log(
      `Found ${clients.length} client relationships with empty first names`
    );

    // Step 2: Process each client
    let updatedCount = 0;
    let errorCount = 0;

    for (const client of clients) {
      try {
        // Step 3: Get the user information (email) from auth.users
        const { data: userData, error: userError } =
          await supabaseAdmin.auth.admin.getUserById(client.client);

        if (userError) {
          console.error(
            `Error fetching user ${client.client}: ${userError.message}`
          );
          errorCount++;
          continue;
        }

        const email = userData.user.email;
        if (!email) {
          console.warn(`No email found for user ${client.client}`);
          continue;
        }

        // Step 4: Extract the first part of the email (before @)
        const firstName = email.split("@")[0];

        // Step 5: Update the first_name field in the trainer_client table
        const { error: updateError } = await supabaseAdmin
          .from("trainer_client")
          .update({ first_name: firstName })
          .eq("client", client.client);

        if (updateError) {
          console.error(
            `Error updating client ${client.client}: ${updateError.message}`
          );
          errorCount++;
        } else {
          console.log(`Updated ${client.client} with first_name: ${firstName}`);
          updatedCount++;
        }
      } catch (error) {
        console.error(
          `Error processing client ${client.client}: ${error.message}`
        );
        errorCount++;
      }
    }

    console.log(`
Update complete:
- Total clients with empty first names: ${clients.length}
- Successfully updated: ${updatedCount}
- Errors: ${errorCount}
    `);
  } catch (error) {
    console.error("Error in update process:", error);
  }
}

// Run the script
updateClientNames()
  .then(() => console.log("Script execution complete"))
  .catch((err) => console.error("Script execution failed:", err))
  .finally(() => process.exit());
