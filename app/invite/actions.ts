"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function setInviteIdCookie(inviteId: string) {
  const cookieStore = await cookies();
  
  // Set secure session cookie that expires in 24 hours
  cookieStore.set("inviteId", inviteId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export async function getInviteIdCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("inviteId")?.value || null;
}

export async function clearInviteIdCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("inviteId");
}

export async function processInvite(inviteId: string) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error getting user:", userError);
    return { success: false, error: "User not authenticated" };
  }

  try {
    // Here you would implement the logic to connect the user with the trainer
    // This depends on your database schema. For example:
    
    // 1. Find the trainer who created this invite
    // 2. Create a trainer-client relationship in your database
    // 3. You might have tables like 'invites', 'trainer_clients', etc.
    
    console.log(`Processing invite ${inviteId} for user ${user.id}`);
    
    // Example implementation (adjust based on your schema):
    // const { error: inviteError } = await supabase
    //   .from('trainer_clients')
    //   .insert({
    //     trainer_id: trainerIdFromInvite,
    //     client_id: user.id,
    //     invite_id: inviteId,
    //     created_at: new Date().toISOString()
    //   });

    // Clear the invite cookie after processing
    await clearInviteIdCookie();
    
    return { success: true, message: "Invite processed successfully" };
  } catch (error) {
    console.error("Error processing invite:", error);
    return { success: false, error: "Failed to process invite" };
  }
}
