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
