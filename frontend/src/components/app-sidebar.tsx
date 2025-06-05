import * as React from "react";

import {
  DatabaseIcon,
  FileSearch,
  FileText,
  Fingerprint,
  HouseIcon,
  LifeBuoy,
  SearchIcon,
  ServerIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: HouseIcon,
    },
    {
      title: "Users",
      url: "/users",
      icon: UserIcon,
    },
    {
      title: "Authentication",
      url: "/authentication",
      icon: Fingerprint,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: ServerIcon,
    },
    {
      title: "APIs",
      url: "/apis",
      icon: DatabaseIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: FileSearch,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileText,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: sessionHook } = authClient.useSession();

  const user = {
    name: sessionHook?.user.name ?? "shadcn",
    email: sessionHook?.user.email ?? "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex items-center justify-between gap-x-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="#">
                  <UserIcon className="!size-5" />
                  <span className="text-base font-semibold">Acme Inc.</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <NavUser user={user} />
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} />
      </SidebarFooter>
    </Sidebar>
  );
}
