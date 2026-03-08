import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const CANVAS_W = 400;
const CANVAS_H = 500;
const BIRD_SIZE = 24;
const PIPE_WIDTH = 50;
const GAP = 140;
const GRAVITY = 0.4;
const JUMP = -7;
const PIPE_SPEED = 2.5;

interface Pipe {
  x: number;
  topH: number;
  passed: boolean;
}

const FlappyBird = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const birdRef = useRef({ y: CANVAS_H / 2, vel: 0 });
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const frameRef = useRef(0);
  const gameStateRef = useRef(gameState);

  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const jump = useCallback(() => {
    if (gameStateRef.current === 'idle') {
      setGameState('playing');
      birdRef.current = { y: CANVAS_H / 2, vel: JUMP };
      pipesRef.current = [];
      scoreRef.current = 0;
      setScore(0);
    } else if (gameStateRef.current === 'playing') {
      birdRef.current.vel = JUMP;
    } else {
      setGameState('idle');
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); jump(); } };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const loop = () => {
      frameRef.current = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      grad.addColorStop(0, '#0a0a1a');
      grad.addColorStop(1, '#0d1b2a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Stars
      ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
      for (let i = 0; i < 30; i++) {
        const x = (i * 137.5) % CANVAS_W;
        const y = (i * 73.3) % CANVAS_H;
        ctx.fillRect(x, y, 1.5, 1.5);
      }

      if (gameStateRef.current === 'idle') {
        // Draw idle bird
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(100, CANVAS_H / 2, BIRD_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('TAP or SPACE to Start', CANVAS_W / 2, CANVAS_H / 2 + 60);
        ctx.font = '16px monospace';
        ctx.fillStyle = 'rgba(0,255,255,0.6)';
        ctx.fillText('Fly through the gates!', CANVAS_W / 2, CANVAS_H / 2 + 90);
        return;
      }

      if (gameStateRef.current === 'playing') {
        const bird = birdRef.current;
        bird.vel += GRAVITY;
        bird.y += bird.vel;

        // Add pipes
        const pipes = pipesRef.current;
        if (pipes.length === 0 || pipes[pipes.length - 1].x < CANVAS_W - 200) {
          pipes.push({
            x: CANVAS_W,
            topH: 60 + Math.random() * (CANVAS_H - GAP - 120),
            passed: false,
          });
        }

        // Update pipes
        for (let i = pipes.length - 1; i >= 0; i--) {
          pipes[i].x -= PIPE_SPEED;
          if (pipes[i].x + PIPE_WIDTH < 0) { pipes.splice(i, 1); continue; }

          if (!pipes[i].passed && pipes[i].x + PIPE_WIDTH < 100) {
            pipes[i].passed = true;
            scoreRef.current++;
            setScore(scoreRef.current);
          }

          // Collision
          const p = pipes[i];
          if (100 + BIRD_SIZE / 2 > p.x && 100 - BIRD_SIZE / 2 < p.x + PIPE_WIDTH) {
            if (bird.y - BIRD_SIZE / 2 < p.topH || bird.y + BIRD_SIZE / 2 > p.topH + GAP) {
              setGameState('over');
              setHighScore(h => Math.max(h, scoreRef.current));
            }
          }
        }

        if (bird.y < 0 || bird.y > CANVAS_H) {
          setGameState('over');
          setHighScore(h => Math.max(h, scoreRef.current));
        }

        // Draw pipes
        for (const p of pipes) {
          ctx.fillStyle = '#00ffff';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ffff';
          ctx.fillRect(p.x, 0, PIPE_WIDTH, p.topH);
          ctx.fillRect(p.x, p.topH + GAP, PIPE_WIDTH, CANVAS_H - p.topH - GAP);
          ctx.shadowBlur = 0;

          ctx.strokeStyle = '#00cccc';
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x, 0, PIPE_WIDTH, p.topH);
          ctx.strokeRect(p.x, p.topH + GAP, PIPE_WIDTH, CANVAS_H - p.topH - GAP);
        }

        // Draw bird
        ctx.fillStyle = '#00ffff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.arc(100, bird.y, BIRD_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Eye
        ctx.fillStyle = '#0a0a1a';
        ctx.beginPath();
        ctx.arc(106, bird.y - 3, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      if (gameStateRef.current === 'over') {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_W / 2, CANVAS_H / 2 - 30);
        ctx.fillStyle = '#00ffff';
        ctx.font = '20px monospace';
        ctx.fillText(`Score: ${scoreRef.current}`, CANVAS_W / 2, CANVAS_H / 2 + 10);
        ctx.font = '16px monospace';
        ctx.fillStyle = 'rgba(0,255,255,0.6)';
        ctx.fillText('Tap or press SPACE to retry', CANVAS_W / 2, CANVAS_H / 2 + 50);
      }
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="grid grid-cols-2 gap-4 text-center">
        <Card className="p-4 bg-card/80 border-border">
          <p className="text-muted-foreground text-sm">Score</p>
          <p className="text-3xl font-bold text-primary">{score}</p>
        </Card>
        <Card className="p-4 bg-card/80 border-border">
          <p className="text-muted-foreground text-sm">Best</p>
          <p className="text-3xl font-bold text-accent">{highScore}</p>
        </Card>
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onClick={jump}
          onTouchStart={(e) => { e.preventDefault(); jump(); }}
          className="rounded-xl border-2 border-primary/30 cursor-pointer"
          style={{ maxWidth: '100%' }}
        />
      </div>

      <p className="text-center text-muted-foreground text-sm">
        Tap the screen or press SPACE to fly
      </p>
    </div>
  );
};

export default FlappyBird;
