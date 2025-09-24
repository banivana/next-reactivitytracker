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
      (item) => item.trigger_type.toLowerCase() === "stranger"
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
        text: "Weekly Stranger Trigger Reaction Percentages",
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

          result += `<strong>Total Stranger Encounters: ${total}</strong>`;
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
        name: "Percentage (%)",
        min: 0,
        max: 100,
        axisLabel: {
          formatter: "{value}%",
        },
      },
      series: [
        {
          name: "Green",
          type: "bar",
          stack: "dogReactions",
          data: greenPercentages,
          itemStyle: {
            color: "#52c41a", // Green color
          },
        },
        {
          name: "Yellow",
          type: "bar",
          stack: "dogReactions",
          data: yellowPercentages,
          itemStyle: {
            color: "#faad14", // Yellow color
          },
        },
        {
          name: "Red",
          type: "bar",
          stack: "dogReactions",
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
