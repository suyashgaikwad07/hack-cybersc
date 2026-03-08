import { Shield, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import profileImage from '@/assets/profile-image.png';
import heroBackground from '@/assets/hero-bg.jpg';

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-background/70" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-primary/50 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse-glow" />
              <img 
                src={profileImage} 
                alt="Gaikwad Suyash Tulshiram"
                className="relative w-40 h-40 rounded-full object-cover border-4 border-primary shadow-[0_0_50px_rgba(0,255,255,0.5)]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Gaikwad Suyash Tulshiram
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Cybersecurity Learner | Game Creator | C & Python Programmer
            </p>
            
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              I'm a BCS student exploring cybersecurity, coding, and creative game development.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-8">
            <Button 
              onClick={() => scrollToSection('projects')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_50px_rgba(0,255,255,0.5)] transition-all duration-300"
            >
              View Projects
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')}
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-6 text-lg shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] transition-all duration-300"
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </div>

      <button 
        onClick={() => scrollToSection('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
};

export default Hero;
