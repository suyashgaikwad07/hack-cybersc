import { useEffect, useRef, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import playerCarImg from '@/assets/player-car.png';
import obstacleCarImg from '@/assets/obstacle-car.png';
import obstacleCarImg2 from '@/assets/obstacle-car-2.png';
import obstacleCarImg3 from '@/assets/obstacle-car-3.png';

type Car = {
  x: number;
  y: number;
  speed: number;
  imageIndex: number;
};

const CarRacing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const canvasWidth = 400;
  const canvasHeight = 600;
  const carWidth = 40;
  const carHeight = 60;
  const laneWidth = canvasWidth / 3;

  const playerX = useRef(canvasWidth / 2 - carWidth / 2);
  const playerY = useRef(canvasHeight - 100);
  const moveDirection = useRef(0);
  const cars = useRef<Car[]>([]);
  const roadOffset = useRef(0);
  const gameSpeed = useRef(5);
  const gameLoopRef = useRef<number>();
  const playerCarImage = useRef<HTMLImageElement | null>(null);
  const obstacleCarImages = useRef<(HTMLImageElement | null)[]>([null, null, null]);

  const generateCar = () => {
    const lane = Math.floor(Math.random() * 3);
    const x = lane * laneWidth + laneWidth / 2 - carWidth / 2;
    const imageIndex = Math.floor(Math.random() * 3);
    const speedVariation = Math.random() * 2 - 1;
    cars.current.push({
      x,
      y: -carHeight,
      speed: gameSpeed.current + speedVariation,
      imageIndex
    });
  };

  const resetGame = () => {
    playerX.current = canvasWidth / 2 - carWidth / 2;
    cars.current = [];
    roadOffset.current = 0;
    gameSpeed.current = 5;
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setGameStarted(false);
  };

  const startGame = () => {
    resetGame();
    setGameStarted(true);
  };

  const moveLeft = () => {
    moveDirection.current = -1;
  };

  const moveRight = () => {
    moveDirection.current = 1;
  };

  const stopMove = () => {
    moveDirection.current = 0;
  };

  useEffect(() => {
    // Load car images
    const playerImg = new Image();
    playerImg.src = playerCarImg;
    playerImg.onload = () => {
      playerCarImage.current = playerImg;
    };

    const obstacleImgs = [obstacleCarImg, obstacleCarImg2, obstacleCarImg3];
    obstacleImgs.forEach((imgSrc, index) => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        obstacleCarImages.current[index] = img;
      };
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') stopMove();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    let lastCarTime = Date.now();
    const carSpawnInterval = 1500;

    const gameLoop = () => {
      // Move player with smooth acceleration
      const turnSpeed = 8;
      if (moveDirection.current === -1) {
        playerX.current = Math.max(0, playerX.current - turnSpeed);
      } else if (moveDirection.current === 1) {
        playerX.current = Math.min(canvasWidth - carWidth, playerX.current + turnSpeed);
      }

      // Update road animation
      roadOffset.current = (roadOffset.current + gameSpeed.current) % 40;

      // Generate new cars
      const now = Date.now();
      if (now - lastCarTime > carSpawnInterval) {
        generateCar();
        lastCarTime = now;
      }

      // Update cars
      cars.current = cars.current.filter(car => {
        car.y += car.speed;
        
        // Check collision
        if (
          car.y + carHeight > playerY.current &&
          car.y < playerY.current + carHeight &&
          car.x + carWidth > playerX.current &&
          car.x < playerX.current + carWidth
        ) {
          setGameOver(true);
          return false;
        }

        // Remove off-screen cars and increment score
        if (car.y > canvasHeight) {
          setScore(prev => {
            const newScore = prev + 1;
            if (newScore > highScore) setHighScore(newScore);
            
            // Level up every 10 points
            if (newScore % 10 === 0 && newScore > 0) {
              setLevel(l => l + 1);
              gameSpeed.current += 1;
            }
            
            return newScore;
          });
          return false;
        }

        return true;
      });

      drawGame();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, highScore]);

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw road with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#1a202c');
    gradient.addColorStop(1, '#2d3748');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw lane lines
    ctx.strokeStyle = '#ffffff';
    ctx.setLineDash([20, 20]);
    ctx.lineDashOffset = -roadOffset.current;
    ctx.lineWidth = 3;

    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * laneWidth, 0);
      ctx.lineTo(i * laneWidth, canvasHeight);
      ctx.stroke();
    }

    // Draw player car with realistic image and animated glow effect
    if (playerCarImage.current) {
      // Add animated glow effect
      const glowIntensity = 10 + Math.sin(Date.now() / 200) * 5;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = glowIntensity;
      
      ctx.drawImage(
        playerCarImage.current,
        playerX.current,
        playerY.current,
        carWidth,
        carHeight
      );
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    } else {
      // Fallback to colored rectangle
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(playerX.current, playerY.current, carWidth, carHeight);
    }

    // Draw obstacle cars with realistic images
    cars.current.forEach(car => {
      const carImage = obstacleCarImages.current[car.imageIndex];
      if (carImage) {
        // Add shadow effect
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.drawImage(
          carImage,
          car.x,
          car.y,
          carWidth,
          carHeight
        );
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      } else {
        // Fallback to colored rectangle
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(car.x, car.y, carWidth, carHeight);
      }
    });
  };

  return (
    <Card className="p-4 md:p-8 bg-card border-border max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Car Racing Game
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">Avoid the cars and survive!</p>
        </div>

        <div className="flex justify-between items-center px-4 text-sm md:text-base">
          <div className="font-semibold">
            Score: <span className="text-primary">{score}</span>
          </div>
          <div className="font-semibold">
            Level: <span className="text-accent">{level}</span>
          </div>
          <div className="font-semibold">
            High: <span className="text-accent">{highScore}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="border-2 border-primary/50 rounded-lg bg-background max-w-full h-auto"
          />

          {/* Mobile controls */}
          <div className="flex gap-4 md:hidden">
            <Button
              onTouchStart={moveLeft}
              onTouchEnd={stopMove}
              onMouseDown={moveLeft}
              onMouseUp={stopMove}
              variant="outline"
              size="lg"
              className="w-20 h-20 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
              disabled={!gameStarted || gameOver}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            <Button
              onTouchStart={moveRight}
              onTouchEnd={stopMove}
              onMouseDown={moveRight}
              onMouseUp={stopMove}
              variant="outline"
              size="lg"
              className="w-20 h-20 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
              disabled={!gameStarted || gameOver}
            >
              <ChevronRight className="w-8 h-8" />
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
            <p className="text-muted-foreground mb-2 text-sm md:text-base">
              Use arrow keys (PC) or buttons (Mobile) to move
            </p>
            <p className="text-muted-foreground text-sm md:text-base">
              Avoid the red cars!
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

export default CarRacing;
