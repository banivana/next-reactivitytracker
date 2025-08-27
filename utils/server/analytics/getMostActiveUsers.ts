import { createClient } from "@supabase/supabase-js";

export async function getMostActiveUsers(
  limit: number = 10,
  trainerId: string,
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  try {
    // First get trainer's client user_ids
    const { data: trainerClients, error: trainerClientsError } = await supabase
      .from("trainer_client")
      .select("client")
      .eq("trainer", trainerId);

    if (trainerClientsError) {
      console.error("Error fetching trainer clients:", trainerClientsError);
      return [];
    }

    const clientUserIds = (trainerClients || [])
      .map((tc) => tc.client)
      .filter(Boolean);

    // If trainer has no clients, return empty result
    if (clientUserIds.length === 0) {
      return [];
    }

    // Get events for trainer's clients only
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("user_id")
      .in("user_id", clientUserIds)
      .not("user_id", "is", null);

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
    }

    // Get notes for trainer's clients only
    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select("user_id")
      .in("user_id", clientUserIds)
      .not("user_id", "is", null);

    if (notesError) {
      console.error("Error fetching notes:", notesError);
    }

    // Get health entries for trainer's clients only
    const { data: health, error: healthError } = await supabase
      .from("health")
      .select("user_id")
      .in("user_id", clientUserIds)
      .not("user_id", "is", null);

    if (healthError) {
      console.error("Error fetching health:", healthError);
    }

    // Get trainer's clients with their names from profiles
    const { data: clientProfiles, error: profilesError } = await supabase
      .from("trainer_client")
      .select(
        `
        client,
        first_name,
        last_name
      `,
      )
      .eq("trainer", trainerId);

    if (profilesError) {
      console.error("Error fetching client profiles:", profilesError);
    }

    // Also get profile names
    const { data: profiles, error: profileNamesError } = await supabase
      .from("profiles")
      .select("user_id, name")
      .in("user_id", clientUserIds);

    if (profileNamesError) {
      console.error("Error fetching profile names:", profileNamesError);
    }

    // Count activities per user
    const userActivityCounts = new Map<
      string,
      {
        events: number;
        notes: number;
        health: number;
        total: number;
        name?: string;
      }
    >();

    // Count events per user
    for (const event of events || []) {
      if (event.user_id) {
        const current = userActivityCounts.get(event.user_id) || {
          events: 0,
          notes: 0,
          health: 0,
          total: 0,
        };
        current.events++;
        current.total++;
        userActivityCounts.set(event.user_id, current);
      }
    }

    // Count notes per user
    for (const note of notes || []) {
      if (note.user_id) {
        const current = userActivityCounts.get(note.user_id) || {
          events: 0,
          notes: 0,
          health: 0,
          total: 0,
        };
        current.notes++;
        current.total++;
        userActivityCounts.set(note.user_id, current);
      }
    }

    // Count health entries per user
    for (const healthEntry of health || []) {
      if (healthEntry.user_id) {
        const current = userActivityCounts.get(healthEntry.user_id) || {
          events: 0,
          notes: 0,
          health: 0,
          total: 0,
        };
        current.health++;
        current.total++;
        userActivityCounts.set(healthEntry.user_id, current);
      }
    }

    // Add names from trainer_client table (first_name + last_name)
    for (const clientProfile of clientProfiles || []) {
      if (
        clientProfile.client &&
        userActivityCounts.has(clientProfile.client)
      ) {
        const current = userActivityCounts.get(clientProfile.client)!;
        if (clientProfile.first_name || clientProfile.last_name) {
          current.name = `${clientProfile.first_name || ""} ${
            clientProfile.last_name || ""
          }`;
        }
        userActivityCounts.set(clientProfile.client, current);
      }
    }

    // Add names from profiles table (fallback)
    for (const profile of profiles || []) {
      if (profile.user_id && userActivityCounts.has(profile.user_id)) {
        const current = userActivityCounts.get(profile.user_id)!;
        if (!current.name && profile.name) {
          current.name = profile.name;
        }
        userActivityCounts.set(profile.user_id, current);
      }
    }

    // Convert to array and sort by total activity
    const sortedUsers = Array.from(userActivityCounts.entries())
      .map(([userId, stats]) => ({
        userId,
        name: stats.name || `User ${userId}`,
        events: stats.events,
        notes: stats.notes,
        health: stats.health,
        total: stats.total,
        percentage: 0, // Will be calculated after sorting
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);

    // Calculate percentages based on the most active user
    const maxTotal = sortedUsers[0]?.total || 1;
    for (const user of sortedUsers) {
      user.percentage = (user.total / maxTotal) * 100;
    }

    return sortedUsers;
  } catch (error) {
    console.error("Error getting most active users:", error);
    return [];
  }
}
