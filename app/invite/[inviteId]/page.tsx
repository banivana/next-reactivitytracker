import InvitePageClient from "./InvitePageClient";
import { createClient } from "@supabase/supabase-js";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ inviteId: string }>;
}) {
  const { inviteId } = await params;

  // Validate that the invite exists and is not expired
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: invite, error: inviteError } = await supabase
    .from("invites")
    .select("id, trainer_id")
    .eq("invite_id", inviteId)
    .single();

  if (inviteError || !invite) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Invalid or Expired Invite
          </h1>
          <p className="text-gray-600 mb-6">
            The invite link you followed is invalid or has expired. Please
            contact your trainer for a new invite link.
          </p>
        </div>
      </div>
    );
  }

  return <InvitePageClient inviteId={inviteId} />;
}
