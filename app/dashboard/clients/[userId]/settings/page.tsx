import { getUser } from "@/utils/server/getUser";
import { checkTrainerClientAccess } from "@/app/hooks/useTrainerClientAccess";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientSettingsForm from "./ClientSettingsForm";

export default async function ClientSettingsPage({
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

  if (!hasAccess || !trainerClientData) {
    return <div>Error: Access denied or client not found.</div>;
  }

  const clientName =
    `${trainerClientData.first_name || ""} ${
      trainerClientData.last_name || ""
    }`.trim() || "Unnamed Client";
  const isActive = trainerClientData.active ?? true;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientSettingsForm
            userId={userId}
            initialFirstName={trainerClientData.first_name || ""}
            initialLastName={trainerClientData.last_name || ""}
            initialActive={isActive}
            clientName={clientName}
          />
        </CardContent>
      </Card>
    </div>
  );
}
