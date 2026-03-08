import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Target, HandMetal, Worm, Car, Grid3X3, Brain, Bird, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const GamesPage = () => {
  const navigate = useNavigate();

  const games = [
    { icon: Target, title: 'Guess the Number', description: 'Test your intuition! Guess a number between 1 and 100.', color: 'from-primary to-accent', route: '/games/guess-number' },
    { icon: HandMetal, title: 'Rock Paper Scissors', description: 'Classic game against the computer. Who will win?', color: 'from-accent to-primary', route: '/games/rock-paper-scissors' },
    { icon: Worm, title: 'Snake Game', description: 'Classic arcade snake! Eat, grow, and survive.', color: 'from-primary to-accent', route: '/games/snake' },
    { icon: Car, title: 'Car Racing', description: 'Race down the highway and dodge incoming cars!', color: 'from-accent to-primary', route: '/games/car-racing' },
    { icon: Grid3X3, title: 'Tic Tac Toe', description: 'Challenge the unbeatable AI in this classic game!', color: 'from-primary to-accent', route: '/games/tic-tac-toe' },
    { icon: Brain, title: 'Memory Card', description: 'Flip cards and match all pairs with fewest moves!', color: 'from-accent to-primary', route: '/games/memory-card' },
    { icon: Bird, title: 'Flappy Bird', description: 'Tap to fly through cyber gates. How far can you go?', color: 'from-primary to-accent', route: '/games/flappy-bird' },
    { icon: Hash, title: '2048', description: 'Slide tiles, merge numbers, and reach 2048!', color: 'from-accent to-primary', route: '/games/2048' },
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
              Fun interactive games to play. Choose a game and start playing!
            </p>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-6" />
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card 
                  className="p-6 bg-card/80 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] group cursor-pointer h-full backdrop-blur-sm"
                  onClick={() => navigate(game.route)}
                >
                  <div className={`inline-block p-3 bg-gradient-to-r ${game.color} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <game.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{game.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{game.description}</p>
                  <Button 
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground w-full group-hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                  >
                    Play Now <Gamepad2 className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GamesPage;
