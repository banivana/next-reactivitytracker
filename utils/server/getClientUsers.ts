import { createServerSupabaseClient } from "@/utils/supabase-server";
import { getUser } from "@/utils/server/getUser";

export interface Client {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

export async function getClientUsers() {
  const { user } = await getUser();
  const supabase = await createServerSupabaseClient();

  const { data: clientUsers, error: clientsError } = await supabase
    .from("trainer_client")
    .select("*")
    .eq("trainer", user.id);

  if (clientsError) {
    console.error("Error fetching client relationships:", clientsError);
    return { clients: [], error: clientsError };
  }

  const clients = [];
  for (const client of clientUsers) {
    clients.push({
      id: client.client,
      first_name: client.first_name,
      last_name: client.last_name,
    });
  }

  return { clients, error: null };
}
