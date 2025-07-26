import * as React from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import {
  Calculator,
  ChartColumn,
  DatabaseIcon,
  FileSearch,
  FileText,
  Goal,
  HouseIcon,
  LifeBuoy,
  Plus,
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
  SidebarMenuItem,
  SidebarSeparator,
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
      url: "/planejamento",
      icon: Sheet,
    },
    {
      title: "Zonas de treino",
      url: "/zonas-de-treino",
      icon: ChartColumn,
    },
    {
      title: "Calculadora",
      url: "/calculadora",
      icon: Calculator,
    },
    {
      title: "Testes",
      url: "/testes",
      icon: Goal,
    },
    {
      title: "Novo treino",
      url: "/novo-treino",
      icon: Plus,
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
      url: "/settings",
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
              className="text-foreground w-full justify-start font-normal"
              asChild
            >
              <Link to="/">
                <AppLogo className="!size-5" />
                <span className="text-base font-semibold tracking-tighter">
                  Just Run
                </span>
              </Link>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-4 gap-0">
        <span className="text-muted-foreground ml-2 text-sm">
          Menu principal
        </span>
        <SidebarSeparator className="bg-border mb-2 mt-1 data-[orientation=horizontal]:h-[2px] data-[orientation=horizontal]:w-auto" />
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
      </SidebarContent>
      <SidebarFooter className="p-2">
        <NavSecondary items={data.navSecondary} />
        <SidebarSeparator className="bg-border mb-2 mt-1 data-[orientation=horizontal]:h-[2px] data-[orientation=horizontal]:w-auto" />
        <NavUser user={user} />
        <span className="text-muted-foreground text-center text-sm">
          ©{new Date().getFullYear()} Just Run
        </span>
      </SidebarFooter>
    </Sidebar>
  );
}
