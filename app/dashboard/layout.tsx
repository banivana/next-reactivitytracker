import { DashboardNav } from "../components/DashboardNav";
import { getUser } from "@/utils/server/getUser";
import { getClientUsers } from "@/utils/server/getClientUsers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getUser();
  const { clients } = await getClientUsers();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
        <DashboardNav clients={clients} />
      </div>

      <div className="pl-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
