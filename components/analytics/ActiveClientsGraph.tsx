"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDailyActiveUsersAction } from "@/app/actions/analytics/getDailyActiveUsersAction";
import { useState, useEffect } from "react";

export function ActiveClientsGraph() {
  const [period, setPeriod] = useState<7 | 14 | 30>(7);
  const [data, setData] = useState<
    Array<{ date: string; fullDate: string; activeUsers: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getDailyActiveUsersAction(period);
        setData(result);
      } catch (error) {
        console.error("Error fetching daily active users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Daily Active Clients
        </h3>
        <p className="text-sm text-gray-600">Clients who saved data each day</p>

        <div className="mt-3 flex space-x-2">
          <button
            onClick={() => setPeriod(7)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              period === 7
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            7 days
          </button>
          <button
            onClick={() => setPeriod(14)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              period === 14
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            14 days
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              period === 30
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            30 days
          </button>
        </div>
      </div>
      <div className="h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value) => [`${value} clients`, "Active Clients"]}
              />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
