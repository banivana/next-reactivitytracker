import { createServerSupabaseClient } from "@/utils/supabase-server";
import { useUser } from "@/utils/hooks/useUser";
import { createClient } from "@supabase/supabase-js";

export interface Client {
  id: string;
  email: string;
  displayName: string;
}

export async function useClientUsers() {
  const { user } = await useUser();
  const supabase = await createServerSupabaseClient();
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: clientUsers, error: clientsError } = await supabase
    .from("trainer_client")
    .select("client")
    .eq("trainer", user.id);

  if (clientsError) {
    console.error("Error fetching client relationships:", clientsError);
    return { clients: [], error: clientsError };
  }

  const clientIds = clientUsers?.map((item) => item.client) || [];

  // Fetch the profiles for these clients
  const clients = [];
  for (const clientId of clientIds) {
    const client = await supabaseAdmin.auth.admin.getUserById(clientId);
    const userData = client.data.user;

    const displayName =
      userData.user_metadata?.first_name && userData.user_metadata?.last_name
        ? `${userData.user_metadata.first_name} ${userData.user_metadata.last_name}`
        : userData.email?.split("@")[0] || "Unknown User";

    clients.push({
      ...userData,
      displayName,
    });
  }

  return { clients, error: null };
}
