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

interface WeeklyDogData {
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

    // Filter data to only include dog triggers
    const dogTriggers = dataArray.filter(
      (item) => item.trigger_type.toLowerCase() === "motorcycle"
    );

    if (dogTriggers.length === 0) {
      console.log("No dog trigger data found");
      return;
    }

    // Simple helper to get Monday of the week
    const getMondayOfWeek = (dateString: string): Date => {
      const date = new Date(dateString);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(date.setDate(diff));
    };

    // Group dog data by week and count reactions by level
    const weekCount: Record<string, WeeklyDogData> = {};

    dogTriggers.forEach((item: TriggerData) => {
      const monday = getMondayOfWeek(item.date);
      const weekKey = monday.toISOString().split("T")[0];
      const reactionLevel = item.level_of_reaction.toLowerCase();

      if (!weekCount[weekKey]) {
        const weekLabel = `Week of ${
          monday.getMonth() + 1
        }/${monday.getDate()}`;
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
    const greenCounts: number[] = sortedEntries.map(([, data]) => data.green);
    const yellowCounts: number[] = sortedEntries.map(([, data]) => data.yellow);
    const redCounts: number[] = sortedEntries.map(([, data]) => data.red);

    // Initialize chart
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      title: {
        text: "Weekly Motorcycle Trigger Reactions",
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
          let total = 0;

          params.forEach((param: any) => {
            result += `${param.marker}${param.seriesName}: ${param.value}<br/>`;
            total += param.value;
          });

          result += `<strong>Total Motorcycle Encounters: ${total}</strong>`;
          return result;
        },
      },
      legend: {
        data: ["Green", "Yellow", "Red"],
        top: 30,
      },
      xAxis: {
        type: "category",
        data: weekLabels,
        axisLabel: {
          rotate: 0,
        },
      },
      yAxis: {
        type: "value",
        name: "Number of Motorcycle Reactions",
        minInterval: 1,
      },
      series: [
        {
          name: "Green",
          type: "bar",
          stack: "dogReactions",
          data: greenCounts,
          itemStyle: {
            color: "#52c41a", // Green color
          },
        },
        {
          name: "Yellow",
          type: "bar",
          stack: "dogReactions",
          data: yellowCounts,
          itemStyle: {
            color: "#faad14", // Yellow color
          },
        },
        {
          name: "Red",
          type: "bar",
          stack: "dogReactions",
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
