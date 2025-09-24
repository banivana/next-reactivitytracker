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

interface TriggerTypeData {
  green: number;
  yellow: number;
  red: number;
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

    // Group data by trigger type and count reactions by level
    const triggerTypeCount: Record<string, TriggerTypeData> = {};

    dataArray.forEach((item: TriggerData) => {
      const triggerType = item.trigger_type.toLowerCase();
      const reactionLevel = item.level_of_reaction.toLowerCase();

      if (!triggerTypeCount[triggerType]) {
        triggerTypeCount[triggerType] = {
          green: 0,
          yellow: 0,
          red: 0,
        };
      }

      // Increment the appropriate reaction level counter
      if (reactionLevel === "green") {
        triggerTypeCount[triggerType].green++;
      } else if (reactionLevel === "yellow") {
        triggerTypeCount[triggerType].yellow++;
      } else if (reactionLevel === "red") {
        triggerTypeCount[triggerType].red++;
      }
    });

    // Convert to arrays and sort alphabetically by trigger type
    const sortedEntries = Object.entries(triggerTypeCount).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    const triggerTypeLabels: string[] = sortedEntries.map(
      ([triggerType]) =>
        triggerType.charAt(0).toUpperCase() + triggerType.slice(1) // Capitalize first letter
    );

    // Get actual counts for each trigger type
    const greenCounts: number[] = sortedEntries.map(([, data]) => data.green);
    const yellowCounts: number[] = sortedEntries.map(([, data]) => data.yellow);
    const redCounts: number[] = sortedEntries.map(([, data]) => data.red);

    // Initialize chart
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      title: {
        text: "Total Reaction Counts by Trigger Type",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params: any) {
          const triggerType = params[0].axisValue;
          let result = `${triggerType}<br/>`;
          let total = 0;

          params.forEach((param: any) => {
            result += `${param.marker}${param.seriesName}: ${param.value}<br/>`;
            total += param.value;
          });

          result += `<strong>Total: ${total}</strong>`;
          return result;
        },
      },
      legend: {
        data: ["Green", "Yellow", "Red"],
        top: 30,
      },
      xAxis: {
        type: "category",
        data: triggerTypeLabels,
        axisLabel: {
          rotate: 0,
        },
      },
      yAxis: {
        type: "value",
        name: "Total Count",
        minInterval: 1,
      },
      series: [
        {
          name: "Green",
          type: "bar",
          stack: "reactions",
          data: greenCounts,
          itemStyle: {
            color: "#52c41a", // Green color
          },
        },
        {
          name: "Yellow",
          type: "bar",
          stack: "reactions",
          data: yellowCounts,
          itemStyle: {
            color: "#faad14", // Yellow color
          },
        },
        {
          name: "Red",
          type: "bar",
          stack: "reactions",
          data: redCounts,
          itemStyle: {
            color: "#ff4d4f", // Red color
          },
        },
      ],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "10%",
        top: "15%",
        containLabel: true,
      },
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
        height: "400px",
        minHeight: "300px",
      }}
    />
  );
};

export default Example;
