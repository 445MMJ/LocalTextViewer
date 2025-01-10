import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  items: [
    {
      title: 'Routing',
      url: '#',
    },
    {
      title: 'Data Fetching',
      url: '#',
      isActive: true,
    },
    {
      title: 'Rendering',
      url: '#',
    },
    {
      title: 'Caching',
      url: '#',
    },
    {
      title: 'Styling',
      url: '#',
    },
    {
      title: 'Optimizing',
      url: '#',
    },
    {
      title: 'Configuring',
      url: '#',
    },
    {
      title: 'Testing',
      url: '#',
    },
    {
      title: 'Authentication',
      url: '#',
    },
    {
      title: 'Deploying',
      url: '#',
    },
    {
      title: 'Upgrading',
      url: '#',
    },
    {
      title: 'Examples',
      url: '#',
    },
  ],
};

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent className="gap-0">
              <SidebarMenu>
                {data.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
