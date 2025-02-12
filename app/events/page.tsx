import MyTable from "../components/dashboard/MyTable";

export default async function Dashboard() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-DashboardData`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return (
      <div>
        <MyTable events={data.events} />
      </div>
    );
  } catch (err) {
    console.error(err);
    return <div>sorry</div>;
  }
}
