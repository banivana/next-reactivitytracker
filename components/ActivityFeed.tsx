import Link from "next/link";
import moment from "moment";
import { FeedItem } from "@/app/hooks/getRecentActivityFeed";
import { TriggerIcon } from "@/app/components/dashboard/TriggerIcon";

interface ActivityFeedProps {
  feedItems: FeedItem[];
}

function getTimeAgo(dateString: string): string {
  return moment(dateString).fromNow();
}

function getItemIcon(type: string): string {
  switch (type) {
    case "trigger":
      return "⚡";
    case "health":
      return "❤️";
    case "note":
      return "📝";
    default:
      return "📋";
  }
}

function getItemTypeColor(type: string): string {
  switch (type) {
    case "trigger":
      return "bg-red-100 text-red-800";
    case "health":
      return "bg-green-100 text-green-800";
    case "note":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getReactionColor(level: string): string {
  switch (level) {
    case "1":
      return "text-green-600";
    case "2":
      return "text-yellow-600";
    case "3":
      return "text-orange-600";
    case "4":
      return "text-red-600";
    case "5":
      return "text-red-700";
    default:
      return "text-gray-600";
  }
}

export default function ActivityFeed({ feedItems }: ActivityFeedProps) {
  if (feedItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity from your clients</p>
          <p className="text-sm mt-1">
            When your clients log triggers, health entries, or notes,
            they&apos;ll appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedItems.map((item) => (
        <div
          key={`${item.type}-${item.id}`}
          className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow"
        >
          <Link href={`/dashboard/clients/${item.user_id}`} className="block">
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-lg">
                  {item.type === "trigger" && item.trigger_type ? (
                    <div className="w-5 h-5 flex items-center justify-center">
                      <TriggerIcon
                        triggerType={item.trigger_type}
                        reactionLevel={item.level_of_reaction}
                        size={18}
                      />
                    </div>
                  ) : (
                    getItemIcon(item.type)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.client_name}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getItemTypeColor(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>
                      {item.type === "trigger" && item.level_of_reaction && (
                        <span
                          className={`text-xs font-medium ${getReactionColor(
                            item.level_of_reaction
                          )}`}
                        >
                          Level {item.level_of_reaction}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      {getTimeAgo(item.created_at)}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 overflow-hidden">
                    {item.content}
                  </p>

                  {item.type === "trigger" && (
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      {item.trigger_type && (
                        <div className="flex items-center gap-1">
                          <span>Type: {item.trigger_type}</span>
                        </div>
                      )}
                      {item.location && <span>Location: {item.location}</span>}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
