import { AppSidebar } from "../components/AppSidebar";
import { getUser } from "@/utils/server/getUser";
import { getClientUsers } from "@/utils/server/getClientUsers";
import { LoadingProgress } from "@/components/LoadingProgress";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isTrainer } = await getUser();
  const { clients } = isTrainer
    ? await getClientUsers()
    : {
        clients: [],
      };

  return (
    <SidebarProvider>
      <LoadingProgress />
      <AppSidebar clients={clients} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
