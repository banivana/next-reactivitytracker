import ClientJournalDisplay from "./ClientJournalDisplay";
import { Day } from "@/app/hooks/useClientData";

export default function ClientJournal({ days }: { days: Day[] }) {
  return <ClientJournalDisplay days={days} />;
}
