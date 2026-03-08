import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

type Grid = number[][];

const SIZE = 4;

const getColor = (val: number): string => {
  const colors: Record<number, string> = {
    2: 'bg-primary/20 text-primary',
    4: 'bg-primary/30 text-primary',
    8: 'bg-primary/50 text-primary-foreground',
    16: 'bg-primary/60 text-primary-foreground',
    32: 'bg-primary/70 text-primary-foreground',
    64: 'bg-primary/80 text-primary-foreground',
    128: 'bg-accent/60 text-accent-foreground',
    256: 'bg-accent/70 text-accent-foreground',
    512: 'bg-accent/80 text-accent-foreground',
    1024: 'bg-accent/90 text-accent-foreground',
    2048: 'bg-destructive text-destructive-foreground',
  };
  return colors[val] || 'bg-muted text-muted-foreground';
};

const emptyGrid = (): Grid => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

const addRandom = (grid: Grid): Grid => {
  const g = grid.map(r => [...r]);
  const empty: [number, number][] = [];
  g.forEach((row, r) => row.forEach((val, c) => { if (!val) empty.push([r, c]); }));
  if (empty.length === 0) return g;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
  return g;
};

const slideRow = (row: number[]): { newRow: number[]; score: number } => {
  let score = 0;
  const filtered = row.filter(v => v !== 0);
  const merged: number[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2);
      score += filtered[i] * 2;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { newRow: merged, score };
};

const transpose = (g: Grid): Grid => g[0].map((_, c) => g.map(row => row[c]));
const reverseRows = (g: Grid): Grid => g.map(r => [...r].reverse());

const Game2048 = () => {
  const [grid, setGrid] = useState<Grid>(() => addRandom(addRandom(emptyGrid())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const canMove = (g: Grid): boolean => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (g[r][c] === 0) return true;
        if (c + 1 < SIZE && g[r][c] === g[r][c + 1]) return true;
        if (r + 1 < SIZE && g[r][c] === g[r + 1][c]) return true;
      }
    }
    return false;
  };

  const move = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    let g = grid.map(r => [...r]);
    let totalScore = 0;

    const slideGrid = (g: Grid): { grid: Grid; score: number } => {
      let s = 0;
      const newG = g.map(row => {
        const { newRow, score } = slideRow(row);
        s += score;
        return newRow;
      });
      return { grid: newG, score: s };
    };

    let result;
    switch (direction) {
      case 'left':
        result = slideGrid(g);
        g = result.grid;
        totalScore = result.score;
        break;
      case 'right':
        g = reverseRows(g);
        result = slideGrid(g);
        g = reverseRows(result.grid);
        totalScore = result.score;
        break;
      case 'up':
        g = transpose(g);
        result = slideGrid(g);
        g = transpose(result.grid);
        totalScore = result.score;
        break;
      case 'down':
        g = transpose(reverseRows(g));
        result = slideGrid(g);
        g = reverseRows(transpose(result.grid));
        totalScore = result.score;
        break;
    }

    const changed = JSON.stringify(g) !== JSON.stringify(grid);
    if (!changed) return;

    const newGrid = addRandom(g);
    const newScore = score + totalScore;
    setGrid(newGrid);
    setScore(newScore);
    if (newScore > best) setBest(newScore);

    if (newGrid.flat().includes(2048) && !won) setWon(true);
    if (!canMove(newGrid)) setGameOver(true);
  }, [grid, score, best, gameOver, won]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, 'left' | 'right' | 'up' | 'down'> = {
        ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
      };
      if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  // Touch swipe
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      move(dx > 0 ? 'right' : 'left');
    } else {
      move(dy > 0 ? 'down' : 'up');
    }
    touchRef.current = null;
  };

  const touchRefObj = useRef<{ x: number; y: number } | null>(null);
  // Fix: use a single ref
  const resetGame = () => {
    setGrid(addRandom(addRandom(emptyGrid())));
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="grid grid-cols-2 gap-4 text-center">
        <Card className="p-4 bg-card/80 border-border">
          <p className="text-muted-foreground text-sm">Score</p>
          <p className="text-2xl font-bold text-primary">{score}</p>
        </Card>
        <Card className="p-4 bg-card/80 border-border">
          <p className="text-muted-foreground text-sm">Best</p>
          <p className="text-2xl font-bold text-accent">{best}</p>
        </Card>
      </div>

      <div
        className="grid grid-cols-4 gap-2 p-3 bg-card/60 rounded-xl border border-border"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {grid.flat().map((val, i) => (
          <motion.div
            key={`${i}-${val}`}
            initial={{ scale: val ? 0.8 : 1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15 }}
            className={`aspect-square rounded-lg flex items-center justify-center font-bold text-lg ${
              val ? getColor(val) : 'bg-muted/30'
            }`}
          >
            {val || ''}
          </motion.div>
        ))}
      </div>

      {(gameOver || won) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <p className="text-2xl font-bold text-primary">
            {won ? '🎉 You reached 2048!' : 'Game Over!'}
          </p>
          <Button onClick={resetGame} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            New Game
          </Button>
        </motion.div>
      )}

      <p className="text-center text-muted-foreground text-sm">
        Use arrow keys or swipe to move tiles
      </p>
    </div>
  );
};

export default Game2048;
