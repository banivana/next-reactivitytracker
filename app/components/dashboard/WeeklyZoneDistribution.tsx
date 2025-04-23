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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

// Process an array of triggers to group by week
function processWeeklyTriggers(triggers: Trigger[]) {
  if (triggers.length === 0) return [];

  // Group events by week
  const eventsByWeek = triggers.reduce<Record<string, any>>(
    (weeks, trigger) => {
      // Get the week start date (Sunday) for this trigger
      const triggerDate = new Date(trigger.date);
      const weekStart = new Date(triggerDate);
      weekStart.setDate(triggerDate.getDate() - triggerDate.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          week_start: weekKey,
          week: formatWeekLabel(weekStart), // Can customize label format
          total: 0,
          green: 0,
          yellow: 0,
          red: 0,
        };
      }

      weeks[weekKey].total++;

      const level = trigger.level_of_reaction.toLowerCase();
      if (level.includes("green")) weeks[weekKey].green++;
      else if (level.includes("yellow")) weeks[weekKey].yellow++;
      else if (level.includes("red")) weeks[weekKey].red++;

      return weeks;
    },
    {}
  );

  // Convert to array and sort by week
  return Object.values(eventsByWeek)
    .sort(
      (a: any, b: any) =>
        new Date(a.week_start).getTime() - new Date(b.week_start).getTime()
    )
    .slice(0, 5); // Last 5 weeks
}

// Helper to format week labels
function formatWeekLabel(date) {
  const weekStart = new Date(date);
  const weekEnd = new Date(date);
  weekEnd.setDate(weekStart.getDate() + 6);

  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();

  // Get month name abbreviation
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const startMonth = monthNames[weekStart.getMonth()];
  const endMonth = monthNames[weekEnd.getMonth()];

  // If the week spans two different months
  if (startMonth !== endMonth) {
    return `${startDay} ${startMonth}-${endDay} ${endMonth}`;
  }

  return `${startDay}-${endDay} ${startMonth}`;
}

export default function WeeklyZoneDistribution({
  triggers,
}: {
  triggers: Trigger[];
}) {
  const weeklyData = useMemo(() => processWeeklyTriggers(triggers), [triggers]);

  if (triggers.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Weekly Zone Distribution</CardTitle>
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
