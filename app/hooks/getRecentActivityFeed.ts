import { createClient } from "@supabase/supabase-js";
import { resolveLocationLabels } from "../../utils/server/resolveLocationLabels";

export const FEED_LIMIT = 100; // Fetch more items for the feed

type Event = {
  id: number;
  created_at: string;
  user_id: string;
  date: string;
  trigger_type: string;
  level_of_reaction: string;
  description: string;
  location: string;
};

export type FeedItem = {
  id: number;
  type: "trigger" | "health" | "note";
  created_at: string;
  user_id: string;
  date: string;
  client_name: string;
  content: string;
  level_of_reaction?: string;
  trigger_type?: string;
  location?: string;
};

export type ActivityFeedData = {
  feedItems: FeedItem[];
  error: Error | null;
};

export async function getRecentActivityFeed(
  trainerId: string,
  clientIds: string[],
): Promise<ActivityFeedData> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  let error = null;

  if (clientIds.length === 0) {
    return { feedItems: [], error: null };
  }

  try {
    // Get recent events from all clients
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .in("user_id", clientIds)
      .order("created_at", { ascending: false })
      .limit(50);

    // Get recent health entries from all clients
    const { data: health, error: healthError } = await supabase
      .from("health")
      .select("*")
      .in("user_id", clientIds)
      .order("created_at", { ascending: false })
      .limit(50);

    // Get recent notes from all clients
    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select("*")
      .in("user_id", clientIds)
      .order("created_at", { ascending: false })
      .limit(50);

    // Get client names from trainer_client table
    const { data: clientNames, error: clientNamesError } = await supabase
      .from("trainer_client")
      .select("client, first_name, last_name")
      .eq("trainer", trainerId)
      .in("client", clientIds);

    if (eventsError || healthError || notesError || clientNamesError) {
      console.error("Error fetching feed data:", {
        eventsError,
        healthError,
        notesError,
        clientNamesError,
      });
      error = eventsError || healthError || notesError || clientNamesError;
    }

    // Create a map of client names
    const clientNameMap = new Map<string, string>();
    if (clientNames) {
      clientNames.forEach((client) => {
        const name =
          [client.first_name, client.last_name].filter(Boolean).join(" ")
            .trim() || "Unknown Client";
        clientNameMap.set(client.client, name);
      });
    }

    // Resolve location labels for events if they exist
    const resolvedEventPromises: Promise<Event[]>[] = [];
    if (events && events.length > 0) {
      // Group events by user_id for batch location resolution
      const eventsByUser = new Map<string, Event[]>();
      events.forEach((event) => {
        if (!eventsByUser.has(event.user_id)) {
          eventsByUser.set(event.user_id, []);
        }
        eventsByUser.get(event.user_id)!.push(event);
      });

      // Resolve locations for each user's events
      for (const [userId, userEvents] of eventsByUser) {
        const promise = resolveLocationLabels(
          userEvents,
          userId,
          supabase as any,
        )
          .then((resolved) => resolved || []);
        resolvedEventPromises.push(promise);
      }
    }

    const resolvedEventsArrays = await Promise.all(resolvedEventPromises);
    const allEventsWithLabels = resolvedEventsArrays.flat();

    // Combine all items into feed items
    const feedItems: FeedItem[] = [];

    // Add events
    if (allEventsWithLabels.length > 0) {
      allEventsWithLabels.forEach((event) => {
        feedItems.push({
          id: event.id,
          type: "trigger",
          created_at: event.created_at,
          user_id: event.user_id,
          date: event.date,
          client_name: clientNameMap.get(event.user_id) || "Unknown Client",
          content: event.description,
          level_of_reaction: event.level_of_reaction,
          trigger_type: event.trigger_type,
          location: event.location,
        });
      });
    }

    // Add health entries
    if (health) {
      health.forEach((healthEntry) => {
        feedItems.push({
          id: healthEntry.id,
          type: "health",
          created_at: healthEntry.created_at,
          user_id: healthEntry.user_id,
          date: healthEntry.date,
          client_name: clientNameMap.get(healthEntry.user_id) ||
            "Unknown Client",
          content: healthEntry.description,
        });
      });
    }

    // Add notes
    if (notes) {
      notes.forEach((note) => {
        feedItems.push({
          id: note.id,
          type: "note",
          created_at: note.created_at,
          user_id: note.user_id,
          date: note.date,
          client_name: clientNameMap.get(note.user_id) || "Unknown Client",
          content: note.note_content,
        });
      });
    }

    // Sort all items by created_at, most recent first
    feedItems.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Limit to FEED_LIMIT items
    const limitedFeedItems = feedItems.slice(0, FEED_LIMIT);

    return {
      feedItems: limitedFeedItems,
      error,
    };
  } catch (err) {
    console.error("Error in getRecentActivityFeed:", err);
    return {
      feedItems: [],
      error: err as Error,
    };
  }
}
