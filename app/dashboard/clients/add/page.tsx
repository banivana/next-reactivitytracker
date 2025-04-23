import { createServerSupabaseClient } from "@/utils/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { getUser } from "@/utils/server/getUser";

export default async function AddClientPage() {
  const { user } = await getUser();

  async function addClient(formData: FormData) {
    "use server";

    const clientEmail = formData.get("email") as string;
    if (!clientEmail) return;

    const supabase = await createServerSupabaseClient();

    // First check if the user with this email exists
    const { data: existingUser, error: userLookupError } = await supabase
      .from("profiles")
      .select("user_id, is_trainer")
      .eq("email", clientEmail)
      .single();

    if (userLookupError && userLookupError.code !== "PGRST116") {
      // PGRST116 means no rows returned, which is expected if the user doesn't exist
      console.error("Error looking up user:", userLookupError);
      return;
    }

    if (!existingUser) {
      // TODO: Implement user invitation flow if needed
      return;
    }

    // Check if this user is not a trainer (clients shouldn't be trainers)
    if (existingUser.is_trainer) {
      return; // Trainers can't be clients
    }

    // Check if the relationship already exists
    const { data: existingRelation, error: relationLookupError } =
      await supabase
        .from("trainer_client")
        .select("*")
        .eq("trainer", user.id)
        .eq("client", existingUser.user_id);

    if (relationLookupError) {
      console.error(
        "Error checking for existing relationship:",
        relationLookupError
      );
      return;
    }

    // Only create the relationship if it doesn't exist already
    if (!existingRelation || existingRelation.length === 0) {
      const { error: insertError } = await supabase
        .from("trainer_client")
        .insert({
          trainer: user.id,
          client: existingUser.user_id,
        });

      if (insertError) {
        console.error("Error adding client:", insertError);
        return;
      }
    }

    redirect("/dashboard/clients");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/dashboard/clients">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Clients
          </Link>
        </Button>
      </div>

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Client</h1>

        <form action={addClient} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Client&apos;s Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter client's email address"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
            <p className="mt-2 text-sm text-gray-500">
              The client must already have an account in the system.
            </p>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">
              Add Client
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
