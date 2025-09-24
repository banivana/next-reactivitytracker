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

    // Calculate average reaction level for each day
    const dailyReactions: Record<
      string,
      { total: number; weightedSum: number; count: number }
    > = {};

    dataArray.forEach((item: TriggerData) => {
      const date = item.date;
      const reactionLevel = item.level_of_reaction.toLowerCase();

      // Assign weights: green = 1, yellow = 2, red = 3 (lower is better)
      let weight = 0;
      if (reactionLevel === "green") weight = 1;
      else if (reactionLevel === "yellow") weight = 2;
      else if (reactionLevel === "red") weight = 3;

      if (!dailyReactions[date]) {
        dailyReactions[date] = { total: 0, weightedSum: 0, count: 0 };
      }

      dailyReactions[date].weightedSum += weight;
      dailyReactions[date].count++;
    });

    // Calculate average for each day and prepare calendar data
    const calendarData: [string, number][] = [];

    Object.entries(dailyReactions).forEach(([date, data]) => {
      const averageLevel = data.weightedSum / data.count; // 1.0 = all green, 3.0 = all red
      calendarData.push([date, averageLevel]);
    });

    // Get date range for calendar
    const dates = Object.keys(dailyReactions).sort();
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    // Initialize chart
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      title: {
        text: "Daily Training Progress Calendar",
        left: "center",
        textStyle: {
          fontSize: 18,
          fontWeight: "bold",
        },
      },
      tooltip: {
        formatter: function (params: any) {
          const date = params.data[0];
          const avgLevel = params.data[1];
          const dayData = dailyReactions[date];

          let statusText = "";
          if (avgLevel <= 1.3) statusText = "Excellent Day (Mostly Green)";
          else if (avgLevel <= 1.7) statusText = "Good Day (Green/Yellow Mix)";
          else if (avgLevel <= 2.3) statusText = "Challenging Day (Mixed)";
          else statusText = "Difficult Day (Many Red)";

          return `${date}<br/>${statusText}<br/>Average Level: ${avgLevel.toFixed(
            2
          )}<br/>Total Encounters: ${dayData.count}`;
        },
      },
      visualMap: {
        min: 1,
        max: 3,
        type: "continuous",
        orient: "horizontal",
        left: "center",
        top: 60,
        inRange: {
          color: ["#52c41a", "#faad14", "#ff4d4f"], // Green to Yellow to Red
        },
        text: ["Difficult", "Excellent"],
        textStyle: {
          color: "#000",
          fontSize: 12,
          fontWeight: "bold",
        },
      },
      calendar: {
        top: 120,
        left: 50,
        right: 50,
        cellSize: ["auto", 25],
        range: [startDate, endDate],
        itemStyle: {
          borderWidth: 2,
          borderColor: "#fff",
        },
        yearLabel: { show: false },
        monthLabel: {
          nameMap: "en",
          fontSize: 14,
          fontWeight: "bold",
        },
        dayLabel: {
          fontSize: 12,
          fontWeight: "bold",
          firstDay: 1, // Start week on Monday (1=Monday, 0=Sunday)
        },
      },
      series: [
        {
          type: "heatmap",
          coordinateSystem: "calendar",
          data: calendarData,
          itemStyle: {
            borderRadius: 3,
          },
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
        height: "400px",
        minHeight: "350px",
      }}
    />
  );
};

export default Example;
