"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useMemo } from "react";

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

type ZoneData = {
  name: string;
  value: number;
  color: string;
  percentage: number;
};

const ZONE_COLORS = {
  green: "hsl(160 60% 45%)",
  yellow: "hsl(43 74% 66%)",
  red: "hsl(12 76% 61%)",
};

export default function ZonesPieChart({ triggers }: { triggers: Trigger[] }) {
  const zoneCounts = useMemo(() => {
    // Count the number of triggers by zone
    const counts = {
      green: 0,
      yellow: 0,
      red: 0,
    };

    for (const trigger of triggers) {
      const level = trigger.level_of_reaction.toLowerCase();
      if (level.includes("green")) {
        counts.green++;
      } else if (level.includes("yellow")) {
        counts.yellow++;
      } else if (level.includes("red")) {
        counts.red++;
      }
    }

    const total = counts.green + counts.yellow + counts.red || 1; // Avoid division by zero

    return [
      {
        name: "Green zone",
        value: counts.green,
        color: ZONE_COLORS.green,
        percentage: Math.round((counts.green / total) * 100),
      },
      {
        name: "Yellow zone",
        value: counts.yellow,
        color: ZONE_COLORS.yellow,
        percentage: Math.round((counts.yellow / total) * 100),
      },
      {
        name: "Red zone",
        value: counts.red,
        color: ZONE_COLORS.red,
        percentage: Math.round((counts.red / total) * 100),
      },
    ] as ZoneData[];
  }, [triggers]);

  const dominantZone = useMemo(() => {
    if (zoneCounts.length === 0) return null;
    return zoneCounts.reduce(
      (max, zone) => (zone.value > max.value ? zone : max),
      zoneCounts[0]
    );
  }, [zoneCounts]);

  if (triggers.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        No trigger data available
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl font-bold"
          >
            <tspan x="50%" dy="-1.0em">
              {dominantZone?.percentage}%
            </tspan>
            <tspan x="50%" dy="1.5em" className="text-base font-medium">
              {dominantZone?.name}
            </tspan>
          </text>
          <Pie
            data={zoneCounts}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {zoneCounts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
