import { Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 bg-card/60 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="w-6 h-6" />
            <span className="font-bold text-lg">Suyash Gaikwad</span>
          </div>
          
          <p className="text-muted-foreground flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-primary fill-primary animate-pulse-glow" /> by Gaikwad Suyash Tulshiram
          </p>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
