import { createServerSupabaseClient } from "@/utils/supabase-server";
import ClientJournalDisplay from "./ClientJournalDisplay";

type Event = {
  id: number;
  created_at: string;
  user_id: string;
  date: string;
  trigger_type: string;
  level_of_reaction: string;
  description: string;
  location: string;
};

type Health = {
  id: number;
  created_at: string;
  user_id: string;
  date: string;
  description: string;
};

type Note = {
  id: number;
  created_at: string;
  user_id: string;
  date: string;
  note_content: string;
};

type Day = {
  date: string;
  health: Health[];
  notes: Note[];
  triggers: Event[];
};

export default async function ClientJournal({ userId }: { userId: string }) {
  const supabase = await createServerSupabaseClient();

  // Fetch events data
  const { data: triggersRes, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  // Fetch health data
  const { data: healthRes, error: healthError } = await supabase
    .from("health")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  // Fetch notes data
  const { data: notesRes, error: notesError } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (eventsError || healthError || notesError) {
    console.error(
      "Error fetching data:",
      eventsError || healthError || notesError
    );
    return (
      <div className="p-4 text-red-500">
        Error loading client journal. Please try again later.
      </div>
    );
  }

  // Merge data by date
  const data: Day[] = [];

  // Add triggers/events to data array
  for (const trigger of triggersRes || []) {
    let day = data.find((d) => d.date === trigger.date);
    if (!day) {
      day = {
        date: trigger.date,
        health: [],
        notes: [],
        triggers: [],
      };
      data.push(day);
    }
    day.triggers.push(trigger);
  }

  // Add health data to data array
  for (const health of healthRes || []) {
    let day = data.find((d) => d.date === health.date);
    if (!day) {
      day = {
        date: health.date,
        health: [],
        notes: [],
        triggers: [],
      };
      data.push(day);
    }
    day.health.push(health);
  }

  // Add notes data to data array
  for (const note of notesRes || []) {
    let day = data.find((d) => d.date === note.date);
    if (!day) {
      day = {
        date: note.date,
        health: [],
        notes: [],
        triggers: [],
      };
      data.push(day);
    }
    day.notes.push(note);
  }

  // Sort by date, most recent first
  data.sort((a, b) => {
    if (new Date(a.date) > new Date(b.date)) {
      return -1;
    } else if (new Date(a.date) < new Date(b.date)) {
      return 1;
    }
    return 0;
  });

  return <ClientJournalDisplay days={data} />;
}
