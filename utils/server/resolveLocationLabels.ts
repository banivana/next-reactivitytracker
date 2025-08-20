import { createClient } from "@supabase/supabase-js";

type EventWithLocationId = {
  id: number;
  created_at: string;
  user_id: string;
  date: string;
  trigger_type: string;
  level_of_reaction: string;
  description: string;
  location: string; // This is now a UUID
  time_of_day?: string;
};

type EventWithLocationLabel = {
  id: number;
  created_at: string;
  user_id: string;
  date: string;
  trigger_type: string;
  level_of_reaction: string;
  description: string;
  location: string; // This will be the location label
  time_of_day?: string;
};

/**
 * Utility function to resolve location UUIDs to location labels
 * @param events - Array of events with location UUIDs
 * @param userId - User ID to get locations for
 * @param supabase - Supabase client instance
 * @returns Array of events with location labels
 */
export async function resolveLocationLabels(
  events: EventWithLocationId[],
  userId: string,
  supabase: ReturnType<typeof createClient>,
): Promise<EventWithLocationLabel[]> {
  if (!events || events.length === 0) {
    return [];
  }

  const { data: locations, error } = await supabase
    .from("locations")
    .select("id, label")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching location labels:", error);
    return events as EventWithLocationLabel[];
  }

  const locationMap = new Map<string, string>();
  for (const location of locations || []) {
    locationMap.set(location.id as string, location.label as string);
  }

  return events.map((event) => ({
    ...event,
    location: locationMap.get(event.location) || event.location,
  }));
}
