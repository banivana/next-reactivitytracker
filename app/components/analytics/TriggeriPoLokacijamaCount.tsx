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

interface LocationData {
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

    // Group data by location and count reactions by level
    const locationCount: Record<string, LocationData> = {};

    dataArray.forEach((item: TriggerData) => {
      const location = item.location;
      const reactionLevel = item.level_of_reaction.toLowerCase();

      if (!locationCount[location]) {
        locationCount[location] = {
          green: 0,
          yellow: 0,
          red: 0,
        };
      }

      // Increment the appropriate reaction level counter
      if (reactionLevel === "green") {
        locationCount[location].green++;
      } else if (reactionLevel === "yellow") {
        locationCount[location].yellow++;
      } else if (reactionLevel === "red") {
        locationCount[location].red++;
      }
    });

    // Sort by total count (descending) and prepare data
    const locationWithCounts = Object.entries(locationCount)
      .map(([location, data]) => {
        const total = data.green + data.yellow + data.red;

        return {
          location,
          greenCount: data.green,
          yellowCount: data.yellow,
          redCount: data.red,
          total,
        };
      })
      .sort((a, b) => b.total - a.total); // Sort by total count descending

    const locationLabels: string[] = locationWithCounts.map((item) => {
      // Truncate long location IDs for display
      const locationId = item.location;
      return locationId.length > 12
        ? locationId.substring(0, 12) + "..."
        : locationId;
    });

    const greenCounts: number[] = locationWithCounts.map(
      (item) => item.greenCount
    );
    const yellowCounts: number[] = locationWithCounts.map(
      (item) => item.yellowCount
    );
    const redCounts: number[] = locationWithCounts.map((item) => item.redCount);

    // Initialize chart
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      title: {
        text: "Total Reaction Counts by Location",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params: any) {
          const locationIndex = locationLabels.indexOf(params[0].axisValue);
          const locationData = locationWithCounts[locationIndex];
          let result = `Location: ${locationData.location}<br/>`;
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
        data: locationLabels,
        axisLabel: {
          rotate: 45,
          fontSize: 12,
          fontWeight: "bold",
        },
      },
      yAxis: {
        type: "value",
        name: "Total Count",
        nameLocation: "middle",
        nameGap: 40,
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
        minInterval: 1,
        axisLabel: {
          fontSize: 14,
          fontWeight: "bold",
        },
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
          barWidth: 25,
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
        bottom: "15%",
        top: "20%",
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
        height: "450px",
        minHeight: "400px",
      }}
    />
  );
};

export default Example;
