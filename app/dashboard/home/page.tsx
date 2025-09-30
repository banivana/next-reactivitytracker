import { getUser } from "@/utils/server/getUser";
import { getClientUsers } from "@/utils/server/getClientUsers";
import { getRecentActivityFeed } from "@/app/hooks/getRecentActivityFeed";
import ActivityFeed from "@/components/ActivityFeed";

export default async function DashboardHomePage() {
  const { user, isTrainer } = await getUser();

  let feedItems = [];

  if (isTrainer) {
    // Get all clients for this trainer
    const { clients, error: clientsError } = await getClientUsers();

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
    <div className="space-y-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main activity feed */}
          <div className="lg:col-span-2">
            <ActivityFeed feedItems={feedItems} />
          </div>

          {/* Side panel for quick stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Activity</span>
                  <span className="font-medium">{feedItems.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Events</span>
                  <span className="font-medium">
                    {feedItems.filter((item) => item.type === "event").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Health Entries</span>
                  <span className="font-medium">
                    {feedItems.filter((item) => item.type === "health").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Notes</span>
                  <span className="font-medium">
                    {feedItems.filter((item) => item.type === "note").length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Summary</h3>
              <div className="text-sm text-gray-600">
                {feedItems.length > 0 ? (
                  <p>
                    Your clients have logged {feedItems.length} items recently.
                    Most recent activity was{" "}
                    {new Date(feedItems[0]?.created_at).toLocaleDateString()}.
                  </p>
                ) : (
                  <p>No recent activity from your clients.</p>
                )}
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
