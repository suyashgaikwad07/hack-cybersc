import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SteganographyTool from '@/components/cyber-tools/SteganographyTool';

const SteganographyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <SteganographyTool />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SteganographyPage;
