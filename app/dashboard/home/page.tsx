import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { ActiveClientsGraph } from "@/components/analytics/ActiveClientsGraph";
import { MostActiveClients } from "@/components/analytics/MostActiveClients";

export default async function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-600">Client analytics and usage data</p>
      </div>

      <AnalyticsOverview />
      <ActiveClientsGraph />
      <MostActiveClients />
    </div>
  );
}
