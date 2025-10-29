import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HandMetal, Scissors, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Choice = 'rock' | 'paper' | 'scissors';

const RockPaperScissors = () => {
  const [userChoice, setUserChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();

  const choices: { value: Choice; icon: any; label: string; color: string }[] = [
    { value: 'rock', icon: HandMetal, label: 'Rock', color: 'from-blue-500 to-blue-600' },
    { value: 'paper', icon: FileText, label: 'Paper', color: 'from-green-500 to-green-600' },
    { value: 'scissors', icon: Scissors, label: 'Scissors', color: 'from-red-500 to-red-600' }
  ];

  const getComputerChoice = (): Choice => {
    const options: Choice[] = ['rock', 'paper', 'scissors'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const determineWinner = (user: Choice, computer: Choice): string => {
    if (user === computer) {
      return 'tie';
    }
    if (
      (user === 'rock' && computer === 'scissors') ||
      (user === 'paper' && computer === 'rock') ||
      (user === 'scissors' && computer === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
  };

  const handleChoice = (choice: Choice) => {
    const computer = getComputerChoice();
    setUserChoice(choice);
    setComputerChoice(computer);

    const outcome = determineWinner(choice, computer);
    
    if (outcome === 'tie') {
      setResult("It's a tie! 🤝");
      toast({
        title: "Tie!",
        description: "Great minds think alike!",
      });
    } else if (outcome === 'win') {
      setResult('You win! 🎉');
      toast({
        title: "You Win! 🎉",
        description: `${choice} beats ${computer}!`,
      });
    } else {
      setResult('You lose! 😢');
      toast({
        title: "You Lose",
        description: `${computer} beats ${choice}`,
        variant: "destructive"
      });
    }
  };

  const reset = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult('');
  };

  return (
    <Card className="p-8 max-w-3xl mx-auto bg-card border-border">
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-gradient-to-r from-primary to-accent rounded-full mb-4">
          <HandMetal className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Rock Paper Scissors
          </span>
        </h2>
        <p className="text-muted-foreground">Choose your weapon!</p>
      </div>

      <div className="space-y-8">
        {result && (
          <div className="text-center p-6 bg-muted/50 rounded-lg animate-fade-in">
            <p className="text-2xl font-bold mb-4">{result}</p>
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">You</p>
                <div className="p-4 bg-primary/20 rounded-lg">
                  <p className="text-lg font-semibold capitalize">{userChoice}</p>
                </div>
              </div>
              <div className="text-2xl">vs</div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Computer</p>
                <div className="p-4 bg-accent/20 rounded-lg">
                  <p className="text-lg font-semibold capitalize">{computerChoice}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {choices.map((choice) => {
            const Icon = choice.icon;
            return (
              <Button
                key={choice.value}
                variant="outline"
                className="h-32 flex-col gap-2 border-2 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all"
                onClick={() => handleChoice(choice.value)}
              >
                <div className={`p-3 bg-gradient-to-r ${choice.color} rounded-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <span className="font-semibold">{choice.label}</span>
              </Button>
            );
          })}
        </div>

        {result && (
          <Button 
            variant="outline"
            onClick={reset}
            className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Play Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default RockPaperScissors;
