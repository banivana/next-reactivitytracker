"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Users,
  User,
  ChevronRight,
  BarChart3,
  UserPlus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Client } from "@/utils/server/getClientUsers";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AppSidebarProps {
  clients: Client[];
}

export function AppSidebar({ clients }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isClientActive = (clientId: string) =>
    pathname.includes(`/dashboard/clients/${clientId}`);

  // Separate active and inactive clients
  const activeClients = clients.filter((client) => client.active);
  const inactiveClients = clients.filter((client) => !client.active);

  const isInactiveClientOpen = inactiveClients.some((client) =>
    isClientActive(client.id)
  );

  const [inactiveOpen, setInactiveOpen] = useState(isInactiveClientOpen);

  useEffect(() => {
    if (isInactiveClientOpen) {
      setInactiveOpen(true);
    }
  }, [isInactiveClientOpen]);

  return (
    <Sidebar>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/home")}
                >
                  <Link href="/dashboard/home">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/settings/invite-client")}
                >
                  <Link href="/dashboard/settings/invite-client">
                    <UserPlus />
                    <span>Add a client</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible defaultOpen={true} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isActive("/dashboard/clients")}
                    >
                      <Users />
                      <span>Clients</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {activeClients.map((client) => (
                        <SidebarMenuSubItem key={client.id}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isClientActive(client.id)}
                          >
                            <Link href={`/dashboard/clients/${client.id}`}>
                              <User />
                              <span>
                                {client.first_name} {client.last_name}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                      {inactiveClients.length > 0 && (
                        <Collapsible
                          open={inactiveOpen}
                          onOpenChange={setInactiveOpen}
                          className="group/inactive"
                        >
                          <SidebarMenuSubItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuSubButton>
                                <Users />
                                <span>Inactive</span>
                                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/inactive:rotate-90" />
                              </SidebarMenuSubButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {inactiveClients.map((client) => (
                                  <SidebarMenuSubItem key={client.id}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isClientActive(client.id)}
                                    >
                                      <Link
                                        href={`/dashboard/clients/${client.id}`}
                                      >
                                        <User />
                                        <span className="opacity-60">
                                          {client.first_name} {client.last_name}
                                        </span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuSubItem>
                        </Collapsible>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/analytics")}
                >
                  <Link href="/dashboard/analytics">
                    <BarChart3 />
                    <span>Usage Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
