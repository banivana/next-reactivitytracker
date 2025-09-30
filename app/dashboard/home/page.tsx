import { getUser } from "@/utils/server/getUser";
import { getClientUsers } from "@/utils/server/getClientUsers";
import { getRecentActivityFeed } from "@/app/hooks/getRecentActivityFeed";
import ActivityFeed from "@/components/ActivityFeed";

export default async function DashboardHomePage() {
  const { user, isTrainer } = await getUser();

  let feedItems = [];
  let clientCount = 0;

  if (isTrainer) {
    // Get all clients for this trainer
    const { clients, error: clientsError } = await getClientUsers();
    clientCount = clients.length;

    if (!clientsError && clients.length > 0) {
      // Extract client IDs
      const clientIds = clients.map((client) => client.id);

      // Fetch recent activity feed
      const { feedItems: recentItems, error: feedError } =
        await getRecentActivityFeed(user.id, clientIds);

      if (!feedError) {
        feedItems = recentItems;
      } else {
        console.error("Error fetching activity feed:", feedError);
      }
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            {isTrainer
              ? "Monitor your clients' progress and recent activity"
              : "Track your wellness journey"}
          </p>
        </div>
      </div>

      {isTrainer ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main activity feed */}
          <div className="flex-1 lg:flex-[3]">
            <ActivityFeed feedItems={feedItems} />
          </div>

          {/* Plan Details Panel */}
          <div className="flex-1 lg:flex-[2] space-y-6">
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold mb-4">Plan Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Plan</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Premium
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Clients Added</span>
                    <span className="font-medium">{clientCount} / 100</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((clientCount / 100) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {100 - clientCount} clients remaining
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan Status</span>
                    <span className="text-sm font-medium text-green-600">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-lg text-gray-500">
            Client dashboard content coming soon...
          </p>
        </div>
      )}
    </div>
  );
}
