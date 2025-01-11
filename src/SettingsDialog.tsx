import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (family: string) => void;
  colorTheme: string;
  setColorTheme: (theme: string) => void;
  encoding: string;
  setEncoding: (encoding: string) => void;
  parser: string;
  setParser: (parser: string) => void;
}
export default function SettingsDialog({
  isOpen,
  onOpenChange,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  colorTheme,
  setColorTheme,
  encoding,
  setEncoding,
  parser,
  setParser,
}: SettingsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent  className={`${colorTheme} bg-background text-foreground`}>
          <DialogHeader>
            <DialogTitle>設定</DialogTitle>
            <DialogDescription>
              フォントサイズやカラーテーマを設定します。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="font-size"
                className="text-sm font-medium mb-1"
              >
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
              <label
                htmlFor="font-family"
                className="text-sm font-medium mb-1"
              >
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
              <label
                htmlFor="color-theme"
                className="text-sm font-medium mb-1"
              >
                カラーテーマ
              </label>
              <Select value={colorTheme} onValueChange={setColorTheme}>
                <SelectTrigger id="color-theme">
                  <SelectValue placeholder="テーマを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theme-white">白</SelectItem>
                  <SelectItem value="theme-gray">グレー</SelectItem>
                  <SelectItem value="theme-cream">生成り</SelectItem>
                  <SelectItem value="theme-blue">水色</SelectItem>
                  <SelectItem value="theme-black">くろ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="parser"
                className="text-sm font-medium mb-1"
              >
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
              <label
                htmlFor="encoding"
                className="text-sm font-medium mb-1"
              >
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
  );
}
