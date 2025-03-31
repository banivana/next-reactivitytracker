import { useUser } from "@/utils/hooks/useUser";
import { createServerSupabaseClient } from "@/utils/supabase-server";
import ClientJournal from "@/app/components/dashboard/ClientJournal";
import { createClient } from "@supabase/supabase-js";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const { user } = await useUser();
  const supabase = await createServerSupabaseClient();

  // Create admin client for user lookups
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Check if the trainer has access to this client
  const { data: relationship, error } = await supabase
    .from("trainer_client")
    .select("*")
    .eq("trainer", user.id)
    .eq("client", userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking trainer-client relationship:", error);
    return <div>Error loading client data. Please try again later.</div>;
  }

  // If no relationship exists, redirect to the clients list
  if (!relationship) {
    return <div>Error loading client data.</div>;
  }

  // Get client email for display
  const { data: clientData } = await supabaseAdmin.auth.admin.getUserById(
    userId
  );
  const clientEmail = clientData?.user?.email || "Unknown";

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients / {clientEmail}</h1>
      </div>

      <nav className="flex gap-4 mb-6">
        <button className="px-4 py-2 rounded-full bg-gray-100 font-medium">
          Home
        </button>
        <button className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100">
          Triggers
        </button>
        <button className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100">
          Health
        </button>
        <button className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100">
          Notes
        </button>
        <button className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100">
          Graphs
        </button>
      </nav>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Left panel - Journal */}
        <div className="flex-1 bg-white shadow overflow-hidden rounded-lg">
          <div className="h-full overflow-y-auto">
            <ClientJournal userId={userId} />
          </div>
        </div>

        {/* Right panel - Placeholder */}
        <div className="flex-1 bg-white shadow overflow-hidden rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <p className="text-gray-500">Coming soon!</p>
        </div>
      </div>
    </div>
  );
}
