import { createServerSupabaseClient } from "@/utils/supabase-server";
import { useUser } from "@/utils/hooks/useUser";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export default async function ClientsPage() {
  const { user } = await useUser();
  const supabase = await createServerSupabaseClient();
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: clientUsers, error: clientsError } = await supabase
    .from("trainer_client")
    .select("client")
    .eq("trainer", user.id);

  if (clientsError) {
    console.error("Error fetching client relationships:", clientsError);
    return <div>Error loading clients. Please try again later.</div>;
  }

  // Extract the client IDs
  const clientIds = clientUsers?.map((item) => item.client) || [];

  // If there are no clients, show the empty state right away
  if (clientIds.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Clients</h1>
          <Button asChild>
            <Link href="/dashboard/clients/add">
              <Users className="mr-2 h-4 w-4" />
              Add New Client
            </Link>
          </Button>
        </div>

        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium">No clients yet</h3>
          <p className="text-gray-500 mt-2">
            Add your first client to get started.
          </p>
        </div>
      </div>
    );
  }

  // Fetch the profiles for these clients
  const clients = [];
  for (const clientId of clientIds) {
    const client = await supabaseAdmin.auth.admin.getUserById(clientId);
    clients.push(client.data.user);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Clients</h1>
        <Button asChild>
          <Link href="/dashboard/clients/add">
            <Users className="mr-2 h-4 w-4" />
            Add New Client
          </Link>
        </Button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients?.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{client.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
