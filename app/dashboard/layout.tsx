import { useUser } from "@/utils/hooks/useUser";
import { useClientUsers } from "@/utils/hooks/useClientUsers";
import { DashboardNav } from "../components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await useUser();
  const { clients } = await useClientUsers();

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
