import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Game2048 from '@/components/games/Game2048';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Game2048Page = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate('/games')} className="mb-8 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games
          </Button>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">2048</span>
            </h1>
            <p className="text-muted-foreground text-lg">Slide tiles and reach 2048!</p>
          </div>
          <Game2048 />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Game2048Page;
