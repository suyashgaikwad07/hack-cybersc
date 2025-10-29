import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PasswordHasher from '@/components/cyber-tools/PasswordHasher';

const PasswordHasherPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <PasswordHasher />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PasswordHasherPage;
