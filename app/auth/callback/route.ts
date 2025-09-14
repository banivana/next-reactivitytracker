import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const inviteId = searchParams.get("inviteId");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
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
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (inviteId) {
        return NextResponse.redirect(
          `${origin}/auth/accept-invite?inviteId=${inviteId}`,
        );
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const code = formData.get("code").toString();

  if (!code) {
    console.error("No code provided");
    return NextResponse.redirect("reactivitytracker://error", 302);
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.APPLE_CLIENT_ID!,
        client_secret: process.env.APPLE_CLIENT_SECRET!, // JWT signed with Apple key
        code,
        grant_type: "authorization_code",
        redirect_uri: "https://www.reactivitytracker.com/auth/callback",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Apple token exchange failed:", tokenData, tokenResponse);
      return NextResponse.redirect("reactivitytracker://error", 302);
    }

    console.log("success");
    console.log(tokenData);
    return NextResponse.redirect(
      `reactivitytracker://?id_token=${tokenData.id_token}`,
      302,
    );
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return NextResponse.redirect("reactivitytracker://error", 302);
  }
}
