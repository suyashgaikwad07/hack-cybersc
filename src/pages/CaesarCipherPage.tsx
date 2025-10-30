import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CaesarCipher from '@/components/cyber-tools/CaesarCipher';

const CaesarCipherPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <CaesarCipher />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CaesarCipherPage;
