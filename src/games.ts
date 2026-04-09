export interface Game {
  id: string;
  title: string;
  description: string;
  url: string;
  isLocal?: boolean;
}

interface GameMeta {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  url: string;
}

interface GamesManifest {
  games: GameMeta[];
}

export async function loadDefaultGames(locale: 'en' | 'zh'): Promise<Game[]> {
  try {
    const res = await fetch('/games/games.json');
    const manifest: GamesManifest = await res.json();

    return manifest.games.map((g) => ({
      id: g.id,
      title: locale === 'zh' ? `${g.titleZh} (${g.title})` : g.title,
      description: locale === 'zh' ? g.descriptionZh : g.description,
      url: g.url,
      isLocal: true,
    }));
  } catch (e) {
    console.error('[GameHub] Failed to load games manifest:', e);
    return [];
  }
}

export const defaultGames: Game[] = [];
