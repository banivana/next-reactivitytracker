import InviteManager from "@/app/components/InviteManager";

export default function InviteClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Invite Client</h1>
        <p className="text-gray-600 mt-2">
          Create and manage invitation links for new clients to join your
          platform.
        </p>
      </div>

      <InviteManager />
    </div>
  );
}
