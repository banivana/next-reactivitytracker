import { createClient } from "@supabase/supabase-js";

export const QUERY_LIMIT = 50;

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
};

export async function getClientData(userId: string): Promise<ClientData> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  let error = null;

  const page = 0;
  const { data: items, error: errorQuery } = await supabase.rpc(
    "get_combined_journal_data",
    {
      user_id_param: userId,
      offset_param: page * QUERY_LIMIT,
      limit_param: QUERY_LIMIT,
    },
  );

  const triggersRes = [];
  const healthRes = [];
  const notesRes = [];

  if (items) {
    for (const item of items) {
      if ("level_of_reaction" in item.data) {
        triggersRes.push(item.data);
      } else if ("description" in item.data) {
        healthRes.push(item.data);
      } else if ("note_content" in item.data) {
        notesRes.push(item.data);
      }
    }
  }

  if (errorQuery) {
    console.error("Error fetching data:", errorQuery);
    error = errorQuery;
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
  };
}
