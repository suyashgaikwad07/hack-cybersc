import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import XorCipher from '@/components/cyber-tools/XorCipher';

const XorCipherPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <XorCipher />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default XorCipherPage;
