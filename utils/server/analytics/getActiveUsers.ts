import { createClient } from "@/utils/supabase/server";

export async function getActiveUsers(days: number = 30, trainerId: string) {
  const supabase = await createClient();

  // Get date X days ago
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  const daysAgoStr = daysAgo.toISOString();

  try {
    const { data, error } = await supabase.rpc("get_active_users_count", {
      start_date: daysAgoStr,
      trainer_id: trainerId,
    });

    if (error) {
      throw error;
    }

    return {
      count: data,
    };
  } catch (error) {
    console.error("Error getting active users:", error);
    return {
      count: 0,
    };
  }
}
