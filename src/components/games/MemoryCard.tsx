import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const EMOJIS = ['🛡️', '🔒', '💻', '🎮', '⚡', '🔑', '🌐', '🧩'];

interface CardItem {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const MemoryCard = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);

  const initGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(shuffled);
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setStarted(false);
    setLocked(false);
  };

  useEffect(() => { initGame(); }, []);

  useEffect(() => {
    if (!started) return;
    if (matches === EMOJIS.length) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [started, matches]);

  useEffect(() => {
    if (matches === EMOJIS.length && moves > 0) {
      if (!bestScore || moves < bestScore) setBestScore(moves);
    }
  }, [matches]);

  const handleFlip = (id: number) => {
    if (locked || flipped.includes(id) || cards[id].matched) return;
    if (!started) setStarted(true);

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setCards(prev => prev.map(c =>
          c.id === first || c.id === second ? { ...c, matched: true } : c
        ));
        setMatches(m => m + 1);
        setFlipped([]);
        setLocked(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 800);
      }
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="grid grid-cols-3 gap-2 text-center">
        <Card className="p-4 bg-card/80 border-border">
          <p className="text-muted-foreground text-sm">Moves</p>
          <p className="text-2xl font-bold text-primary">{moves}</p>
        </Card>
        <Card className="p-4 bg-card/80 border-border">
          <p className="text-muted-foreground text-sm">Time</p>
          <p className="text-2xl font-bold text-foreground">{formatTime(timer)}</p>
        </Card>
        <Card className="p-4 bg-card/80 border-border">
          <p className="text-muted-foreground text-sm">Best</p>
          <p className="text-2xl font-bold text-accent">{bestScore ?? '—'}</p>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || card.matched;
          return (
            <motion.button
              key={card.id}
              whileHover={!isFlipped ? { scale: 1.05 } : {}}
              whileTap={!isFlipped ? { scale: 0.95 } : {}}
              onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-xl text-3xl flex items-center justify-center border-2 transition-all duration-300 ${
                card.matched
                  ? 'border-primary/50 bg-primary/20'
                  : isFlipped
                  ? 'border-accent/50 bg-accent/10'
                  : 'border-border bg-card/50 hover:border-primary/30'
              }`}
            >
              <motion.span
                animate={{ rotateY: isFlipped ? 0 : 180 }}
                transition={{ duration: 0.3 }}
                style={{ backfaceVisibility: 'hidden' }}
              >
                {isFlipped ? card.emoji : '?'}
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      {matches === EMOJIS.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <p className="text-2xl font-bold text-primary">🎉 You matched all pairs!</p>
          <p className="text-muted-foreground">
            {moves} moves in {formatTime(timer)}
          </p>
          <Button onClick={initGame} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MemoryCard;
