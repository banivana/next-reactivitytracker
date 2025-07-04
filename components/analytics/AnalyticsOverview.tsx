import { Card } from "@/components/ui/card";
import { getActiveUsers } from "@/utils/server/analytics/getActiveUsers";
import { getUser } from "@/utils/server/getUser";

export async function AnalyticsOverview() {
  const { user } = await getUser();

  const [activeUsers7Days, activeUsers30Days] = await Promise.all([
    getActiveUsers(7, user.id),
    getActiveUsers(30, user.id),
  ]);

  console.log("Active users data:", {
    activeUsers7Days,
    activeUsers30Days,
  });

  const stats = [
    {
      title: "Active clients (7 days)",
      value: activeUsers7Days.count.toLocaleString(),
    },
    {
      title: "Active clients (30 days)",
      value: activeUsers30Days.count.toLocaleString(),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
