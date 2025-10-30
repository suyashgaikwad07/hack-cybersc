import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SnakeGame from '@/components/games/SnakeGame';

const SnakeGamePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <SnakeGame />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SnakeGamePage;
