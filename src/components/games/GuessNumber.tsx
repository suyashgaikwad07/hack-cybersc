import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Target, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GuessNumber = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [gameWon, setGameWon] = useState<boolean>(false);
  const { toast } = useToast();

  const initializeGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setAttempts(0);
    setMessage('I\'m thinking of a number between 1 and 100. Can you guess it?');
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleGuess = () => {
    if (!guess || !guess.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a number.",
        variant: "destructive"
      });
      return;
    }

    const guessNum = parseInt(guess);
    if (isNaN(guessNum)) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number.",
        variant: "destructive"
      });
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessNum < targetNumber) {
      setMessage('🔼 Too low! Try a higher number.');
    } else if (guessNum > targetNumber) {
      setMessage('🔽 Too high! Try a lower number.');
    } else {
      setMessage(`🎉 Congratulations! You guessed the number in ${newAttempts} attempt${newAttempts > 1 ? 's' : ''}!`);
      setGameWon(true);
      toast({
        title: "You Won! 🎉",
        description: `Found the number in ${newAttempts} attempts!`,
      });
    }
    setGuess('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !gameWon) {
      handleGuess();
    }
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto bg-card border-border">
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-gradient-to-r from-primary to-accent rounded-full mb-4">
          <Target className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Guess the Number
          </span>
        </h2>
        <p className="text-muted-foreground">Number between 1 and 100</p>
      </div>

      <div className="space-y-6">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-lg">{message}</p>
          <p className="text-sm text-muted-foreground mt-2">Attempts: {attempts}</p>
        </div>

        {!gameWon && (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter your guess..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              min="1"
              max="100"
              className="text-lg"
            />
            <Button 
              onClick={handleGuess}
              className="bg-primary hover:bg-primary/90"
            >
              Guess
            </Button>
          </div>
        )}

        <Button 
          variant="outline"
          onClick={initializeGame}
          className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>
      </div>
    </Card>
  );
};

export default GuessNumber;
