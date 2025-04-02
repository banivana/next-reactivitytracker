"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Settings, LogOut, Users } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { usePathname } from "next/navigation";
import { Client } from "@/utils/server/getClientUsers";

interface DashboardNavProps {
  clients: Client[];
}

export function DashboardNav({ clients }: DashboardNavProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold">Dashboard</h2>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
        <Link
          href="/dashboard/home"
          className={`flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
            isActive("/dashboard/home")
              ? "bg-primary text-primary-foreground font-medium"
              : ""
          }`}
        >
          <Home className="w-5 h-5 mr-3" />
          Home
        </Link>
        <div className="space-y-1">
          <Link
            href="/dashboard/clients"
            className={`flex items-center justify-between px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
              isActive("/dashboard/clients")
                ? "bg-primary text-primary-foreground font-medium"
                : ""
            }`}
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-3" />
              Clients
            </div>
          </Link>
          <div className="ml-8 space-y-1">
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className={`flex items-center px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 ${
                  isActive(`/dashboard/clients/${client.id}`)
                    ? "bg-primary text-primary-foreground font-medium"
                    : ""
                }`}
              >
                {client.displayName}
              </Link>
            ))}
          </div>
        </div>
        <Link
          href="/dashboard/settings"
          className={`flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
            isActive("/dashboard/settings")
              ? "bg-primary text-primary-foreground font-medium"
              : ""
          }`}
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </Link>
      </nav>
      <div className="p-4 border-t">
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
