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

interface WeekData {
  green: number;
  yellow: number;
  red: number;
  weekLabel: string;
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

    // Simple helper to get Monday of the week
    const getMondayOfWeek = (dateString: string): Date => {
      const date = new Date(dateString);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
      return new Date(date.setDate(diff));
    };

    // Group data by week (Monday-based) and count reactions by level
    const weekCount: Record<string, WeekData> = {};

    dataArray.forEach((item: TriggerData) => {
      const monday = getMondayOfWeek(item.date);
      const weekKey = monday.toISOString().split("T")[0]; // Use Monday's date as key
      const reactionLevel = item.level_of_reaction.toLowerCase();

      if (!weekCount[weekKey]) {
        const weekLabel = `Week ${monday.getMonth() + 1}/${monday.getDate()}`;
        weekCount[weekKey] = {
          green: 0,
          yellow: 0,
          red: 0,
          weekLabel: weekLabel,
        };
      }

      // Increment the appropriate reaction level counter
      if (reactionLevel === "green") {
        weekCount[weekKey].green++;
      } else if (reactionLevel === "yellow") {
        weekCount[weekKey].yellow++;
      } else if (reactionLevel === "red") {
        weekCount[weekKey].red++;
      }
    });

    // Convert to arrays and sort by Monday date
    const sortedEntries = Object.entries(weekCount).sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    );

    const weekLabels: string[] = sortedEntries.map(
      ([, data]) => data.weekLabel
    );

    // Calculate percentages for each week
    const greenPercentages: number[] = [];
    const yellowPercentages: number[] = [];
    const redPercentages: number[] = [];

    sortedEntries.forEach(([, data]) => {
      const total = data.green + data.yellow + data.red;

      if (total > 0) {
        greenPercentages.push(Math.round((data.green / total) * 100));
        yellowPercentages.push(Math.round((data.yellow / total) * 100));
        redPercentages.push(Math.round((data.red / total) * 100));
      } else {
        greenPercentages.push(0);
        yellowPercentages.push(0);
        redPercentages.push(0);
      }
    });

    // Initialize chart
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      title: {
        text: "Weekly Reaction Level Percentages",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params: any) {
          const weekLabel = params[0].axisValue;
          let result = `${weekLabel}<br/>`;

          // Get the original counts for this week
          const weekIndex = weekLabels.indexOf(weekLabel);
          const weekData = sortedEntries[weekIndex][1];
          const total = weekData.green + weekData.yellow + weekData.red;

          params.forEach((param: any) => {
            const count =
              param.seriesName === "Green"
                ? weekData.green
                : param.seriesName === "Yellow"
                ? weekData.yellow
                : weekData.red;
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
        data: weekLabels,
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
