'use client';
import { get, set } from 'idb-keyval';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Settings,
  TableOfContents,
  SquareX,
  FolderOpen,
  History,
  CircleArrowRight,
} from 'lucide-react';
import Header from './header.tsx';
import SettingsDialog from './SettingsDialog.tsx';
import AppSidebar from './AppSidebar.tsx';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
export default function TextViewer() {
  const [isOverlayOpen, setOverlayOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('sans');
  const [colorTheme, setColorTheme] = useState('theme-blue');
  const [text, setText] = useState('');
  const [files, setFiles] = useState<
    { name: string; handle: FileSystemFileHandle }[]
  >([]);
  const [currentFileName, setCurrentFileName] = useState('dir');
  const [currentDirectoryName, setCurrentDirectoryName] = useState('file');
  const [encoding, setEncoding] = useState('UTF-8'); // 文字コードの状態を追加
  const [parser, setParser] = useState('なろう'); // パーサーの選択状態を追加
  const mainRef = useRef<HTMLDivElement>(null);
  const verifyPermission = async (fileHandle: FileSystemDirectoryHandle) => {
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission()) === 'granted') {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission()) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  };

  const handleDirectoryFromStore = async () => {
    try {
      const directoryHandleOrUndefined = await get('directory');
      if (directoryHandleOrUndefined) {
        console.info(
          `Retrieved directroy handle "${directoryHandleOrUndefined.name}" from IndexedDB.`
        );
        await verifyPermission(directoryHandleOrUndefined);
        setCurrentDirectoryName(directoryHandleOrUndefined.name);
        const fileList: { name: string; handle: FileSystemFileHandle }[] = [];
        for await (const [name, handle] of directoryHandleOrUndefined) {
          if (handle.kind === 'file') {
            fileList.push({ name, handle });
          }
        }
        setFiles(fileList);
        const fileHandle = await get('file');
        await handleFileClick(fileHandle);
      }
    } catch (error) {
      console.error('Error reading directory:', error);
    }
  };

  const handleDirectoryChange = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      setCurrentDirectoryName(directoryHandle.name);
      console.info(
        `Store directory handle "${directoryHandle.name}" in IndexedDB`
      );
      await set('directory', directoryHandle);
      const fileList: { name: string; handle: FileSystemFileHandle }[] = [];
      for await (const [name, handle] of directoryHandle) {
        if (handle.kind === 'file') {
          fileList.push({ name, handle });
        }
      }
      setFiles(fileList);
    } catch (error) {
      console.error('Error reading directory:', error);
    }
  };

  const handleFileClick = async (fileHandle: FileSystemFileHandle) => {
    try {
      const file = await fileHandle.getFile();
      await set('file', fileHandle);
      console.info(`Open file handle "${fileHandle.name}"`);
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setText(fileContent);
        setCurrentFileName(file.name); // 現在のファイル名を設定
      };
      reader.readAsText(file, encoding); // 文字コードを変数として渡す
      if (mainRef.current) {
        mainRef.current.scrollTop = 0; // スクロールを上に戻す
      }
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const handleNextFileClick = () => {
    const match = currentFileName.match(/^([a-zA-Z0-9]+)-(\d+)(\.\w+)$/);
    if (match) {
      const [, code, number, extension] = match;
      const nextNumber = String(parseInt(number, 10) + 1).padStart(
        number.length,
        '0'
      );
      const nextFileName = `${code}-${nextNumber}${extension}`;
      const nextFile = files.find((file) => file.name === nextFileName);
      if (nextFile) {
        handleFileClick(nextFile.handle);
      } else {
        alert('次のファイルが見つかりません');
      }
    } else {
      alert('現在のファイル名が連番形式ではありません');
    }
    if (mainRef.current) {
      mainRef.current.scrollTop = 0; // スクロールを上に戻す
    }
  };

  const parseNarouSyntax = (inputText: string) => {
    // 改行ごとにテキストを分割し、各トークンを <p>token<br/></p> として表示
    const lines = inputText.split('\n');
    const parsedLines = lines.map((line) => `<p>${line}<br/></p>`).join('');

    // ルビとして表示させたくない部分をプレースホルダーに置き換え
    let unifiedText = parsedLines
      .replace(/｜\((.*?)\)/g, 'PLACEHOLDER_ROUND($1)')
      .replace(/｜（(.*?)）/g, 'PLACEHOLDER_SQUARE($1)');

    // 縦棒を使ったルビ記法の統一
    unifiedText = unifiedText
      .replace(/｜(.*?)《(.*?)》/g, '｜$1《$2》') // 全角縦棒と《》
      .replace(/\|(.*?)《(.*?)》/g, '｜$1《$2》') // 半角縦棒と《》
      .replace(/｜(.*?)\((.*?)\)/g, '｜$1《$2》') // 全角縦棒と()
      .replace(/\|(.*?)\((.*?)\)/g, '｜$1《$2》') // 半角縦棒と()
      .replace(/｜(.*?)（(.*?)）/g, '｜$1《$2》') // 全角縦棒と（）
      .replace(/\|(.*?)（(.*?)）/g, '｜$1《$2》'); // 半角縦棒と（）

    // 縦棒を使わないルビ記法の処理
    unifiedText = unifiedText
      .replace(
        /([\u4E00-\u9FFF]+)（([\u3040-\u309F\u30A0-\u30FF]+)）/g,
        '｜$1《$2》'
      ) // 全角括弧
      .replace(
        /([\u4E00-\u9FFF]+)\(([\u3040-\u309F\u30A0-\u30FF]+)\)/g,
        '｜$1《$2》'
      ); // 半角括弧

    // プレースホルダーを元の形式に戻す
    unifiedText = unifiedText
      .replace(/PLACEHOLDER_ROUND\((.*?)\)/g, '($1)')
      .replace(/PLACEHOLDER_SQUARE\((.*?)\)/g, '（$1）');

    // ルビ記法: ｜漢字《かんじ》 を <ruby> に変換
    const parsedText = unifiedText.replace(
      /｜(.*?)《(.*?)》/g,
      '<ruby>$1<rt>$2</rt></ruby>'
    );

    return parsedText;
  };

  const parseKakuyomuSyntax = (inputText: string) => {
    // ダミーパーサーの実装
    return inputText.replace(/dummy/g, '<strong>dummy</strong>');
  };

  const parseAozoraSyntax = (inputText: string) => {
    // ダミーパーサーの実装
    return inputText.replace(/dummy/g, '<strong>dummy</strong>');
  };

  const parseText = (inputText: string) => {
    switch (parser) {
      case 'なろう':
        return parseNarouSyntax(inputText);
      case 'カクヨム':
        return parseKakuyomuSyntax(inputText);
      case '青空文庫':
        return parseAozoraSyntax(inputText);
      default:
        return inputText;
    }
  };
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`flex flex-col h-screen ${colorTheme} bg-background text-foreground`}
    >
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <SidebarInset>
          <Header>
            <Separator orientation="vertical" className="h-5 w-[1px]" />
            <p>{currentDirectoryName}</p>
            <Separator orientation="vertical" className="h-5 w-[1px]" />
            <p>{currentFileName}</p>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setOverlayOpen(true)}
            >
              <Settings className="h-4" />
              <span className="sr-only">設定</span>
            </Button>
            <Button
              onClick={() => setOpen((open) => !open)}
              size="icon"
              variant="outline"
            >
              {open ? <SquareX /> : <TableOfContents />}
              <span className="sr-only">目次</span>
            </Button>
          </Header>

          <main ref={mainRef} className={`flex-1 overflow-auto p-4`}>
            <div
              className={`max-w-3xl mx-auto text-viewer-content font-${fontFamily} `}
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: parseText(text) }}
            >
            </div>
            <div className="max-w-3xl mx-auto text-center">
            <Button
              onClick={handleNextFileClick}
              variant="secondary"
              className='w-full h-10 rounded-md px-8'
            >
              <span >次のファイル</span>
            </Button>
              </div>
          </main>

          <SettingsDialog
            isOpen={isOverlayOpen}
            onOpenChange={setOverlayOpen}
            fontSize={fontSize}
            setFontSize={setFontSize}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            colorTheme={colorTheme}
            setColorTheme={setColorTheme}
            encoding={encoding}
            setEncoding={setEncoding}
            parser={parser}
            setParser={setParser}
          />
        </SidebarInset>
        <AppSidebar
          children={
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDirectoryChange}
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDirectoryFromStore}
              >
                <History className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextFileClick}
              >
                <CircleArrowRight className="h-4 w-4" />
              </Button>
            </div>
          }
          files={files}
          handleFileClick={handleFileClick}
        ></AppSidebar>
      </SidebarProvider>
    </div>
  );
}
