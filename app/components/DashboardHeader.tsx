"use client";

import {
  ArrowLeftToLine,
  ArrowRightFromLine,
  Search,
  User,
  LogOut,
  Home,
  BarChart3,
  UserPlus,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { signOut } from "@/app/auth/actions";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/utils/server/getClientUsers";

interface DashboardHeaderProps {
  userName?: string;
  clients?: Client[];
}

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  category: "main" | "client" | "settings";
}

export function DashboardHeader({
  userName,
  clients = [],
}: DashboardHeaderProps) {
  const { toggleSidebar, open } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Build navigation items from sidebar structure
  const navigationItems: NavigationItem[] = useMemo(() => {
    const items: NavigationItem[] = [
      {
        label: "Home",
        href: "/dashboard/home",
        icon: <Home className="h-4 w-4" />,
        category: "main",
      },
      {
        label: "Add a client",
        href: "/dashboard/settings/invite-client",
        icon: <UserPlus className="h-4 w-4" />,
        category: "main",
      },
      {
        label: "Usage Analytics",
        href: "/dashboard/analytics",
        icon: <BarChart3 className="h-4 w-4" />,
        category: "main",
      },
    ];

    // Add active clients
    const activeClients = clients.filter((client) => client.active);
    activeClients.forEach((client) => {
      items.push({
        label: `${client.first_name} ${client.last_name || ""}`,
        href: `/dashboard/clients/${client.id}`,
        icon: <User className="h-4 w-4" />,
        category: "client",
      });
    });

    // Add inactive clients
    const inactiveClients = clients.filter((client) => !client.active);
    inactiveClients.forEach((client) => {
      items.push({
        label: `${client.first_name} ${client.last_name} (Inactive)`,
        href: `/dashboard/clients/${client.id}`,
        icon: <User className="h-4 w-4 opacity-60" />,
        category: "client",
      });
    });

    return items;
  }, [clients]);

  // Filter navigation items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return navigationItems;

    const query = searchQuery.toLowerCase();
    return navigationItems.filter((item) =>
      item.label.toLowerCase().includes(query)
    );
  }, [searchQuery, navigationItems]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredItems.length > 0 && selectedIndex < filteredItems.length) {
      router.push(filteredItems[selectedIndex].href);
      setSearchQuery("");
      setIsSearchOpen(false);
      setSelectedIndex(0);
    }
  };

  const handleNavigate = (href: string) => {
    router.push(href);
    setSearchQuery("");
    setIsSearchOpen(false);
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchOpen || filteredItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
      setSelectedIndex(0);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 shadow-sm">
        {/* Left: Sidebar Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {open ? (
                <ArrowLeftToLine className="h-5 w-5 text-gray-500" />
              ) : (
                <ArrowRightFromLine className="h-5 w-5 text-gray-500" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{open ? "Collapse sidebar" : "Expand sidebar"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: Search Bar */}
        <div className="relative">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Quick navigation"
                className="w-64 pl-9 h-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(e.target.value.trim().length > 0);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsSearchOpen(searchQuery.trim().length > 0)}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />
            </div>
          </form>

          {/* Search Results Dropdown */}
          {isSearchOpen && filteredItems.length > 0 && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
              {filteredItems.map((item, index) => (
                <button
                  key={`${item.href}-${index}`}
                  onClick={() => handleNavigate(item.href)}
                  className={`w-full px-4 py-2 text-left flex items-center gap-3 border-b last:border-b-0 ${
                    index === selectedIndex
                      ? "bg-amber-400"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="text-gray-600">{item.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.href}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {isSearchOpen && searchQuery.trim() && filteredItems.length === 0 && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-md shadow-lg p-4 z-50">
              <p className="text-sm text-gray-500 text-center">
                No results found
              </p>
            </div>
          )}
        </div>

        {/* Right: Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {userName && (
              <div className="px-2 py-1.5 text-sm font-medium">{userName}</div>
            )}
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </TooltipProvider>
  );
}
