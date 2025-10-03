"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";

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
    <nav className="flex gap-4 mb-6 justify-between items-center">
      <div className="flex gap-4">
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

        <Link href={`/dashboard/clients/${userId}/triggers`}>
          <button
            className={`px-4 py-2 rounded-full ${
              isActive(`/dashboard/clients/${userId}/triggers`)
                ? "bg-gray-100 font-medium"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Triggers
          </button>
        </Link>
      </div>

      <div className="flex gap-4">
        {/* <Link href={`/dashboard/clients/${userId}/trainer-notes`}>
          <button
            className={`px-4 py-2 rounded-full ${
              isActive(`/dashboard/clients/${userId}/trainer-notes`)
                ? "bg-gray-100 font-medium"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Trainer Notes
          </button>
        </Link> */}

        <Link href={`/dashboard/clients/${userId}/settings`}>
          <button
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              isActive(`/dashboard/clients/${userId}/settings`)
                ? "bg-gray-100 font-medium"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </Link>
      </div>
    </nav>
  );
}
