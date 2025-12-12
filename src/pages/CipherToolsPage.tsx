import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CipherTools from '@/components/cyber-tools/CipherTools';

const CipherToolsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <CipherTools />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CipherToolsPage;
