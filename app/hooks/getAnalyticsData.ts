import { createClient } from "@supabase/supabase-js";
import { resolveLocationLabels } from "../../utils/server/resolveLocationLabels";

export async function getAnalyticsData(userId: string): Promise<any> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .gte("date", "2025-04-28")
    .lt("date", "2025-05-26");

  if (error || !data) {
    return { data, error };
  }

  const dataWithLocationLabels = await resolveLocationLabels(
    data as any[],
    userId,
    (supabase as unknown) as ReturnType<typeof createClient>,
  );

  return { data: dataWithLocationLabels, error: null };
}
