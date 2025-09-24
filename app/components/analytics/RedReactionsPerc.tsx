"use client";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface TriggerData {
  id: number;
  created_at: string;
  user_id: string;
  date: string;
  trigger_type: string;
  level_of_reaction: string;
  description: string;
  location: string;
  time_of_day: string | null;
  location_id: string | null;
}

interface AnalyticsData {
  data: TriggerData[];
  error: any;
}

interface ExampleProps {
  analyticsData: AnalyticsData;
}

const Example: React.FC<ExampleProps> = ({ analyticsData }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  console.log("Analytics Data:", analyticsData);

  useEffect(() => {
    // Check if we have data
    if (
      !analyticsData ||
      !analyticsData.data ||
      !Array.isArray(analyticsData.data)
    ) {
      console.log("No valid analytics data");
      return;
    }

    const dataArray: TriggerData[] = analyticsData.data;

    // Count red reactions for each trigger type
    const redReactionCount: Record<string, number> = {};
    let totalRedReactions = 0;

    dataArray.forEach((item: TriggerData) => {
      if (item.level_of_reaction.toLowerCase() === "red") {
        const triggerType = item.trigger_type.toLowerCase();

        if (redReactionCount[triggerType]) {
          redReactionCount[triggerType]++;
        } else {
          redReactionCount[triggerType] = 1;
        }

        totalRedReactions++;
      }
    });

    // Check if there are any red reactions
    if (totalRedReactions === 0) {
      console.log("No red reactions found in the data");
      return;
    }

    // Convert to pie chart data format
    const pieData = Object.entries(redReactionCount)
      .map(([triggerType, count]) => ({
        name: triggerType.charAt(0).toUpperCase() + triggerType.slice(1),
        value: count,
      }))
      .sort((a, b) => b.value - a.value); // Sort by count, largest first

    // Define colors for different trigger types
    const colors = [
      "#ff4d4f", // Red
      "#ff7875", // Light red
      "#ffa39e", // Lighter red
      "#ffccc7", // Pale red
      "#ffd8d8", // Very pale red
      "#ffe0e0", // Almost white red
      "#87ceeb", // Sky blue
      "#dda0dd", // Plum
      "#98fb98", // Pale green
      "#f0e68c", // Khaki
    ];

    // Initialize chart
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      title: {
        text: "Red Reaction Distribution by Trigger Type",
        left: "center",
        top: 20,
      },
      tooltip: {
        trigger: "item",
        formatter: function (params: any) {
          const percentage = ((params.value / totalRedReactions) * 100).toFixed(
            1
          );
          return `${params.name}<br/>${params.value} red reactions<br/>${percentage}% of all red reactions`;
        },
      },
      legend: {
        orient: "vertical",
        left: "left",
        top: "middle",
        data: pieData.map((item) => item.name),
        textStyle: {
          fontSize: 14,
        },
      },
      series: [
        {
          name: "Red Reactions",
          type: "pie",
          radius: ["40%", "70%"], // Donut chart
          center: ["60%", "50%"], // Move center to right for legend space
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
            formatter: function (params: any) {
              const percentage = (
                (params.value / totalRedReactions) *
                100
              ).toFixed(1);
              return `${percentage}%\n${params.value}`;
            },
            fontSize: 14,
            fontWeight: "bold",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
            itemStyle: {
              shadowBlur: 15,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          data: pieData,
          color: colors,
        },
      ],
    };

    myChart.setOption(option);

    // Handle window resize
    const handleResize = (): void => {
      myChart.resize();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, [analyticsData]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "500px",
        minHeight: "400px",
      }}
    />
  );
};

export default Example;
