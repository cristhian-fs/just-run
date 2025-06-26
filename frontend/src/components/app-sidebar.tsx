import * as React from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import {
  ChartColumn,
  DatabaseIcon,
  FileSearch,
  FileText,
  Goal,
  HouseIcon,
  LifeBuoy,
  SettingsIcon,
  Sheet,
  UserIcon,
} from "lucide-react";

import { userQueryOptions } from "@/lib/api";
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

import { AppLogo } from "./logo";
import { Button } from "./ui/button";

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
      title: "Planejamento de treinos",
      url: "/",
      icon: Sheet,
    },
    {
      title: "Zona de treino",
      url: "/users",
      icon: ChartColumn,
    },
    {
      title: "Testes",
      url: "/authentication",
      icon: Goal,
    },
  ],
  navSecondary: [
    {
      title: "Perfil",
      url: "#",
      icon: UserIcon,
    },
    {
      title: "Configurações",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Ajuda",
      url: "#",
      icon: LifeBuoy,
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
  const { data: queryuser } = useQuery(userQueryOptions());

  const user = {
    name: queryuser?.name ?? "shadcn",
    email: queryuser?.email ?? "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start font-normal"
              asChild
            >
              <Link to="/">
                <AppLogo className="!size-5" />
                <span className="text-base font-semibold">Just Run</span>
              </Link>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} />
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
