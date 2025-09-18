import ClientJournal from "@/app/components/dashboard/ClientJournal";
import { getClientData } from "@/app/hooks/getClientData";
import { checkTrainerClientAccess } from "@/app/hooks/useTrainerClientAccess";
import { getUser } from "@/utils/server/getUser";

export default async function ClientJournalPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const { user } = await getUser();
  const { hasAccess } = await checkTrainerClientAccess(user.id, userId);

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
    <div className="pb-4">
      <ClientJournal userId={userId} initialData={clientData} />
    </div>
  );
}
