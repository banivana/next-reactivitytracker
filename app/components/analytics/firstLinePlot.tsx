"use client";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const Example = ({ analyticsData }) => {
  const chartRef = useRef(null);

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

    const dataArray = analyticsData.data;

    console.log("Data Array:", dataArray);

    // Group data by date and count triggers
    const dateCount = {};

    dataArray.forEach((item) => {
      const date = item.date;
      if (dateCount[date]) {
        dateCount[date]++;
      } else {
        dateCount[date] = 1;
      }
    });

    // Convert to arrays and sort by date
    const sortedEntries = Object.entries(dateCount).sort(
      ([a], [b]) => new Date(a) - new Date(b)
    );

    const dates = sortedEntries.map(([date]) => date);
    const counts = sortedEntries.map(([, count]) => count);

    // Initialize chart
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "Daily Trigger Count",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          const date = params[0].axisValue;
          const count = params[0].value;
          return `Date: ${date}<br/>Triggers: ${count}`;
        },
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: {
          rotate: 45,
          formatter: function (value) {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          },
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
          symbolSize: 6,
          lineStyle: {
            width: 2,
          },
          itemStyle: {
            color: "#5470c6",
          },
        },
      ],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
    };

    myChart.setOption(option);

    // Handle window resize
    const handleResize = () => {
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
