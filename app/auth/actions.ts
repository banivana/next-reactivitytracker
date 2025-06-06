"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

/**
 * Server action for signing out a user
 */
export async function signOut() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );

  await supabase.auth.signOut();
  redirect("/login");
}
