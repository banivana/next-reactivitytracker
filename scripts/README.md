# Client Name Update Script

This script updates the `first_name` field in the `trainer_client` table based on client email addresses.

## What it does

1. Retrieves all rows from the `trainer_client` table
2. For each client, gets their email address from Supabase Auth
3. Extracts the first part of the email (before the `@` symbol)
4. Updates the `first_name` field with this value

## Setup

1. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

2. Add your Supabase URL and service role key to the `.env` file
   (You can find these in your Supabase project settings)

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the script

```bash
npm start
```

## Notes

- This script requires the Supabase service role key which has admin privileges
- It will log the progress and results in the console
- Only empty `first_name` fields will be updated (existing values will be preserved)

---

## Add Clients to Trainer Script

This script assigns a list of client emails to a specific trainer email in the `trainer_client` table.

### What it does

1.  Takes a predefined trainer email and a list of client emails.
2.  Retrieves the Supabase Auth user IDs for the trainer and each client.
3.  Inserts records into the `trainer_client` table, linking each client ID to the trainer ID.
4.  Handles cases where users might not be found or are already linked.

### Configuration

1.  Open `scripts/addClientsToTrainer.js`.
2.  Modify the `TRAINER_EMAIL` constant with the desired trainer's email.
3.  Update the `CLIENT_EMAILS` array with the emails of the clients to be added.

### Running the script

```bash
node scripts/addClientsToTrainer.js
```

### Notes

- This script requires the Supabase service role key configured in `.env`.
- Ensure the users for the provided emails exist in Supabase Auth.
- The script assumes a `trainer_client` table exists with `trainer_id` and `client_id` columns (likely UUIDs referencing `auth.users.id`).
- It will log progress and results, including skipping duplicate entries.
