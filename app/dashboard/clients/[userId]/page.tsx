export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const user = (await params).userId;
  return <div>My user: {user}</div>;
}
