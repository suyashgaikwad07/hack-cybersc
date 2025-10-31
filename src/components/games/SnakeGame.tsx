import { useEffect, useRef, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import snakeHead from '@/assets/snake-head.png';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'STOP';
type Position = { x: number; y: number };

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const gridSize = 20;
  const canvasSize = 600;
  const initialDelay = 100;

  const snake = useRef<Position[]>([{ x: 10, y: 10 }]);
  const direction = useRef<Direction>('STOP');
  const nextDirection = useRef<Direction>('STOP');
  const food = useRef<Position>({ x: 15, y: 15 });
  const delay = useRef(initialDelay);
  const gameLoopRef = useRef<number>();

  const generateFood = () => {
    const maxGrid = canvasSize / gridSize;
    food.current = {
      x: Math.floor(Math.random() * maxGrid),
      y: Math.floor(Math.random() * maxGrid)
    };
  };

  const resetGame = () => {
    snake.current = [{ x: 10, y: 10 }];
    direction.current = 'STOP';
    nextDirection.current = 'STOP';
    delay.current = initialDelay;
    generateFood();
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  const startGame = () => {
    resetGame();
    setGameStarted(true);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.current !== 'DOWN') nextDirection.current = 'UP';
          break;
        case 'ArrowDown':
          if (direction.current !== 'UP') nextDirection.current = 'DOWN';
          break;
        case 'ArrowLeft':
          if (direction.current !== 'RIGHT') nextDirection.current = 'LEFT';
          break;
        case 'ArrowRight':
          if (direction.current !== 'LEFT') nextDirection.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      direction.current = nextDirection.current;

      if (direction.current === 'STOP') {
        gameLoopRef.current = window.setTimeout(gameLoop, delay.current);
        return;
      }

      const head = { ...snake.current[0] };

      switch (direction.current) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      const maxGrid = canvasSize / gridSize;

      // Check wall collision
      if (head.x < 0 || head.x >= maxGrid || head.y < 0 || head.y >= maxGrid) {
        setGameOver(true);
        return;
      }

      // Check self collision
      if (snake.current.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      snake.current = [head, ...snake.current];

      // Check food collision
      if (head.x === food.current.x && head.y === food.current.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        delay.current = Math.max(50, delay.current - 2);
        generateFood();
      } else {
        snake.current.pop();
      }

      drawGame();
      gameLoopRef.current = window.setTimeout(gameLoop, delay.current);
    };

    gameLoop();

    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, highScore]);

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1f2e';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw snake
    const snakeImage = new Image();
    snakeImage.src = snakeHead;
    
    snake.current.forEach((segment, index) => {
      if (index === 0) {
        // Draw head with custom image
        ctx.drawImage(
          snakeImage,
          segment.x * gridSize,
          segment.y * gridSize,
          gridSize,
          gridSize
        );
      } else {
        // Draw body
        ctx.fillStyle = '#88cc44';
        ctx.fillRect(
          segment.x * gridSize,
          segment.y * gridSize,
          gridSize - 2,
          gridSize - 2
        );
      }
    });

    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(
      food.current.x * gridSize + gridSize / 2,
      food.current.y * gridSize + gridSize / 2,
      gridSize / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  };

  return (
    <Card className="p-8 bg-card border-border max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Snake Game
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">Use arrow keys (PC) or buttons (Mobile)</p>
        </div>

        <div className="flex justify-between items-center px-4">
          <div className="text-lg font-semibold">
            Score: <span className="text-primary">{score}</span>
          </div>
          <div className="text-lg font-semibold">
            High Score: <span className="text-accent">{highScore}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className="border-2 border-primary/50 rounded-lg bg-background max-w-full h-auto"
          />

          {/* Mobile controls */}
          <div className="grid grid-cols-3 gap-2 md:hidden">
            <div></div>
            <Button
              onClick={() => { if (direction.current !== 'DOWN') nextDirection.current = 'UP'; }}
              variant="outline"
              size="lg"
              className="w-16 h-16 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
              disabled={!gameStarted || gameOver}
            >
              <ChevronUp className="w-6 h-6" />
            </Button>
            <div></div>
            <Button
              onClick={() => { if (direction.current !== 'RIGHT') nextDirection.current = 'LEFT'; }}
              variant="outline"
              size="lg"
              className="w-16 h-16 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
              disabled={!gameStarted || gameOver}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => { if (direction.current !== 'UP') nextDirection.current = 'DOWN'; }}
              variant="outline"
              size="lg"
              className="w-16 h-16 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
              disabled={!gameStarted || gameOver}
            >
              <ChevronDown className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => { if (direction.current !== 'LEFT') nextDirection.current = 'RIGHT'; }}
              variant="outline"
              size="lg"
              className="w-16 h-16 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
              disabled={!gameStarted || gameOver}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {gameOver && (
          <div className="text-center">
            <p className="text-xl font-bold text-destructive mb-4">Game Over!</p>
            <p className="text-muted-foreground mb-4">Final Score: {score}</p>
          </div>
        )}

        {!gameStarted && !gameOver && (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Eat the red food to grow. Don't hit the walls or yourself!
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={startGame}
            className="bg-primary hover:bg-primary/90"
          >
            {gameOver ? 'Play Again' : gameStarted ? 'Restart' : 'Start Game'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SnakeGame;
