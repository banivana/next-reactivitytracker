"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Trigger = {
  id: number;
  created_at: string;
  user_id: string;
  date: string;
  trigger_type: string;
  level_of_reaction: string;
  description: string;
  location: string;
};

// Custom colors for chart zones
const colors = {
  green: "hsl(160 60% 45%)",
  yellow: "hsl(43 74% 66%)",
  red: "hsl(12 76% 61%)",
};

export default function WeeklyZoneDistribution({
  triggers,
}: {
  triggers: Trigger[];
}) {
  const weeklyData = useMemo(() => {
    // Find the most recent trigger date
    if (triggers.length === 0) return [];

    let mostRecentDate = new Date(0); // Start with epoch time
    for (const trigger of triggers) {
      const triggerDate = new Date(trigger.date);
      if (triggerDate > mostRecentDate) {
        mostRecentDate = triggerDate;
      }
    }

    // Get dates for the last 5 weeks based on the most recent trigger date
    const weekLabels = [];
    const startDates = [];
    const today = new Date();

    for (let i = 4; i >= 0; i--) {
      const date = new Date(mostRecentDate);
      date.setDate(mostRecentDate.getDate() - i * 7);
      const startDate = new Date(date);
      startDate.setDate(date.getDate() - 6);
      startDates.push(startDate);

      // Calculate weeks passed since today
      const weeksPassed = Math.floor(
        (today.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );

      if (weeksPassed === 0) {
        weekLabels.push("This week");
      } else if (weeksPassed === 1) {
        weekLabels.push("1 week ago");
      } else {
        weekLabels.push(`${weeksPassed} weeks ago`);
      }
    }

    // Initialize data structure with counts set to zero
    const weekly = weekLabels.map((week, index) => ({
      week,
      green: 0,
      yellow: 0,
      red: 0,
      startDate: startDates[index],
    }));

    // Count triggers for each week
    for (const trigger of triggers) {
      const triggerDate = new Date(trigger.date);

      for (let i = 0; i < weekly.length; i++) {
        const weekEnd =
          i < weekly.length - 1
            ? weekly[i + 1].startDate
            : new Date(mostRecentDate);
        weekEnd.setDate(weekEnd.getDate() + 1); // Include the end date in the range

        if (triggerDate >= weekly[i].startDate && triggerDate < weekEnd) {
          const level = trigger.level_of_reaction.toLowerCase();
          if (level.includes("green")) {
            weekly[i].green++;
          } else if (level.includes("yellow")) {
            weekly[i].yellow++;
          } else if (level.includes("red")) {
            weekly[i].red++;
          }
          break;
        }
      }
    }

    return weekly;
  }, [triggers]);

  if (triggers.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Weekly Zone Distribution</CardTitle>
          <CardDescription>Last 5 weeks</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="h-[400px] flex items-center justify-center">
            No trigger data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Weekly Zone Distribution</CardTitle>
        <CardDescription>Last 5 weeks</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{
                top: 20,
                right: 0,
                left: -20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="week"
                tickLine={false}
                tickMargin={5}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value, name) => {
                  const nameStr = String(name);
                  return [
                    value,
                    nameStr.charAt(0).toUpperCase() +
                      nameStr.slice(1) +
                      " zone",
                  ];
                }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                }}
              />

              <Bar
                dataKey="green"
                stackId="a"
                fill={colors.green}
                name="Green"
              />
              <Bar
                dataKey="yellow"
                stackId="a"
                fill={colors.yellow}
                name="Yellow"
              />
              <Bar dataKey="red" stackId="a" fill={colors.red} name="Red" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
