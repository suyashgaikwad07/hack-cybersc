import Navigation from '@/components/Navigation';
import PasswordGenerator from '@/components/PasswordGenerator';
import Footer from '@/components/Footer';

const PasswordGeneratorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PasswordGenerator />
      <Footer />
    </div>
  );
};

export default PasswordGeneratorPage;
