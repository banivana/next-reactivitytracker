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

interface WeeklyTriggerData {
  green: number;
  yellow: number;
  red: number;
  total: number;
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
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(date.setDate(diff));
    };

    // Group data by week and trigger type
    const weeklyData: Record<string, Record<string, WeeklyTriggerData>> = {};

    dataArray.forEach((item: TriggerData) => {
      const monday = getMondayOfWeek(item.date);
      const weekKey = monday.toISOString().split("T")[0];
      const triggerType = item.trigger_type.toLowerCase();
      const reactionLevel = item.level_of_reaction.toLowerCase();

      // Initialize week if it doesn't exist
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {};
      }

      // Initialize trigger type for this week if it doesn't exist
      if (!weeklyData[weekKey][triggerType]) {
        weeklyData[weekKey][triggerType] = {
          green: 0,
          yellow: 0,
          red: 0,
          total: 0,
        };
      }

      // Increment the appropriate counter
      if (reactionLevel === "green") {
        weeklyData[weekKey][triggerType].green++;
      } else if (reactionLevel === "yellow") {
        weeklyData[weekKey][triggerType].yellow++;
      } else if (reactionLevel === "red") {
        weeklyData[weekKey][triggerType].red++;
      }

      weeklyData[weekKey][triggerType].total++;
    });

    // Get all unique trigger types and sort them
    const allTriggerTypes = Array.from(
      new Set(dataArray.map((item) => item.trigger_type.toLowerCase()))
    ).sort();

    // Get all weeks and sort them
    const allWeeks = Object.keys(weeklyData).sort();

    // Create week labels
    const weekLabels = allWeeks.map((weekKey) => {
      const date = new Date(weekKey);
      return `Week of ${date.getMonth() + 1}/${date.getDate()}`;
    });

    // Prepare series data for each trigger type
    const series: any[] = [];
    const colors = {
      dog: "#8884d8",
      bike: "#82ca9d",
      stranger: "#ffc658",
      car: "#ff7300",
      noise: "#00ff7f",
      other: "#ff69b4",
    };

    allTriggerTypes.forEach((triggerType, index) => {
      const data = allWeeks.map((weekKey) => {
        return weeklyData[weekKey][triggerType]?.total || 0;
      });

      series.push({
        name: triggerType.charAt(0).toUpperCase() + triggerType.slice(1),
        type: "bar",
        data: data,
        itemStyle: {
          color:
            colors[triggerType as keyof typeof colors] ||
            `hsl(${index * 60}, 70%, 50%)`,
        },
      });
    });

    // Initialize chart
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      title: {
        text: "Weekly Trigger Counts by Type",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params: any) {
          const weekLabel = params[0].axisValue;
          const weekIndex = weekLabels.indexOf(weekLabel);
          const weekKey = allWeeks[weekIndex];

          let result = `${weekLabel}<br/>`;

          params.forEach((param: any) => {
            const triggerType = param.seriesName.toLowerCase();
            const triggerData = weeklyData[weekKey][triggerType];

            if (triggerData && triggerData.total > 0) {
              result += `${param.marker}${param.seriesName}: ${param.value} `;
              result += `(G:${triggerData.green}, Y:${triggerData.yellow}, R:${triggerData.red})<br/>`;
            } else {
              result += `${param.marker}${param.seriesName}: ${param.value}<br/>`;
            }
          });

          return result;
        },
      },
      legend: {
        data: allTriggerTypes.map(
          (type) => type.charAt(0).toUpperCase() + type.slice(1)
        ),
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
        name: "Total Count",
        minInterval: 1,
      },
      series: series,
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
