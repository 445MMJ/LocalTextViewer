'use client'
import { get, set } from 'idb-keyval';
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Settings, Logs, FolderOpen, CircleArrowRight, FileJson, History } from 'lucide-react'

export default function TextViewer() {
  const [isOverlayOpen, setOverlayOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState('sans')
  const [colorTheme, setColorTheme] = useState('theme-gray');
  const [text, setText] = useState("");
  const [files, setFiles] = useState<
    { name: string; handle: FileSystemFileHandle }[]
  >([]);
  const [currentFileName, setCurrentFileName] = useState("");
  const [encoding, setEncoding] = useState("UTF-8"); // 文字コードの状態を追加
  const [parser, setParser] = useState("なろう"); // パーサーの選択状態を追加
  
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
  }

  const handleDirectoryFromStore = async () => {
    try {
      const directoryHandleOrUndefined = await get('directory');
      if (directoryHandleOrUndefined) {
        console.log(`Retrieved directroy handle "${directoryHandleOrUndefined.name}" from IndexedDB.`) 
        await verifyPermission(directoryHandleOrUndefined);
        const fileList: { name: string; handle: FileSystemFileHandle }[] = [];
        for await (const [name, handle] of directoryHandleOrUndefined) {
          console.log(`Stored directory handle "${directoryHandleOrUndefined.name}" from IndexedDB.`) 
          if (handle.kind === "file") {
            fileList.push({ name, handle });
          }
        }
        setFiles(fileList);
      }
    } catch (error) {
      console.error("Error reading directory:", error);
    }
  }

  const handleDirectoryChange = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      await set('directory', directoryHandle);
      const fileList: { name: string; handle: FileSystemFileHandle }[] = [];
      for await (const [name, handle] of directoryHandle) {
        console.log(`Stored directory handle "${directoryHandle.name}" from IndexedDB.`) 
        if (handle.kind === "file") {
          fileList.push({ name, handle });
        }
      }
      setFiles(fileList);
    } catch (error) {
      console.error("Error reading directory:", error);
    }
  };

  const handleFileClick = async (fileHandle: FileSystemFileHandle) => {
    try {
      const file = await fileHandle.getFile();
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setText(fileContent);
        setCurrentFileName(file.name); // 現在のファイル名を設定
      };
      reader.readAsText(file, encoding); // 文字コードを変数として渡す
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const handleNextFileClick = () => {
    const match = currentFileName.match(/^([a-zA-Z0-9]+)-(\d+)(\.\w+)$/);
    if (match) {
      const [, code, number, extension] = match;
      const nextNumber = String(parseInt(number, 10) + 1).padStart(
        number.length,
        "0",
      );
      const nextFileName = `${code}-${nextNumber}${extension}`;
      const nextFile = files.find((file) => file.name === nextFileName);
      if (nextFile) {
        handleFileClick(nextFile.handle);
      } else {
        alert("次のファイルが見つかりません");
      }
    } else {
      alert("現在のファイル名が連番形式ではありません");
    }
  };

  const parseNarouSyntax = (inputText: string) => {
    // 改行ごとにテキストを分割し、各トークンを <p>token<br/></p> として表示
    const lines = inputText.split("\n");
    const parsedLines = lines.map((line) => `<p>${line}<br/></p>`).join("");

    // ルビとして表示させたくない部分をプレースホルダーに置き換え
    let unifiedText = parsedLines
      .replace(/｜\((.*?)\)/g, "PLACEHOLDER_ROUND($1)")
      .replace(/｜（(.*?)）/g, "PLACEHOLDER_SQUARE($1)");

    // 縦棒を使ったルビ記法の統一
    unifiedText = unifiedText
      .replace(/｜(.*?)《(.*?)》/g, "｜$1《$2》") // 全角縦棒と《》
      .replace(/\|(.*?)《(.*?)》/g, "｜$1《$2》") // 半角縦棒と《》
      .replace(/｜(.*?)\((.*?)\)/g, "｜$1《$2》") // 全角縦棒と()
      .replace(/\|(.*?)\((.*?)\)/g, "｜$1《$2》") // 半角縦棒と()
      .replace(/｜(.*?)（(.*?)）/g, "｜$1《$2》") // 全角縦棒と（）
      .replace(/\|(.*?)（(.*?)）/g, "｜$1《$2》"); // 半角縦棒と（）

    // 縦棒を使わないルビ記法の処理
    unifiedText = unifiedText
      .replace(
        /([\u4E00-\u9FFF]+)（([\u3040-\u309F\u30A0-\u30FF]+)）/g,
        "｜$1《$2》",
      ) // 全角括弧
      .replace(
        /([\u4E00-\u9FFF]+)\(([\u3040-\u309F\u30A0-\u30FF]+)\)/g,
        "｜$1《$2》",
      ); // 半角括弧

    // プレースホルダーを元の形式に戻す
    unifiedText = unifiedText
      .replace(/PLACEHOLDER_ROUND\((.*?)\)/g, "($1)")
      .replace(/PLACEHOLDER_SQUARE\((.*?)\)/g, "（$1）");

    // ルビ記法: ｜漢字《かんじ》 を <ruby> に変換
    const parsedText = unifiedText.replace(
      /｜(.*?)《(.*?)》/g,
      "<ruby>$1<rt>$2</rt></ruby>",
    );

    return parsedText;
  };

  const parseKakuyomuSyntax = (inputText: string) => {
    // ダミーパーサーの実装
    return inputText.replace(/dummy/g, "<strong>dummy</strong>");
  };

  const parseAozoraSyntax = (inputText: string) => {
    // ダミーパーサーの実装
    return inputText.replace(/dummy/g, "<strong>dummy</strong>");
  };

  const parseText = (inputText: string) => {
    switch (parser) {
      case "なろう":
        return parseNarouSyntax(inputText);
      case "カクヨム":
        return parseKakuyomuSyntax(inputText);
      case "青空文庫":
        return parseAozoraSyntax(inputText);
      default:
        return inputText;
    }
  };
  
  const handleColorThemeChange = (theme: string) => {
    setColorTheme(theme);
  };

  return (
    <div className={`flex flex-col h-screen ${colorTheme} bg-background text-foreground`}>
      <header className="flex items-center  justify-end p-4 bg-background border-b">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <h1 className="text-lg font-semibold"></h1>{currentFileName}
          <Button variant="outline" size="icon" onClick={() => setOverlayOpen(true)}>
            <Settings className="h-4 w-4" />
            <span className="sr-only">設定</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Logs className="h-4 w-4" />
            <span className="sr-only">ファイル一覧</span>
          </Button>
        </div>
      </header>

      <main className={`flex-1 overflow-auto p-4`}>
        <div
          className={`max-w-3xl mx-auto text-viewer-content font-${fontFamily} `} 
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: parseText(text) }}
        >
        </div>
      </main>

      <Dialog open={isOverlayOpen} onOpenChange={setOverlayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>設定</DialogTitle>
            <DialogDescription>フォントサイズやカラーテーマを設定します。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="font-size" className="block text-sm font-medium mb-1">
                フォントサイズ: {fontSize}px
              </label>
              <Slider
                id="font-size"
                min={12}
                max={24}
                step={1}
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
              />
            </div>
            <div>
              <label htmlFor="font-family" className="block text-sm font-medium mb-1">
                フォントファミリー
              </label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger id="font-family">
                  <SelectValue placeholder="フォントを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans">Sans-serif</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="mono">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="color-theme" className="block text-sm font-medium mb-1">
                カラーテーマ
              </label>
              <Select value={colorTheme} onValueChange={handleColorThemeChange}>
                <SelectTrigger id="color-theme">
                  <SelectValue placeholder="テーマを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theme-white">白</SelectItem>
                  <SelectItem value="theme-gray">グレー</SelectItem>
                  <SelectItem value="theme-cream">生成り</SelectItem>
                  <SelectItem value="theme-blue">水色</SelectItem>
                  <SelectItem value="dark">くろ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="parser" className="block text-sm font-medium mb-1">
                パーサー
              </label>
              <Select value={parser} onValueChange={setParser}>
                <SelectTrigger id="parser">
                  <SelectValue placeholder="パーサーを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="なろう">なろう</SelectItem>
                  <SelectItem value="カクヨム">カクヨム</SelectItem>
                  <SelectItem value="青空文庫">青空文庫</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="encoding" className="block text-sm font-medium mb-1">
                エンコード
              </label>
              <Select value={encoding} onValueChange={setEncoding}>
                <SelectTrigger id="encoding">
                  <SelectValue placeholder="エンコードを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTF-8">UTF-8</SelectItem>
                  <SelectItem value="Shift-JIS">Shift-JIS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogClose asChild>
            <Button className="mt-4">閉じる</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

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
            <History  className="h-4 w-4" />
            </Button>
            <Button  variant="outline" size="icon" onClick={handleNextFileClick}>
            <CircleArrowRight className="h-4 w-4" />
            </Button>
            <a href="https://github.com/445MMJ/LocalTextViewer">
            <Button variant="outline" size="icon">
            <FileJson   className="h-4 w-4" />
            </Button></a>
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
    </div>
  )
}

