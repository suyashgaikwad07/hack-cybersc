import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

type Player = 'X' | 'O' | null;

const TicTacToe = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [scores, setScores] = useState({ player: 0, computer: 0, draws: 0 });

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkWinner = useCallback((b: Player[]): Player => {
    for (const [a, bIdx, c] of winPatterns) {
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) return b[a];
    }
    return null;
  }, []);

  const minimax = useCallback((b: Player[], isMax: boolean): number => {
    const w = checkWinner(b);
    if (w === 'O') return 10;
    if (w === 'X') return -10;
    if (b.every(c => c !== null)) return 0;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = 'O';
          best = Math.max(best, minimax(b, false));
          b[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = 'X';
          best = Math.min(best, minimax(b, true));
          b[i] = null;
        }
      }
      return best;
    }
  }, [checkWinner]);

  const computerMove = useCallback((b: Player[]) => {
    let bestScore = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = 'O';
        const score = minimax(b, false);
        b[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }, [minimax]);

  const handleClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';

    const w = checkWinner(newBoard);
    if (w) {
      setBoard(newBoard);
      setWinner('You win! 🎉');
      setScores(s => ({ ...s, player: s.player + 1 }));
      return;
    }
    if (newBoard.every(c => c !== null)) {
      setBoard(newBoard);
      setWinner("It's a draw!");
      setScores(s => ({ ...s, draws: s.draws + 1 }));
      return;
    }

    setBoard(newBoard);
    setIsPlayerTurn(false);

    setTimeout(() => {
      const move = computerMove([...newBoard]);
      if (move !== -1) {
        newBoard[move] = 'O';
        const cw = checkWinner(newBoard);
        if (cw) {
          setBoard([...newBoard]);
          setWinner('Computer wins!');
          setScores(s => ({ ...s, computer: s.computer + 1 }));
          return;
        }
        if (newBoard.every(c => c !== null)) {
          setBoard([...newBoard]);
          setWinner("It's a draw!");
          setScores(s => ({ ...s, draws: s.draws + 1 }));
          return;
        }
        setBoard([...newBoard]);
      }
      setIsPlayerTurn(true);
    }, 400);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="grid grid-cols-3 gap-2 text-center">
        <Card className="p-4 bg-card/80 border-border">
          <p className="text-muted-foreground text-sm">You (X)</p>
          <p className="text-2xl font-bold text-primary">{scores.player}</p>
        </Card>
        <Card className="p-4 bg-card/80 border-border">
          <p className="text-muted-foreground text-sm">Draws</p>
          <p className="text-2xl font-bold text-foreground">{scores.draws}</p>
        </Card>
        <Card className="p-4 bg-card/80 border-border">
          <p className="text-muted-foreground text-sm">CPU (O)</p>
          <p className="text-2xl font-bold text-destructive">{scores.computer}</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            whileHover={!cell && !winner ? { scale: 1.05 } : {}}
            whileTap={!cell && !winner ? { scale: 0.95 } : {}}
            onClick={() => handleClick(i)}
            className={`aspect-square rounded-lg text-4xl font-bold flex items-center justify-center border-2 transition-colors duration-200 ${
              cell ? 'cursor-default' : 'cursor-pointer hover:border-primary/50'
            } ${cell === 'X' ? 'text-primary border-primary/30 bg-primary/10' : cell === 'O' ? 'text-destructive border-destructive/30 bg-destructive/10' : 'border-border bg-card/50'}`}
          >
            <AnimatePresence>
              {cell && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {cell}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {winner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <p className="text-2xl font-bold text-primary">{winner}</p>
          <Button onClick={resetGame} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Play Again
          </Button>
        </motion.div>
      )}

      {!winner && (
        <p className="text-center text-muted-foreground">
          {isPlayerTurn ? "Your turn (X)" : "Computer thinking..."}
        </p>
      )}
    </div>
  );
};

export default TicTacToe;
