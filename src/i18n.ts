import { createContext, useContext, useState, ReactNode } from 'react';

export type Locale = 'en' | 'zh';

interface Translations {
  // Header
  importGame: string;
  // Main
  gameHall: string;
  selectGame: string;
  startGame: string;
  deleteGame: string;
  // Card
  importedGame: string;
  // Empty
  noGames: string;
  // Delete confirm
  confirmDelete: string;
  // Errors
  invalidFile: string;
  // Footer
  builtWith: string;
}

const translations: Record<Locale, Translations> = {
  en: {
    importGame: 'Import Game (.html)',
    gameHall: 'Game Hall',
    selectGame: 'Choose a mini-game to play, or import your own HTML game file.',
    startGame: 'Play',
    deleteGame: 'Delete Game',
    importedGame: 'Imported Game',
    noGames: 'No games available',
    confirmDelete: 'Are you sure you want to delete this game?',
    invalidFile: 'Please upload a .html format game file!',
    builtWith: 'Built with React + Vite',
  },
  zh: {
    importGame: '导入游戏 (.html)',
    gameHall: '游戏大厅',
    selectGame: '选择一个小游戏开始游玩，或者导入你自己的 HTML 游戏文件。',
    startGame: '开始游戏',
    deleteGame: '删除游戏',
    importedGame: '导入的游戏',
    noGames: '暂无游戏',
    confirmDelete: '确定要删除这个游戏吗？',
    invalidFile: '请上传 .html 格式的小游戏文件！',
    builtWith: '使用 React + Vite 构建',
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem('gamehub_locale');
    return (stored === 'zh' || stored === 'en') ? stored : 'en';
  });

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('gamehub_locale', newLocale);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
