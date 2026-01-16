"use client";

import * as React from "react";
import {
  MessageSquare,
  Image,
  FileText,
  Table,
  Mail,
  MoreHorizontal,
} from "lucide-react";
import { BrandIcon } from "@/components/icons/brand-icon";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Navigation items for the sidebar.
 * Only "AI Emails" is enabled per user requirement.
 * Others are visually present but disabled/coming soon.
 */
const navItems = [
  {
    icon: MessageSquare,
    label: "AI Chat",
    href: "#",
    disabled: true,
    active: false,
  },
  {
    icon: Image,
    label: "Image Generation",
    href: "#",
    disabled: true,
    active: false,
  },
  {
    icon: FileText,
    label: "AI Docs",
    href: "#",
    disabled: true,
    active: false,
  },
  {
    icon: Table,
    label: "AI Sheets",
    href: "#",
    disabled: true,
    active: false,
  },
  {
    icon: Mail,
    label: "AI Emails",
    href: "/",
    disabled: false,
    active: true,
  },
  {
    icon: MoreHorizontal,
    label: "More Tools",
    href: "#",
    disabled: true,
    active: false,
  },
] as const;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header with logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              tooltip="AntV Email Builder"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <BrandIcon className="size-8" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">Chatly</span>
                <span className="truncate text-xs text-muted-foreground">
                  v0.0.1
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild={!item.disabled}
                      isActive={item.active}
                      disabled={item.disabled}
                      tooltip={item.label}
                      className={
                        item.disabled
                          ? "cursor-not-allowed opacity-50"
                          : undefined
                      }
                    >
                      {item.disabled ? (
                        <>
                          <item.icon className="size-4 shrink-0" />
                          <span className="group-data-[collapsible=icon]:hidden">
                            {item.label}
                          </span>
                        </>
                      ) : (
                        <a href={item.href}>
                          <item.icon className="size-4 shrink-0" />
                          <span className="group-data-[collapsible=icon]:hidden">
                            {item.label}
                          </span>
                        </a>
                      )}
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {item.disabled && (
                    <TooltipContent side="right" sideOffset={8}>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        Coming soon
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user avatar */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="User Account">
              <Avatar className="size-8 shrink-0">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback className="bg-linear-to-br from-amber-500 to-orange-500 text-white text-xs font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">John Doe</span>
                <span className="truncate text-xs text-muted-foreground">
                  john@example.com
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
