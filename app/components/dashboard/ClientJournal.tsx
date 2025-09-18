"use client";

import ClientJournalDisplay from "./ClientJournalDisplay";
import { ClientData } from "@/app/hooks/getClientData";
import { useClientJournalPagination } from "@/app/hooks/useClientJournalPagination";

interface ClientJournalProps {
  userId: string;
  initialData: ClientData;
}

export default function ClientJournal({
  userId,
  initialData,
}: ClientJournalProps) {
  const { data, isLoading, loadMoreData } = useClientJournalPagination(
    userId,
    initialData
  );

  return (
    <ClientJournalDisplay
      days={data.days}
      isLoading={isLoading}
      hasMoreData={data.hasMoreData}
      onLoadMore={loadMoreData}
    />
  );
}
