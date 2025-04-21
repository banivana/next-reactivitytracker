import ClientJournal from "@/app/components/dashboard/ClientJournal";
import ZonesPieChart from "@/app/components/dashboard/ZonesPieChart";
import WeeklyZoneDistribution from "@/app/components/dashboard/WeeklyZoneDistribution";
import { getClientData } from "@/app/hooks/getClientData";
import { checkTrainerClientAccess } from "@/app/hooks/useTrainerClientAccess";
import { getUser } from "@/utils/server/getUser";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default async function Page({
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
    return <div>Error loading client data.</div>;
  }

  const clientData = await getClientData(userId);

  if (clientData.error) {
    return (
      <div className="p-4 text-red-500">
        Error loading client journal. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Clients / {trainerClientData.first_name} {trainerClientData.last_name}
        </h1>
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/clients/${userId}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Client
          </Link>
        </Button>
      </div>

      <nav className="flex gap-4 mb-6">
        <button className="px-4 py-2 rounded-full bg-gray-100 font-medium">
          Home
        </button>
        <button className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100">
          Journal
        </button>
        <button className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100">
          Triggers
        </button>
        <button className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100">
          Health
        </button>
        <button className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100">
          Notes
        </button>
        <button className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100">
          Graphs
        </button>
      </nav>

      <div className="flex gap-6 pb-4">
        {/* Left panel - Journal */}
        <div className="flex-1">
          <ClientJournal days={clientData.days} />
        </div>

        {/* Right panel - Analytics */}
        <div className="flex-1 space-y-4">
          <div className="bg-white shadow overflow-hidden rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium">Zones Distribution</h3>
            <ZonesPieChart triggers={clientData.triggersRes} />
          </div>
          <WeeklyZoneDistribution triggers={clientData.triggersRes} />
        </div>
      </div>
    </div>
  );
}
