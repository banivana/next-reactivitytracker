"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ClientNavigationProps {
  userId: string;
}

export default function ClientNavigation({ userId }: ClientNavigationProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === `/dashboard/clients/${userId}`) {
      // For the home page, it should only be active if it's exactly that path
      return pathname === path;
    }
    return pathname === path;
  };

  return (
    <nav className="flex gap-4 mb-6">
      <Link href={`/dashboard/clients/${userId}`}>
        <button
          className={`px-4 py-2 rounded-full ${
            isActive(`/dashboard/clients/${userId}`)
              ? "bg-gray-100 font-medium"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Home
        </button>
      </Link>
      <Link href={`/dashboard/clients/${userId}/journal`}>
        <button
          className={`px-4 py-2 rounded-full ${
            isActive(`/dashboard/clients/${userId}/journal`)
              ? "bg-gray-100 font-medium"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Journal
        </button>
      </Link>
      <button className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100">
        Triggers
      </button>
      <button className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100">
        Health
      </button>
      <button className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100">
        Notes
      </button>
      <button className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100">
        Graphs
      </button>
    </nav>
  );
}
