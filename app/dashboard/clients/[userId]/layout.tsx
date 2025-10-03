import { checkTrainerClientAccess } from "@/app/hooks/useTrainerClientAccess";
import { getUser } from "@/utils/server/getUser";
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
  const { hasAccess } = await checkTrainerClientAccess(user.id, userId);

  if (!hasAccess) {
    return <div>Error loading client data.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <ClientNavigation userId={userId} />

      {children}
    </div>
  );
}
