import { getUser } from "@/utils/server/getUser";
import { redirect } from "next/navigation";
import AcceptInviteForm from "./AcceptInviteForm";
import { createClient } from "@supabase/supabase-js";

interface PageProps {
  searchParams: Promise<{
    inviteId?: string;
  }>;
}

export default async function AcceptInvitePage({ searchParams }: PageProps) {
  const { inviteId } = await searchParams;

  if (!inviteId) {
    redirect("/dashboard");
  }

  // Get the current logged-in user
  const { user } = await getUser();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: invite, error: inviteError } = await supabase
    .from("invites")
    .select("trainer_id")
    .eq("invite_id", inviteId)
    .single();

  if (inviteError || !invite) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Invalid Invite
          </h1>
          <p className="text-gray-600 mb-6">
            The invite link you followed is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  const trainerId = invite.trainer_id;

  // Check if user is already associated with this trainer
  const { data: existingRelation, error: relationError } = await supabase
    .from("trainer_client")
    .select("*")
    .eq("trainer", trainerId)
    .eq("client", user.id)
    .maybeSingle();

  if (relationError) {
    console.error("Error checking trainer-client relationship:", relationError);
  }

  if (existingRelation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Already Connected
          </h1>
          <p className="text-gray-600 mb-6">
            You are already connected to this trainer.
          </p>
        </div>
      </div>
    );
  }

  // If everything is valid, show the registration form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
      <AcceptInviteForm trainerId={trainerId} userId={user.id} />
    </div>
  );
}
