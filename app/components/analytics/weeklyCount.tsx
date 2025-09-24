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
  count: number;
  weekLabel: string;
}

interface ExampleProps {
  analyticsData: AnalyticsData;
}

const Example3: React.FC<ExampleProps> = ({ analyticsData }) => {
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

    // Group data by week (Monday-based) and count triggers
    const weekCount: Record<string, WeekData> = {};

    dataArray.forEach((item: TriggerData) => {
      const monday = getMondayOfWeek(item.date);
      const weekKey = monday.toISOString().split("T")[0]; // Use Monday's date as key

      if (weekCount[weekKey]) {
        weekCount[weekKey].count++;
      } else {
        const weekLabel = `Week of ${
          monday.getMonth() + 1
        }/${monday.getDate()}`;
        weekCount[weekKey] = {
          count: 1,
          weekLabel: weekLabel,
        };
      }
    });

    // Convert to arrays and sort by Monday date
    const sortedEntries = Object.entries(weekCount).sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    );

    const weekLabels: string[] = sortedEntries.map(
      ([, data]) => data.weekLabel
    );
    const counts: number[] = sortedEntries.map(([, data]) => data.count);

    // Initialize chart
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      title: {
        text: "Weekly Trigger Count",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params: any) {
          const weekLabel = params[0].axisValue;
          const count = params[0].value;
          return `${weekLabel}<br/>Triggers: ${count}`;
        },
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
        name: "Number of Triggers",
        minInterval: 1,
      },
      series: [
        {
          data: counts,
          type: "line",
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: "#5470c6",
          },
        },
      ],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "10%",
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

export default Example3;
