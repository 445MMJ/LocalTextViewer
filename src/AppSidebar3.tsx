import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderOpen, History, CircleArrowRight, FileJson } from 'lucide-react';
import { useSidebar } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  colorTheme: string;
  files: { name: string; handle: any }[];
  handleDirectoryChange: () => void;
  handleDirectoryFromStore: () => void;
  handleNextFileClick: () => void;
  handleFileClick: (handle: any) => void;
}
const AppSidebar: React.FC<AppSidebarProps> = ({
  colorTheme,
  files,
  handleDirectoryChange,
  handleDirectoryFromStore,
  handleNextFileClick,
  handleFileClick,
}) => {
  return (
    <Sidebar side="right" variant="sidebar" collapsible="offcanvas" className={`${colorTheme}`}>
      <SidebarHeader>
        {' '}
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handleDirectoryChange}>
            <FolderOpen className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDirectoryFromStore}
          >
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
            {files.map((file) => (
                <SidebarMenuButton asChild onClick={() => handleFileClick(file.handle)}>
                <a href="#">{file.name}</a>
                </SidebarMenuButton>
            ))}
      </SidebarContent>
    </Sidebar>
  );
};
export default AppSidebar;
