import { createClient } from "@/utils/supabase/server";

export default async function Events() {
  const supabase = await createClient();
  const res = await supabase.from("events").select("*");

  return <pre>{JSON.stringify(res, null, 2)}</pre>;
}
