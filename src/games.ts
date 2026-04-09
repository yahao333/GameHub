export interface Game {
  id: string; // 游戏的唯一标识符
  title: string; // 游戏标题
  description: string; // 游戏描述
  url: string; // 游戏的访问地址（可以是外部链接，或者是本地生成的 Blob URL）
  isLocal?: boolean; // 标记是否为本地/导入的游戏
}

// 经典的贪吃蛇游戏 HTML 源码
const snakeHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Snake</title>
  <style>
    body { background: #111; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; }
    canvas { background: #000; border: 2px solid #333; box-shadow: 0 0 20px rgba(0,255,0,0.2); }
    h1 { margin-bottom: 10px; color: #0f0; }
    #score { font-size: 24px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>Snake</h1>
  <div id="score">Score: 0</div>
  <canvas id="game" width="400" height="400"></canvas>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const grid = 20;
    let count = 0;
    let score = 0;
    let snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
    let apple = { x: 320, y: 320 };

    function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }
    function reset() { snake.x = 160; snake.y = 160; snake.cells = []; snake.maxCells = 4; snake.dx = grid; snake.dy = 0; score = 0; document.getElementById('score').innerText = 'Score: ' + score; apple.x = getRandomInt(0, 20) * grid; apple.y = getRandomInt(0, 20) * grid; }

    function loop() {
      requestAnimationFrame(loop);
      if (++count < 6) return;
      count = 0;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      snake.x += snake.dx; snake.y += snake.dy;
      if (snake.x < 0) snake.x = canvas.width - grid; else if (snake.x >= canvas.width) snake.x = 0;
      if (snake.y < 0) snake.y = canvas.height - grid; else if (snake.y >= canvas.height) snake.y = 0;
      snake.cells.unshift({x: snake.x, y: snake.y});
      if (snake.cells.length > snake.maxCells) snake.cells.pop();

      ctx.fillStyle = 'red';
      ctx.fillRect(apple.x, apple.y, grid-1, grid-1);

      ctx.fillStyle = 'lime';
      snake.cells.forEach(function(cell, index) {
        ctx.fillRect(cell.x, cell.y, grid-1, grid-1);
        if (cell.x === apple.x && cell.y === apple.y) {
          snake.maxCells++;
          score += 10;
          document.getElementById('score').innerText = 'Score: ' + score;
          apple.x = getRandomInt(0, 20) * grid;
          apple.y = getRandomInt(0, 20) * grid;
        }
        for (let i = index + 1; i < snake.cells.length; i++) {
          if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) reset();
        }
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.which === 37 && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
      else if (e.which === 38 && snake.dy === 0) { snake.dy = -grid; snake.dx = 0; }
      else if (e.which === 39 && snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
      else if (e.which === 40 && snake.dy === 0) { snake.dy = grid; snake.dx = 0; }
    });
    requestAnimationFrame(loop);
  </script>
</body>
</html>
`;

// 经典的弹球游戏 HTML 源码
const pongHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Pong</title>
  <style>
    body { background: #222; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: monospace; }
    canvas { background: #000; border: 2px solid #fff; }
    h1 { margin-bottom: 10px; }
  </style>
</head>
<body>
  <h1>Pong</h1>
  <canvas id="game" width="600" height="400"></canvas>
  <p>Use W/S and Up/Down arrows to move.</p>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const paddleWidth = 10, paddleHeight = 80;
    let leftPaddleY = 160, rightPaddleY = 160;
    let ballX = 300, ballY = 200, ballDX = 4, ballDY = 4, ballRadius = 6;
    let leftScore = 0, rightScore = 0;
    let keys = {};

    document.addEventListener('keydown', e => keys[e.key] = true);
    document.addEventListener('keyup', e => keys[e.key] = false);

    function update() {
      if (keys['w'] && leftPaddleY > 0) leftPaddleY -= 6;
      if (keys['s'] && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += 6;
      if (keys['ArrowUp'] && rightPaddleY > 0) rightPaddleY -= 6;
      if (keys['ArrowDown'] && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += 6;

      ballX += ballDX; ballY += ballDY;

      if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) ballDY = -ballDY;

      if (ballX - ballRadius < paddleWidth) {
        if (ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) { ballDX = -ballDX; ballX = paddleWidth + ballRadius; }
        else { rightScore++; resetBall(); }
      } else if (ballX + ballRadius > canvas.width - paddleWidth) {
        if (ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) { ballDX = -ballDX; ballX = canvas.width - paddleWidth - ballRadius; }
        else { leftScore++; resetBall(); }
      }
    }

    function resetBall() { ballX = 300; ballY = 200; ballDX = -ballDX; }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
      ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
      ctx.beginPath(); ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2); ctx.fill();
      ctx.font = '30px monospace';
      ctx.fillText(leftScore, 150, 50);
      ctx.fillText(rightScore, 430, 50);
      ctx.setLineDash([5, 15]);
      ctx.beginPath(); ctx.moveTo(300, 0); ctx.lineTo(300, 400); ctx.stroke();
    }

    function loop() { update(); draw(); requestAnimationFrame(loop); }
    requestAnimationFrame(loop);
  </script>
</body>
</html>
`;

/**
 * 辅助函数：将 HTML 字符串转换为可以在 iframe 中加载的 Blob URL
 * 这样可以让我们在本地直接运行 HTML 游戏，而不需要外部服务器
 */
function createBlobUrl(html: string) {
  const blob = new Blob([html], { type: 'text/html' });
  return URL.createObjectURL(blob);
}

// 默认提供的几款小游戏
export const defaultGames: Game[] = [
  {
    id: 'snake',
    title: '复古贪吃蛇 (Snake)',
    description: '经典的贪吃蛇游戏。使用键盘方向键控制蛇吃苹果，不要撞到墙壁或自己的身体！',
    url: createBlobUrl(snakeHtml),
    isLocal: true,
  },
  {
    id: 'pong',
    title: '双人弹球 (Pong)',
    description: '经典的双人弹球游戏。左侧玩家使用 W/S 键，右侧玩家使用上下方向键。',
    url: createBlobUrl(pongHtml),
    isLocal: true,
  }
];
