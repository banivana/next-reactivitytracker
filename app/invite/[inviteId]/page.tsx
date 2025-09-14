import InvitePageClient from './InvitePageClient';

export default async function InvitePage({ params }: { params: Promise<{ inviteId: string }> }) {
  const { inviteId } = await params;
  return <InvitePageClient inviteId={inviteId} />;
}
