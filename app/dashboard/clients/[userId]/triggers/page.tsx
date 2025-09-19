import { getUser } from "@/utils/server/getUser";
import { checkTrainerClientAccess } from "@/app/hooks/useTrainerClientAccess";
import { createClient } from "@supabase/supabase-js";
import { resolveLocationLabels } from "@/utils/server/resolveLocationLabels";
import TriggersTable from "./TriggersTable";

type Event = {
  id: number;
  created_at: string;
  user_id: string;
  date: string;
  trigger_type: string;
  level_of_reaction: string;
  description: string;
  location: string;
  time_of_day?: string;
};

async function getClientTriggers(userId: string): Promise<Event[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching triggers:", error);
    return [];
  }

  if (!events || events.length === 0) {
    return [];
  }

  // Resolve location UUIDs to labels
  const eventsWithLabels = await resolveLocationLabels(
    events,
    userId,
    supabase as any
  );

  return eventsWithLabels;
}

export default async function ClientTriggersPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const { user } = await getUser();
  const { hasAccess } = await checkTrainerClientAccess(user.id, userId);

  if (!hasAccess) {
    return <div>Error loading client data.</div>;
  }

  const triggers = await getClientTriggers(userId);

  return (
    <div className="pb-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Triggers ({triggers.length})
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Complete history of trigger events and reactions
          </p>
        </div>
        <TriggersTable triggers={triggers} />
      </div>
    </div>
  );
}
