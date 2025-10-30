import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CarRacing from '@/components/games/CarRacing';

const CarRacingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <CarRacing />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarRacingPage;
