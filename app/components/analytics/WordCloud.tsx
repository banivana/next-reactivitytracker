"use client";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "echarts-wordcloud";

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

interface WordData {
  name: string;
  value: number;
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

    // Extract and process words from descriptions
    const wordCount: Record<string, number> = {};

    // Common words to filter out (Croatian and English stopwords)
    const stopWords = new Set([
      "i",
      "a",
      "o",
      "u",
      "e",
      "na",
      "se",
      "je",
      "da",
      "su",
      "za",
      "od",
      "do",
      "iz",
      "sa",
      "s",
      "po",
      "ni",
      "ne",
      "kao",
      "oko",
      "ali",
      "ili",
      "ako",
      "što",
      "kad",
      "gdje",
      "kako",
      "koju",
      "koji",
      "koja",
      "koje",
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "is",
      "are",
      "was",
      "were",
      "bez",
      "kroz",
      "vrlo",
      "jako",
      "malo",
      "još",
      "već",
      "samo",
      "više",
      "less",
      "most",
      "some",
      "all",
      "any",
      "al",
      "ga",
      "ju",
      "me",
      "te",
      "mu",
      "joj",
      "im",
      "ih",
      "nju",
      "njih",
      "ona",
      "on",
      "ono",
      "oni",
      "one",
    ]);

    dataArray.forEach((item: TriggerData) => {
      if (item.description && item.description.trim()) {
        // Split description into words and clean them
        const words = item.description
          .toLowerCase()
          .replace(/[^\w\sšđčćžŠĐČĆŽ]/g, "") // Remove punctuation but keep Croatian characters
          .split(/\s+/)
          .filter(
            (word) =>
              word.length > 2 && // At least 3 characters
              !stopWords.has(word) && // Not a stop word
              !word.match(/^\d+$/) // Not a number
          );

        words.forEach((word) => {
          const cleanWord = word.trim();
          if (cleanWord) {
            wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
          }
        });
      }
    });

    // Convert to word cloud data format and sort by frequency
    const wordCloudData: WordData[] = Object.entries(wordCount)
      .map(([word, count]) => ({
        name: word,
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50); // Take top 50 words

    // Initialize chart
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      title: {
        text: "Most Common Words in Training Descriptions",
        left: "center",
        textStyle: {
          fontSize: 18,
          fontWeight: "bold",
        },
      },
      tooltip: {
        formatter: function (params: any) {
          return `"${params.data.name}" appears ${params.data.value} times`;
        },
      },
      series: [
        {
          type: "wordCloud",
          gridSize: 8,
          sizeRange: [12, 60],
          rotationRange: [-45, 45],
          rotationStep: 15,
          shape: "pentagon",
          left: "center",
          top: "center",
          width: "80%",
          height: "70%",
          right: null,
          bottom: null,
          drawOutOfBound: false,
          layoutAnimation: true,
          textStyle: {
            fontFamily: "Arial, sans-serif",
            fontWeight: function (params: any) {
              // More frequent words are bolder
              return params.value > 10 ? "bold" : "normal";
            },
            color: function (params: any) {
              // Color based on frequency
              const colors = [
                "#1f77b4",
                "#ff7f0e",
                "#2ca02c",
                "#d62728",
                "#9467bd",
                "#8c564b",
                "#e377c2",
                "#7f7f7f",
                "#bcbd22",
                "#17becf",
                "#5470c6",
                "#91cc75",
                "#fac858",
                "#ee6666",
                "#73c0de",
                "#3ba272",
                "#fc8452",
                "#9a60b4",
                "#ea7ccc",
              ];
              return colors[Math.floor(Math.random() * colors.length)];
            },
          },
          emphasis: {
            focus: "self",
            textStyle: {
              shadowBlur: 10,
              shadowColor: "#333",
            },
          },
          data: wordCloudData,
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
        height: "500px",
        minHeight: "400px",
      }}
    />
  );
};

export default Example;
