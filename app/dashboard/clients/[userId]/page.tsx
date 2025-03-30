import { useUser } from "@/utils/hooks/useUser";
import { createServerSupabaseClient } from "@/utils/supabase-server";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const { user } = await useUser();
  const supabase = await createServerSupabaseClient();

  // Check if the trainer has access to this client
  const { data: relationship, error } = await supabase
    .from("trainer_client")
    .select("*")
    .eq("trainer", user.id)
    .eq("client", userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking trainer-client relationship:", error);
    return <div>Error loading client data. Please try again later.</div>;
  }

  // If no relationship exists, redirect to the clients list
  if (!relationship) {
    return <div>Error loading client data.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Client Profile</h1>
      <div className="bg-white shadow overflow-hidden rounded-lg p-6">
        <h2 className="text-xl mb-4">Client Information</h2>
        <p>
          <strong>Email:</strong>
        </p>
        <p>
          <strong>Name:</strong>
        </p>
      </div>
    </div>
  );
}
