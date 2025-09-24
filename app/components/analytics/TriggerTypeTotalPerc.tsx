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

    // Calculate percentages for each trigger type and sort by green percentage (descending)
    const triggerWithPercentages = Object.entries(triggerTypeCount)
      .map(([triggerType, data]) => {
        const total = data.green + data.yellow + data.red;
        const greenPercentage =
          total > 0 ? Math.round((data.green / total) * 100) : 0;
        const yellowPercentage =
          total > 0 ? Math.round((data.yellow / total) * 100) : 0;
        const redPercentage =
          total > 0 ? Math.round((data.red / total) * 100) : 0;

        return {
          triggerType,
          greenPercentage,
          yellowPercentage,
          redPercentage,
          data, // Keep original data for tooltip
        };
      })
      .sort((a, b) => b.greenPercentage - a.greenPercentage); // Sort by green percentage descending

    const triggerTypeLabels: string[] = triggerWithPercentages.map(
      (item) =>
        item.triggerType.charAt(0).toUpperCase() + item.triggerType.slice(1) // Capitalize first letter
    );

    const greenPercentages: number[] = triggerWithPercentages.map(
      (item) => item.greenPercentage
    );
    const yellowPercentages: number[] = triggerWithPercentages.map(
      (item) => item.yellowPercentage
    );
    const redPercentages: number[] = triggerWithPercentages.map(
      (item) => item.redPercentage
    );

    // Initialize chart
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      title: {
        text: "Reaction Level Percentages by Trigger Type",
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

          // Get the original data for this trigger type
          const triggerIndex = triggerTypeLabels.indexOf(triggerType);
          const triggerData = triggerWithPercentages[triggerIndex].data;
          const total =
            triggerData.green + triggerData.yellow + triggerData.red;

          params.forEach((param: any) => {
            const count =
              param.seriesName === "Green"
                ? triggerData.green
                : param.seriesName === "Yellow"
                ? triggerData.yellow
                : triggerData.red;
            result += `${param.marker}${param.seriesName}: ${param.value}% (${count}/${total})<br/>`;
          });

          return result;
        },
      },
      legend: {
        data: ["Green", "Yellow", "Red"],
        right: 30,
      },
      xAxis: {
        type: "category",
        data: triggerTypeLabels,
        axisLabel: {
          rotate: 0,
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      yAxis: {
        type: "value",
        name: "Percentage by zones (%)",
        nameLocation: "middle",
        nameGap: 42,
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
        min: 0,
        max: 100,
        axisLabel: {
          formatter: "{value}%",
          fontSize: 14,
          fontWeight: "bold",
        },
      },
      series: [
        {
          name: "Green",
          type: "bar",
          stack: "reactions",
          data: greenPercentages,
          itemStyle: {
            color: "#52c41a", // Green color
          },
          barWidth: "50%",
        },
        {
          name: "Yellow",
          type: "bar",
          stack: "reactions",
          data: yellowPercentages,
          itemStyle: {
            color: "#faad14", // Yellow color
          },
        },
        {
          name: "Red",
          type: "bar",
          stack: "reactions",
          data: redPercentages,
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
