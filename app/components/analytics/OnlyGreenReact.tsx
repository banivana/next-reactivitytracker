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

    // Calculate green percentages and sort by percentage (descending)
    const triggerWithPercentages = Object.entries(triggerTypeCount)
      .map(([triggerType, data]) => {
        const total = data.green + data.yellow + data.red;
        const greenPercentage =
          total > 0 ? Math.round((data.green / total) * 100) : 0;

        return {
          triggerType,
          greenPercentage,
          greenCount: data.green,
          totalCount: total,
        };
      })
      .sort((a, b) => b.greenPercentage - a.greenPercentage); // Sort by percentage descending

    const triggerTypeLabels: string[] = triggerWithPercentages.map(
      (item) =>
        item.triggerType.charAt(0).toUpperCase() + item.triggerType.slice(1) // Capitalize first letter
    );

    const greenPercentages: number[] = triggerWithPercentages.map(
      (item) => item.greenPercentage
    );

    // Initialize chart
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      title: {
        text: "Green Reaction Success Rate by Trigger Type",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params: any) {
          const triggerType = params[0].axisValue;
          const percentage = params[0].value;

          // Get the original data for this trigger type
          const triggerIndex = triggerTypeLabels.indexOf(triggerType);
          const triggerData = triggerWithPercentages[triggerIndex];

          return `${triggerType}<br/>🟢 Success Rate: ${percentage}%<br/>Green Reactions: ${triggerData.greenCount}/${triggerData.totalCount}`;
        },
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
        name: "Success Rate (%)",
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
          name: "Green Success Rate",
          type: "bar",
          data: greenPercentages,
          itemStyle: {
            color: "#52c41a", // Green color
          },
          barWidth: "50%",
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
