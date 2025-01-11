import { ReactNode } from 'react';
import { FileText } from 'lucide-react'

interface HeaderProps {
  children: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    /*{ border-b の部分はなくてもいいかも}*/
<header className="flex items-center  justify-end p-4 bg-background border-b">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <h1 className="text-lg font-semibold"></h1>
          {children}
        </div>
      </header>
  );
}