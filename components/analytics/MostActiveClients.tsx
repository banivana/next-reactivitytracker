import { Card } from "@/components/ui/card";
import { getMostActiveUsers } from "@/utils/server/analytics/getMostActiveUsers";
import { getUser } from "@/utils/server/getUser";

export async function MostActiveClients() {
  const { user } = await getUser();
  const mostActiveClients = await getMostActiveUsers(100, user.id);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Most Active Clients
        </h3>
        <p className="text-sm text-gray-600">
          Clients ranked by total activity (events, notes, health data)
        </p>
      </div>
      <div className="space-y-4">
        {mostActiveClients.map((client, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  #{index + 1}
                </span>
                <p className="text-sm font-medium text-gray-900">{client.name}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${client.percentage}%` }}
                />
              </div>
              <div className="flex gap-4 mt-1 text-xs text-gray-500">
                <span>{client.events} events</span>
                <span>{client.notes} notes</span>
                <span>{client.health} health</span>
              </div>
            </div>
            <div className="ml-4 text-right">
              <p className="text-sm font-medium text-gray-900">
                {client.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">total entries</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
