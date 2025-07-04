"use server";

import { getDailyActiveUsers } from "@/utils/server/analytics/getDailyActiveUsers";
import { getUser } from "@/utils/server/getUser";

export async function getDailyActiveUsersAction(days: number) {
  const { user } = await getUser();
  return await getDailyActiveUsers(days, user.id);
}
