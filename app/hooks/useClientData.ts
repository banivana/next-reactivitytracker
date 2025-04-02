import { createClient } from "@supabase/supabase-js";

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

export type Day = {
  date: string;
  health: Health[];
  notes: Note[];
  triggers: Event[];
};

export type ClientData = {
  days: Day[];
  triggersRes: Event[];
  healthRes: Health[];
  notesRes: Note[];
  error: Error | null;
  clientUserData: any;
};

export async function getClientData(userId: string): Promise<ClientData> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  let error = null;

  const { data: clientUserData } = await supabase.auth.admin.getUserById(
    userId,
  );

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
      eventsError || healthError || notesError,
    );
    error = eventsError || healthError || notesError;
  }

  // Merge data by date
  const days: Day[] = [];

  // Add triggers/events to data array
  for (const trigger of triggersRes || []) {
    let day = days.find((d) => d.date === trigger.date);
    if (!day) {
      day = {
        date: trigger.date,
        health: [],
        notes: [],
        triggers: [],
      };
      days.push(day);
    }
    day.triggers.push(trigger);
  }

  // Add health data to data array
  for (const health of healthRes || []) {
    let day = days.find((d) => d.date === health.date);
    if (!day) {
      day = {
        date: health.date,
        health: [],
        notes: [],
        triggers: [],
      };
      days.push(day);
    }
    day.health.push(health);
  }

  // Add notes data to data array
  for (const note of notesRes || []) {
    let day = days.find((d) => d.date === note.date);
    if (!day) {
      day = {
        date: note.date,
        health: [],
        notes: [],
        triggers: [],
      };
      days.push(day);
    }
    day.notes.push(note);
  }

  // Sort by date, most recent first
  days.sort((a, b) => {
    if (new Date(a.date) > new Date(b.date)) {
      return -1;
    } else if (new Date(a.date) < new Date(b.date)) {
      return 1;
    }
    return 0;
  });

  return {
    days,
    triggersRes: triggersRes || [],
    healthRes: healthRes || [],
    notesRes: notesRes || [],
    error,
    clientUserData,
  };
}
