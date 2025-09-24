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

    // Calculate percentages and sort by green percentage (descending)
    const locationWithPercentages = Object.entries(locationCount)
      .map(([location, data]) => {
        const total = data.green + data.yellow + data.red;
        const greenPercentage =
          total > 0 ? Math.round((data.green / total) * 100) : 0;
        const yellowPercentage =
          total > 0 ? Math.round((data.yellow / total) * 100) : 0;
        const redPercentage =
          total > 0 ? Math.round((data.red / total) * 100) : 0;

        return {
          location,
          greenPercentage,
          yellowPercentage,
          redPercentage,
          data, // Keep original data for tooltip
          total,
        };
      })
      .sort((a, b) => b.greenPercentage - a.greenPercentage); // Sort by green percentage descending

    const locationLabels: string[] = locationWithPercentages.map((item) => {
      // Truncate long location IDs for display
      const locationId = item.location;
      return locationId.length > 12
        ? locationId.substring(0, 12) + "..."
        : locationId;
    });

    const greenPercentages: number[] = locationWithPercentages.map(
      (item) => item.greenPercentage
    );
    const yellowPercentages: number[] = locationWithPercentages.map(
      (item) => item.yellowPercentage
    );
    const redPercentages: number[] = locationWithPercentages.map(
      (item) => item.redPercentage
    );

    // Initialize chart
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      title: {
        text: "Reaction Level Percentages by Location",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params: any) {
          const locationIndex = locationLabels.indexOf(params[0].axisValue);
          const locationData = locationWithPercentages[locationIndex];
          let result = `Location: ${locationData.location}<br/>`;

          params.forEach((param: any) => {
            const count =
              param.seriesName === "Green"
                ? locationData.data.green
                : param.seriesName === "Yellow"
                ? locationData.data.yellow
                : locationData.data.red;
            result += `${param.marker}${param.seriesName}: ${param.value}% (${count}/${locationData.total})<br/>`;
          });

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
        name: "Percentage (%)",
        nameLocation: "middle",
        nameGap: 50,
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
