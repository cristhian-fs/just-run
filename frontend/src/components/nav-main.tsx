import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const sortedItems = [...items].sort(
    (a, b) => b.url.length - a.url.length
  );

  const activeUrl = sortedItems.find(item => {
    if (item.url === "/") return pathname === "/";
    return pathname === item.url || pathname.startsWith(item.url + "/");
  })?.url;
  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2'>
        <SidebarMenu>
          {items.map((item) => {
            if (item.url && item.url.startsWith("/")) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    variant={activeUrl === item.url ? "active" : "default"}
                    asChild
                  >
                    <Link to={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
