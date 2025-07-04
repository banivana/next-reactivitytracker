"use server";

import { getActiveUsers } from "@/utils/server/analytics/getActiveUsers";
import { getUser } from "@/utils/server/getUser";

export async function getActiveUsersAction(days: number) {
  const { user } = await getUser();
  return await getActiveUsers(days, user.id);
}
