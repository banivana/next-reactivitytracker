import { createClient } from "@supabase/supabase-js";

export async function getActiveUsers(days: number = 30, trainerId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

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
