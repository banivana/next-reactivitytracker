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

    // Count occurrences of each reaction level
    const reactionCount: Record<string, number> = {
      green: 0,
      yellow: 0,
      red: 0,
    };

    dataArray.forEach((item: TriggerData) => {
      const reactionLevel = item.level_of_reaction.toLowerCase();

      if (reactionLevel === "green") {
        reactionCount.green++;
      } else if (reactionLevel === "yellow") {
        reactionCount.yellow++;
      } else if (reactionLevel === "red") {
        reactionCount.red++;
      }
    });

    // Convert to donut chart data format
    const donutData = [
      {
        name: "Green",
        value: reactionCount.green,
        itemStyle: {
          color: "#52c41a",
        },
      },
      {
        name: "Yellow",
        value: reactionCount.yellow,
        itemStyle: {
          color: "#faad14",
        },
      },
      {
        name: "Red",
        value: reactionCount.red,
        itemStyle: {
          color: "#ff4d4f",
        },
      },
    ].filter((item) => item.value > 0); // Only show reaction levels that exist

    // Calculate total for percentage display
    const total = donutData.reduce((sum, item) => sum + item.value, 0);

    // Initialize chart
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      title: {
        text: "Overall Reaction Level Distribution",
        left: "center",
        top: 20,
      },
      tooltip: {
        trigger: "item",
        formatter: function (params: any) {
          const percentage = ((params.value / total) * 100).toFixed(1);
          return `${params.name} Reactions<br/>${params.value} occurrences<br/>${percentage}% of all reactions`;
        },
      },
      legend: {
        orient: "vertical",
        left: "left",
        top: "middle",
        data: donutData.map((item) => item.name),
        textStyle: {
          fontSize: 14,
        },
      },
      series: [
        {
          name: "Reaction Levels",
          type: "pie",
          radius: ["50%", "80%"], // Donut chart (inner and outer radius)
          center: ["60%", "50%"], // Move center to right to make room for legend
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 3,
          },
          label: {
            show: true,
            position: "outside",
            formatter: function (params: any) {
              const percentage = ((params.value / total) * 100).toFixed(1);
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
          data: donutData,
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
