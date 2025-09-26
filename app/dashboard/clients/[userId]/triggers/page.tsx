import { getUser } from "@/utils/server/getUser";
import { checkTrainerClientAccess } from "@/app/hooks/useTrainerClientAccess";
import { createClient } from "@supabase/supabase-js";
import { resolveLocationLabels } from "@/utils/server/resolveLocationLabels";
import TriggersTable from "./TriggersTable";
import DateRangePicker from "./DateRangePicker";
import { Suspense } from "react";

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

async function getClientTriggers(
  userId: string,
  fromDate?: string,
  toDate?: string
): Promise<Event[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  let query = supabase.from("events").select("*").eq("user_id", userId);

  // Apply date filters if provided
  if (fromDate) {
    query = query.gte("date", fromDate);
  }
  if (toDate) {
    query = query.lte("date", toDate);
  }

  const { data: events, error } = await query.order("created_at", {
    ascending: false,
  });

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
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = await params;
  const { from, to } = await searchParams;
  const { user } = await getUser();
  const { hasAccess } = await checkTrainerClientAccess(user.id, userId);

  if (!hasAccess) {
    return <div>Error loading client data.</div>;
  }

  // Convert search params to strings if they exist
  const fromDate = Array.isArray(from) ? from[0] : from;
  const toDate = Array.isArray(to) ? to[0] : to;

  const triggers = await getClientTriggers(userId, fromDate, toDate);

  // Generate date range description for display
  const getDateRangeText = () => {
    if (fromDate && toDate) {
      return `${new Date(fromDate).toLocaleDateString()} - ${new Date(
        toDate
      ).toLocaleDateString()}`;
    } else if (fromDate) {
      return `From ${new Date(fromDate).toLocaleDateString()}`;
    } else if (toDate) {
      return `Until ${new Date(toDate).toLocaleDateString()}`;
    }
    return "";
  };

  return (
    <div className="pb-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                All Triggers ({triggers.length})
                {getDateRangeText() && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    • {getDateRangeText()}
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Complete history of trigger events and reactions
              </p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <DateRangePicker userId={userId} />
            </Suspense>
          </div>
        </div>
        <TriggersTable triggers={triggers} />
      </div>
    </div>
  );
}
