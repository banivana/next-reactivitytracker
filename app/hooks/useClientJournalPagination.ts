"use client";

import { useCallback, useState } from "react";
import { ClientData } from "@/app/hooks/getClientData";

export function useClientJournalPagination(
  userId: string,
  initialData: ClientData,
) {
  const [data, setData] = useState<ClientData>(initialData);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreData = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const nextPage = currentPage + 1;
      const response = await fetch(
        `/api/clients/${userId}/journal?page=${nextPage}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more data");
      }

      const newData: ClientData = await response.json();

      // Check if we got any new data
      if (!newData.days || newData.days.length === 0) {
        return;
      }

      // Merge new days with existing days, avoiding duplicates
      const existingDates = new Set(data.days.map((day) => day.date));
      const newDays = newData.days.filter(
        (day) => !existingDates.has(day.date),
      );

      setData((prevData) => ({
        ...prevData,
        days: [...prevData.days, ...newDays],
        triggersRes: [...prevData.triggersRes, ...newData.triggersRes],
        healthRes: [...prevData.healthRes, ...newData.healthRes],
        notesRes: [...prevData.notesRes, ...newData.notesRes],
        hasMoreData: newData.hasMoreData,
      }));

      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentPage, data.days, isLoading]);

  return {
    data,
    isLoading,
    loadMoreData,
  };
}
