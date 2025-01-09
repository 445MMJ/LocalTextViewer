import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { FolderOpen, History, CircleArrowRight, FileJson } from 'lucide-react';

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

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  colorTheme,
  files,
  handleDirectoryChange,
  handleDirectoryFromStore,
  handleNextFileClick,
  handleFileClick
}) => {
  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetContent side="right" className={`sidebar w-[15rem] sm:w-[15rem] ${colorTheme} bg-background text-foreground`}>
        <SheetHeader>
          <SheetTitle>ファイル一覧</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <div className="flex space-x-2">
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
          <div className="py-4">
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} onClick={() => handleFileClick(file.handle)}>
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;