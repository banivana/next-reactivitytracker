import { createServerSupabaseClient } from "@/utils/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { getUser } from "@/utils/server/getUser";
import { checkTrainerClientAccess } from "@/app/hooks/useTrainerClientAccess";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const { user } = await getUser();
  const { hasAccess, trainerClientData } = await checkTrainerClientAccess(
    user.id,
    userId
  );

  if (!hasAccess) {
    return <div>Error: You do not have access to edit this client.</div>;
  }

  async function updateClient(formData: FormData) {
    "use server";

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    if (!firstName && !lastName) {
      return;
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("trainer_client")
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .eq("trainer", user.id)
      .eq("client", userId);

    if (error) {
      console.error("Error updating client:", error);
      return;
    }

    redirect(`/dashboard/clients/${userId}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href={`/dashboard/clients/${userId}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Client
          </Link>
        </Button>
      </div>

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Client</h1>

        <form action={updateClient} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              defaultValue={trainerClientData.first_name || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              defaultValue={trainerClientData.last_name || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button type="button" variant="outline" className="flex-1" asChild>
              <Link href={`/dashboard/clients/${userId}`}>Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
