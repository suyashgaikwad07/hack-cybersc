import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Base64Encoder from '@/components/cyber-tools/Base64Encoder';

const Base64EncoderPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Base64Encoder />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Base64EncoderPage;
