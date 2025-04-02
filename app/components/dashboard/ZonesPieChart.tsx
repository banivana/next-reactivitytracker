"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Green zone", value: 63, color: "hsl(160 60% 45%)" },
  { name: "Yellow zone", value: 13, color: "hsl(43 74% 66%)" },
  { name: "Red zone", value: 22, color: "hsl(12 76% 61%)" },
];

export default function ZonesPieChart() {
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
              63%
            </tspan>
            <tspan x="50%" dy="1.5em" className="text-base font-medium">
              Green zone
            </tspan>
          </text>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
