import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PortScanner from '@/components/cyber-tools/PortScanner';

const PortScannerPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <PortScanner />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PortScannerPage;
