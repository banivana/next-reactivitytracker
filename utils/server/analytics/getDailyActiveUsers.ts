import { createClient } from "@supabase/supabase-js";

export async function getDailyActiveUsers(
  days: number = 7,
  trainerId?: string,
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Get date X days ago
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);

  try {
    // Get trainer's client user_ids if trainerId is provided
    let clientUserIds: string[] = [];
    if (trainerId) {
      const { data: trainerClients, error: trainerClientsError } =
        await supabase
          .from("trainer_client")
          .select("client")
          .eq("trainer", trainerId);

      if (trainerClientsError) {
        console.error("Error fetching trainer clients:", trainerClientsError);
      } else {
        clientUserIds = (trainerClients || [])
          .map((tc) => tc.client)
          .filter(Boolean);
      }

      // If trainer has no clients, return empty result
      if (clientUserIds.length === 0) {
        return [];
      }
    }

    const dailyData = [];

    // Get data for each day in the period
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const startOfDayStr = startOfDay.toISOString();
      const endOfDayStr = endOfDay.toISOString();

      // Get unique user_ids from events table for this day
      let eventsQuery = supabase
        .from("events")
        .select("user_id")
        .gte("created_at", startOfDayStr)
        .lte("created_at", endOfDayStr)
        .not("user_id", "is", null);

      if (trainerId && clientUserIds.length > 0) {
        eventsQuery = eventsQuery.in("user_id", clientUserIds);
      }

      const { data: eventsUsers, error: eventsError } = await eventsQuery;

      if (eventsError) {
        console.error("Error fetching events users:", eventsError);
      }

      // Get unique user_ids from notes table for this day
      let notesQuery = supabase
        .from("notes")
        .select("user_id")
        .gte("created_at", startOfDayStr)
        .lte("created_at", endOfDayStr)
        .not("user_id", "is", null);

      if (trainerId && clientUserIds.length > 0) {
        notesQuery = notesQuery.in("user_id", clientUserIds);
      }

      const { data: notesUsers, error: notesError } = await notesQuery;

      if (notesError) {
        console.error("Error fetching notes users:", notesError);
      }

      // Get unique user_ids from health table for this day
      let healthQuery = supabase
        .from("health")
        .select("user_id")
        .gte("created_at", startOfDayStr)
        .lte("created_at", endOfDayStr)
        .not("user_id", "is", null);

      if (trainerId && clientUserIds.length > 0) {
        healthQuery = healthQuery.in("user_id", clientUserIds);
      }

      const { data: healthUsers, error: healthError } = await healthQuery;

      if (healthError) {
        console.error("Error fetching health users:", healthError);
      }

      // Combine all user_ids and get unique count for this day
      const allUserIds = new Set([
        ...(eventsUsers || []).map((u) => u.user_id),
        ...(notesUsers || []).map((u) => u.user_id),
        ...(healthUsers || []).map((u) => u.user_id),
      ]);

      // Remove any null/undefined values
      const uniqueActiveUsers = Array.from(allUserIds).filter(
        (id) => id != null,
      );

      dailyData.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        fullDate: date.toISOString().split("T")[0],
        activeUsers: uniqueActiveUsers.length,
      });
    }

    return dailyData;
  } catch (error) {
    console.error("Error getting daily active users:", error);
    return [];
  }
}
