export interface Game {
  id: string;
  title: string;
  description: string;
  url: string;
  isLocal?: boolean;
}

export const defaultGames: Game[] = [
  {
    id: 'snake',
    title: '复古贪吃蛇 (Snake)',
    description: '经典的贪吃蛇游戏。使用方向键或 WASD 控制蛇吃苹果，不要撞到墙壁或自己的身体！',
    url: '/games/snake.html',
    isLocal: true,
  },
  {
    id: 'pong',
    title: '双人弹球 (Pong)',
    description: '经典的双人弹球游戏。左侧玩家使用 W/S 键，右侧玩家使用上下方向键。',
    url: '/games/pong.html',
    isLocal: true,
  },
];
