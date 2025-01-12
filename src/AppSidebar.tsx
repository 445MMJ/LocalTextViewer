'use client';

import { ReactNode } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';

interface file {
  name: string;
  handle: FileSystemFileHandle;
}

interface HeaderProps {
  children: ReactNode;
  files: file[];
  handleFileClick: (fileHandle: FileSystemFileHandle) => Promise<void>;
  colorTheme: string;
}

export default function AppSidebar({ children, files, handleFileClick, colorTheme }: HeaderProps) {
  return (
    <Sidebar side="right" variant="sidebar" collapsible="offcanvas" colorTheme={colorTheme}>
      <SidebarHeader>{children}</SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {files.map((file) => (
            <SidebarMenuItem key={file.name}>
              <SidebarMenuButton asChild onClick={() => handleFileClick(file.handle)}>
                <a href="#">
                  <span>{file.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <a href="https://github.com/445MMJ/LocalTextViewer">
          <span>GitHub</span>
        </a>
      </SidebarFooter>
    </Sidebar>
  );
}
