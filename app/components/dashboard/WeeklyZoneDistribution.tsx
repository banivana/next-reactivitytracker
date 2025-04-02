"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

// Mock data - replaced with count data instead of percentages
const data = [
  {
    week: "5 weeks ago",
    green: 5,
    yellow: 5,
    red: 3,
  },
  {
    week: "4 weeks ago",
    green: 15,
    yellow: 4,
    red: 2,
  },
  {
    week: "3 weeks ago",
    green: 10,
    yellow: 6,
    red: 4,
  },
  {
    week: "2 weeks ago",
    green: 18,
    yellow: 3,
    red: 2,
  },
  {
    week: "1 week ago",
    green: 24,
    yellow: 7,
    red: 3,
  },
];

// Custom colors for chart zones
const colors = {
  green: "hsl(160 60% 45%)",
  yellow: "hsl(43 74% 66%)",
  red: "hsl(12 76% 61%)",
};

export default function WeeklyZoneDistribution() {
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
              data={data}
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
