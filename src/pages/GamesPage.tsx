import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Target, HandMetal, Worm, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GamesPage = () => {
  const navigate = useNavigate();

  const games = [
    {
      icon: Target,
      title: 'Guess the Number',
      description: 'Test your intuition! Guess a number between 1 and 100. Can you find it in the fewest attempts?',
      color: 'from-primary to-accent',
      route: '/games/guess-number'
    },
    {
      icon: HandMetal,
      title: 'Rock Paper Scissors',
      description: 'Classic game against the computer. Rock beats scissors, scissors beats paper, paper beats rock!',
      color: 'from-accent to-primary',
      route: '/games/rock-paper-scissors'
    },
    {
      icon: Worm,
      title: 'Snake Game',
      description: 'Classic arcade snake game! Eat food, grow longer, and avoid hitting walls or yourself.',
      color: 'from-primary to-accent',
      route: '/games/snake'
    },
    {
      icon: Car,
      title: 'Car Racing',
      description: 'Race down the highway! Dodge incoming cars and see how long you can survive.',
      color: 'from-accent to-primary',
      route: '/games/car-racing'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block p-4 bg-gradient-to-r from-primary to-accent rounded-full mb-6">
              <Gamepad2 className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Funny Games
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Fun Python projects recreated for the web. Choose a game and start playing!
            </p>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-6" />
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {games.map((game, index) => (
              <Card 
                key={game.title}
                className="p-8 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] group animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`inline-block p-4 bg-gradient-to-r ${game.color} rounded-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <game.icon className="w-10 h-10 text-primary-foreground" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">{game.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {game.description}
                  </p>

                  <Button 
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground w-full group-hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                    onClick={() => navigate(game.route)}
                  >
                    Play Now
                    <Gamepad2 className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GamesPage;
