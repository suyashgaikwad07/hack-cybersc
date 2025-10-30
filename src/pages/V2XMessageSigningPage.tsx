import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import V2XMessageSigning from '@/components/cyber-tools/V2XMessageSigning';

const V2XMessageSigningPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <V2XMessageSigning />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default V2XMessageSigningPage;
