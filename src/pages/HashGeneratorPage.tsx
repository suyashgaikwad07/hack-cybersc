import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HashGenerator from '@/components/cyber-tools/HashGenerator';

const HashGeneratorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <HashGenerator />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HashGeneratorPage;
