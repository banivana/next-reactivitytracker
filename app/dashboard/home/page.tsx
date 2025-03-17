import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/utils/supabase-server";

export default async function DashboardHomePage() {
  const supabase = createServerSupabaseClient();

  // Get the user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If there's no user, redirect to login
  if (error || !user) {
    redirect("/login");
  }

  // You can fetch additional data from Supabase here
  // For example:
  // const { data: userSettings } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single()
  // const { data: recentActivity } = await supabase.from('activities').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Home</h1>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.email}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This is your dashboard home page. Server-side rendering allows us to
            fetch data before the page loads.
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="font-semibold mb-2">Your Account Details:</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <span className="font-medium">User ID:</span> {user.id}
              </li>
              <li>
                <span className="font-medium">Email:</span> {user.email}
              </li>
              <li>
                <span className="font-medium">Last Sign-in:</span>{" "}
                {new Date(user.last_sign_in_at || "").toLocaleString()}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Example of displaying fetched data - uncomment when you set up the actual tables 
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity && recentActivity.length > 0 ? (
            <ul className="space-y-2">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="p-2 border-b">
                  {activity.description}
                  <span className="text-xs text-gray-500 block">
                    {new Date(activity.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent activity found</p>
          )}
        </CardContent>
      </Card>
      */}
    </div>
  );
}
