"use client"

import { ReactNode } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';

const projects = [
  {
    name: "Design Engineering",
    url: "#",
  },
  {
    name: "Sales & Marketing",
    url: "#",
  },
  {
    name: "Travel",
    url: "#",
  },
  {
    name: "Support",
    url: "#",
  },
  {
    name: "Feedback",
    url: "#",
  },
]

interface HeaderProps {
  children: ReactNode;
}

export default function AppSidebar({ children }: HeaderProps) {
  return (
      <Sidebar side="right" variant="sidebar" collapsible="offcanvas">
        <SidebarHeader>{children}</SidebarHeader>
        <SidebarContent>
            <SidebarGroupLabel></SidebarGroupLabel>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <a href={project.url}>
                        <span>{project.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>ふったーだよ</SidebarFooter>
      </Sidebar>
  )
}