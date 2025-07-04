import { createClient } from "@/utils/supabase/server";

export async function getActiveUsers(days: number = 30, trainerId?: string) {
  const supabase = await createClient();

  // Get date X days ago
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  const daysAgoStr = daysAgo.toISOString();

  try {
    // Get trainer's client user_ids if trainerId is provided
    let clientUserIds: string[] = [];
    if (trainerId) {
      const { data: trainerClients, error: trainerClientsError } = await supabase
        .from("trainer_client")
        .select("client")
        .eq("trainer", trainerId);

      if (trainerClientsError) {
        console.error("Error fetching trainer clients:", trainerClientsError);
      } else {
        clientUserIds = (trainerClients || []).map(tc => tc.client).filter(Boolean);
      }

      // If trainer has no clients, return empty result
      if (clientUserIds.length === 0) {
        return {
          count: 0,
          userIds: [],
        };
      }
    }

    // Get unique user_ids from events table in last X days
    let eventsQuery = supabase
      .from("events")
      .select("user_id")
      .gte("created_at", daysAgoStr)
      .not("user_id", "is", null);

    if (trainerId && clientUserIds.length > 0) {
      eventsQuery = eventsQuery.in("user_id", clientUserIds);
    }

    const { data: eventsUsers, error: eventsError } = await eventsQuery;

    console.log({ eventsUsers, eventsError });
    if (eventsError) {
      console.error("Error fetching events users:", eventsError);
    }

    // Get unique user_ids from notes table in last X days
    let notesQuery = supabase
      .from("notes")
      .select("user_id")
      .gte("created_at", daysAgoStr)
      .not("user_id", "is", null);

    if (trainerId && clientUserIds.length > 0) {
      notesQuery = notesQuery.in("user_id", clientUserIds);
    }

    const { data: notesUsers, error: notesError } = await notesQuery;

    if (notesError) {
      console.error("Error fetching notes users:", notesError);
    }

    // Get unique user_ids from health table in last X days
    let healthQuery = supabase
      .from("health")
      .select("user_id")
      .gte("created_at", daysAgoStr)
      .not("user_id", "is", null);

    if (trainerId && clientUserIds.length > 0) {
      healthQuery = healthQuery.in("user_id", clientUserIds);
    }

    const { data: healthUsers, error: healthError } = await healthQuery;

    if (healthError) {
      console.error("Error fetching health users:", healthError);
    }

    // Combine all user_ids and get unique count
    const allUserIds = new Set([
      ...(eventsUsers || []).map((u) => u.user_id),
      ...(notesUsers || []).map((u) => u.user_id),
      ...(healthUsers || []).map((u) => u.user_id),
    ]);

    // Remove any null/undefined values
    const uniqueActiveUsers = Array.from(allUserIds).filter((id) => id != null);

    return {
      count: uniqueActiveUsers.length,
      userIds: uniqueActiveUsers,
    };
  } catch (error) {
    console.error("Error getting active users:", error);
    return {
      count: 0,
      userIds: [],
    };
  }
}
