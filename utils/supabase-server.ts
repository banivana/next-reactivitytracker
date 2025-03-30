import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // This is used for server action and route handlers
          // but not needed for server components
        },
        remove(name: string, options: CookieOptions) {
          // This is used for server action and route handlers
          // but not needed for server components
        },
      },
    },
  );
}
