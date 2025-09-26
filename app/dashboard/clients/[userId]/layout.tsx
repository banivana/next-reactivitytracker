import { checkTrainerClientAccess } from "@/app/hooks/useTrainerClientAccess";
import { getUser } from "@/utils/server/getUser";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ReactNode } from "react";
import ClientNavigation from "./ClientNavigation";

interface ClientLayoutProps {
  children: ReactNode;
  params: Promise<{ userId: string }>;
}

export default async function ClientLayout({
  children,
  params,
}: ClientLayoutProps) {
  const { userId } = await params;
  const { user } = await getUser();
  const { hasAccess, trainerClientData } = await checkTrainerClientAccess(
    user.id,
    userId
  );

  if (!hasAccess) {
    return <div>Error loading client data.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {trainerClientData.first_name} {trainerClientData.last_name}
        </h1>
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/clients/${userId}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Client
          </Link>
        </Button>
      </div>

      <ClientNavigation userId={userId} />

      {children}
    </div>
  );
}
