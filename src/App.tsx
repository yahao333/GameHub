import React, { useState, useRef, useEffect } from 'react';
import { Game, defaultGames } from './games';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Gamepad2, Upload, Play, Trash2, Globe } from 'lucide-react';
import { useI18n, Locale } from './i18n';

export default function App() {
  const { locale, setLocale, t } = useI18n();
  const [games, setGames] = useState<Game[]>(defaultGames);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedGames = localStorage.getItem('gamehub_imported_games');
    if (savedGames) {
      try {
        const parsed = JSON.parse(savedGames);
        const restoredGames = parsed.map((g: any) => {
          const blob = new Blob([g.htmlContent], { type: 'text/html' });
          return {
            ...g,
            url: URL.createObjectURL(blob),
          };
        });
        setGames([...defaultGames, ...restoredGames]);
      } catch (e) {
        console.error('[Error] Failed to load saved games:', e);
      }
    }
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html')) {
      alert(t.invalidFile);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const htmlContent = event.target?.result as string;

      const newGame: Game & { htmlContent?: string } = {
        id: `imported-${Date.now()}`,
        title: file.name.replace('.html', ''),
        description: t.importedGame,
        url: URL.createObjectURL(new Blob([htmlContent], { type: 'text/html' })),
        isLocal: true,
        htmlContent,
      };

      const updatedGames = [...games, newGame];
      setGames(updatedGames);

      const importedOnly = updatedGames.filter(g => g.id.startsWith('imported-')).map(g => ({
        id: g.id,
        title: g.title,
        description: g.description,
        isLocal: g.isLocal,
        htmlContent: (g as any).htmlContent,
      }));
      localStorage.setItem('gamehub_imported_games', JSON.stringify(importedOnly));
    };

    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeGame = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t.confirmDelete)) return;

    const updatedGames = games.filter(g => g.id !== id);
    setGames(updatedGames);

    const importedOnly = updatedGames.filter(g => g.id.startsWith('imported-')).map(g => ({
      id: g.id,
      title: g.title,
      description: g.description,
      isLocal: g.isLocal,
      htmlContent: (g as any).htmlContent,
    }));
    localStorage.setItem('gamehub_imported_games', JSON.stringify(importedOnly));
  };

  const startGame = (game: Game) => {
    window.open(game.url, '_blank', 'noopener,noreferrer');
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400">
            <Gamepad2 className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">GameHub</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition-colors text-sm"
              title="Toggle Language"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium">{locale === 'en' ? '中文' : 'EN'}</span>
            </button>
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
              {t.importGame}
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">{t.gameHall}</h2>
          <p className="text-zinc-400">{t.selectGame}</p>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{t.noGames}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <Card
                key={game.id}
                className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden group flex flex-col"
              >
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
                    {t.startGame}
                  </Button>
                  {game.id.startsWith('imported-') && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => removeGame(game.id, e)}
                      title={t.deleteGame}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6">
        <div className="container mx-auto px-4 text-center text-zinc-500 text-sm">
          {t.builtWith}
        </div>
      </footer>
    </div>
  );
}
