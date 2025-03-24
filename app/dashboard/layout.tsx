"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Settings, LogOut } from "lucide-react";
import { signOut } from "@/app/auth/actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-xl font-bold">Dashboard</h2>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            <Link
              href="/dashboard/home"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Home className="w-5 h-5 mr-3" />
              Home
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
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
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
