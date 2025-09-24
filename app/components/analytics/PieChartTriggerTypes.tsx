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

    // Count occurrences of each trigger type
    const triggerTypeCount: Record<string, number> = {};

    dataArray.forEach((item: TriggerData) => {
      const triggerType = item.trigger_type.toLowerCase();

      if (triggerTypeCount[triggerType]) {
        triggerTypeCount[triggerType]++;
      } else {
        triggerTypeCount[triggerType] = 1;
      }
    });

    // Convert to pie chart data format
    const pieData = Object.entries(triggerTypeCount)
      .map(([triggerType, count]) => ({
        name: triggerType.charAt(0).toUpperCase() + triggerType.slice(1),
        value: count,
      }))
      .sort((a, b) => b.value - a.value); // Sort by count, largest first

    // Calculate total for percentage display
    const total = pieData.reduce((sum, item) => sum + item.value, 0);

    // Define colors for different trigger types
    const colors = [
      "#8884d8", // Purple
      "#82ca9d", // Green
      "#ffc658", // Yellow
      "#ff7300", // Orange
      "#00ff7f", // Spring green
      "#ff69b4", // Hot pink
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
        text: "Distribution of Trigger Types",
        left: "center",
        top: 20,
      },
      tooltip: {
        trigger: "item",
        formatter: function (params: any) {
          const percentage = ((params.value / total) * 100).toFixed(1);
          return `${params.name}<br/>${params.value} occurrences<br/>${percentage}%`;
        },
      },
      legend: {
        orient: "vertical",
        left: "left",
        top: "middle",
        data: pieData.map((item) => item.name),
      },
      series: [
        {
          name: "Trigger Types",
          type: "pie",
          radius: ["40%", "70%"], // Donut chart (inner and outer radius)
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
              const percentage = ((params.value / total) * 100).toFixed(1);
              return `${params.name}\n${percentage}%`;
            },
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
            itemStyle: {
              shadowBlur: 10,
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
