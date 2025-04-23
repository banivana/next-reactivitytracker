import ClientJournalDisplay from "./ClientJournalDisplay";
import { Day } from "@/app/hooks/getClientData";

export default function ClientJournal({ days }: { days: Day[] }) {
  return <ClientJournalDisplay days={days} />;
}
