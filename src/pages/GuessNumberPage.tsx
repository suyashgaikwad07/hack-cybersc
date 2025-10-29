import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GuessNumber from '@/components/games/GuessNumber';

const GuessNumberPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <GuessNumber />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuessNumberPage;
