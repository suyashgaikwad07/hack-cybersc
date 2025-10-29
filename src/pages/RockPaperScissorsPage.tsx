import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import RockPaperScissors from '@/components/games/RockPaperScissors';

const RockPaperScissorsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <RockPaperScissors />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RockPaperScissorsPage;
