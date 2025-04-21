import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Pencil } from "lucide-react";
import { getClientUsers } from "@/utils/server/getClientUsers";

export default async function ClientsPage() {
  const { clients, error } = await getClientUsers();

  if (error) {
    return <div>Error loading clients. Please try again later.</div>;
  }

  // If there are no clients, show the empty state right away
  if (clients.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Clients</h1>
          <Button asChild>
            <Link href="/dashboard/clients/add">
              <Users className="mr-2 h-4 w-4" />
              Add New Client
            </Link>
          </Button>
        </div>

        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium">No clients yet</h3>
          <p className="text-gray-500 mt-2">
            Add your first client to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Clients</h1>
        <Button asChild>
          <Link href="/dashboard/clients/add">
            <Users className="mr-2 h-4 w-4" />
            Add New Client
          </Link>
        </Button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                First name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last name
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients?.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {client.first_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {client.last_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-4">
                    <Link
                      href={`/dashboard/clients/${client.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/clients/${client.id}/edit`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
