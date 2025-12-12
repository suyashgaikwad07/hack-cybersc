import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HashTools from '@/components/cyber-tools/HashTools';

const HashToolsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <HashTools />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HashToolsPage;
