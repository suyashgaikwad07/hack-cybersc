import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import NetworkPacketAnalyzer from '@/components/cyber-tools/NetworkPacketAnalyzer';

const NetworkPacketAnalyzerPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <NetworkPacketAnalyzer />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NetworkPacketAnalyzerPage;
