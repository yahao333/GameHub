import React, { useState, useRef, useEffect } from 'react';
import { Game, defaultGames } from './games';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Gamepad2, Upload, Play, Trash2 } from 'lucide-react';

export default function App() {
  // 状态：保存当前所有的游戏列表，初始值为默认的几款游戏
  const [games, setGames] = useState<Game[]>(defaultGames);
  // 引用：用于触发隐藏的文件上传输入框
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 组件挂载时，从浏览器的 localStorage 中读取以前导入的游戏
  useEffect(() => {
    console.log('[调试] 正在尝试从 localStorage 加载已导入的游戏...');
    const savedGames = localStorage.getItem('gamehub_imported_games');
    if (savedGames) {
      try {
        const parsed = JSON.parse(savedGames);
        console.log('[调试] 成功解析已保存的游戏数据:', parsed);
        // 因为 Blob URL 刷新后会失效，我们需要用保存的 HTML 源码重新生成 Blob URL
        const restoredGames = parsed.map((g: any) => {
          const blob = new Blob([g.htmlContent], { type: 'text/html' });
          return {
            ...g,
            url: URL.createObjectURL(blob),
          };
        });
        // 将默认游戏和恢复的导入游戏合并
        setGames([...defaultGames, ...restoredGames]);
        console.log('[调试] 游戏列表更新完毕。当前游戏总数:', defaultGames.length + restoredGames.length);
      } catch (e) {
        console.error("[错误] 无法加载保存的游戏数据:", e);
      }
    } else {
      console.log('[调试] 没有找到已保存的导入游戏。');
    }
  }, []);

  // 点击“导入游戏”按钮时，触发文件选择框的点击事件
  const handleImportClick = () => {
    console.log('[调试] 用户点击了导入游戏按钮');
    fileInputRef.current?.click();
  };

  // 处理文件选择事件
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('[调试] 用户取消了文件选择');
      return;
    }

    console.log('[调试] 用户选择了文件:', file.name, '大小:', file.size, '字节');

    // 校验文件格式，只允许 .html 文件
    if (!file.name.endsWith('.html')) {
      alert('请上传 .html 格式的小游戏文件！');
      console.warn('[警告] 用户上传了非 HTML 文件:', file.name);
      return;
    }

    const reader = new FileReader();
    // 当文件读取完成时触发
    reader.onload = (event) => {
      console.log('[调试] 文件读取完成，正在生成游戏对象...');
      const htmlContent = event.target?.result as string;
      
      // 创建一个新的游戏对象
      const newGame: Game & { htmlContent?: string } = {
        id: `imported-${Date.now()}`, // 使用时间戳作为唯一ID
        title: file.name.replace('.html', ''), // 去掉后缀作为标题
        description: '用户导入的小游戏',
        // 将 HTML 字符串转换为 Blob，并生成一个可在 iframe 中使用的 URL
        url: URL.createObjectURL(new Blob([htmlContent], { type: 'text/html' })),
        isLocal: true,
        htmlContent // 保存源码，以便下次刷新时可以重新生成 Blob URL
      };

      const updatedGames = [...games, newGame];
      setGames(updatedGames);
      console.log('[调试] 新游戏已添加到列表:', newGame.title);

      // 将所有导入的游戏保存到 localStorage 中，以便刷新页面后不丢失
      const importedOnly = updatedGames.filter(g => g.id.startsWith('imported-')).map(g => ({
        id: g.id,
        title: g.title,
        description: g.description,
        isLocal: g.isLocal,
        htmlContent: (g as any).htmlContent
      }));
      localStorage.setItem('gamehub_imported_games', JSON.stringify(importedOnly));
      console.log('[调试] 导入的游戏已保存到 localStorage');
    };
    
    // 以文本形式读取文件
    reader.readAsText(file);
    
    // 清空 input 的值，这样如果用户再次选择同一个文件也能触发 onChange 事件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 删除导入的游戏
  const removeGame = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发卡片的点击事件
    console.log('[调试] 用户请求删除游戏，ID:', id);
    
    const updatedGames = games.filter(g => g.id !== id);
    setGames(updatedGames);
    
    // 更新 localStorage
    const importedOnly = updatedGames.filter(g => g.id.startsWith('imported-')).map(g => ({
      id: g.id,
      title: g.title,
      description: g.description,
      isLocal: g.isLocal,
      htmlContent: (g as any).htmlContent
    }));
    localStorage.setItem('gamehub_imported_games', JSON.stringify(importedOnly));
    console.log('[调试] 游戏已删除，列表已更新');
  };

  // 点击开始游戏
  const startGame = (game: Game) => {
    console.log('[调试] 准备在新标签页启动游戏:', game.title);
    // 使用 window.open 在新标签页打开游戏的 Blob URL
    // 注意：在某些浏览器或预览环境中，可能需要允许弹出窗口
    window.open(game.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-emerald-500/30">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400">
            <Gamepad2 className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">GameHub</h1>
          </div>
          <div>
            {/* 隐藏的文件输入框，通过按钮点击触发 */}
            <input 
              type="file" 
              accept=".html" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button 
              onClick={handleImportClick}
              variant="outline" 
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              导入游戏 (.html)
            </Button>
          </div>
        </div>
      </header>

      {/* 主体内容区 */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">游戏大厅</h2>
          <p className="text-zinc-400">选择一个小游戏开始游玩，或者导入你自己的 HTML 游戏文件。</p>
        </div>

        {/* 游戏卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden group flex flex-col"
            >
              {/* 游戏封面占位图 */}
              <div className="aspect-video bg-zinc-950 flex items-center justify-center relative overflow-hidden">
                <Gamepad2 className="w-16 h-16 text-zinc-800 group-hover:text-emerald-500/20 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-80" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-zinc-100 group-hover:text-emerald-400 transition-colors">
                  {game.title}
                </CardTitle>
                <CardDescription className="text-zinc-400 line-clamp-2">
                  {game.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-4 mt-auto flex gap-2">
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                  onClick={() => startGame(game)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  开始游戏
                </Button>
                {/* 只有导入的游戏才显示删除按钮 */}
                {game.id.startsWith('imported-') && (
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={(e) => removeGame(game.id, e)}
                    title="删除游戏"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
