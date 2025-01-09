import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderOpen, History, CircleArrowRight, FileJson } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  colorTheme: string;
  files: { name: string; handle: any }[];
  handleDirectoryChange: () => void;
  handleDirectoryFromStore: () => void;
  handleNextFileClick: () => void;
  handleFileClick: (handle: any) => void;
}

const AppSidebar: React.FC<SidebarProps> = ({
  colorTheme,
  files,
  handleDirectoryChange,
  handleDirectoryFromStore,
  handleNextFileClick,
  handleFileClick
}) => {
  return (
    <Sidebar collapsible="none" className={`${colorTheme}`}>
      <SidebarHeader>          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleDirectoryChange}>
              <FolderOpen className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDirectoryFromStore}>
              <History className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextFileClick}>
              <CircleArrowRight className="h-4 w-4" />
            </Button>
            <a href="https://github.com/445MMJ/LocalTextViewer">
              <Button variant="outline" size="icon">
                <FileJson className="h-4 w-4" />
              </Button>
            </a>
          </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            
          {files.map((file, index) => (
                          <SidebarMenuItem key={index}><SidebarMenuButton asChild>
                          <a className="font-medium" onClick={() => handleFileClick(file.handle)}>
                          {file.name}
                          </a>
                        </SidebarMenuButton></SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
export default AppSidebar;