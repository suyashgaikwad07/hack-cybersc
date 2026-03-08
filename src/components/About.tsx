import { GraduationCap, Heart, Lightbulb, Target } from 'lucide-react';
import { Card } from './ui/card';

const About = () => {
  const values = [
    { icon: Target, title: 'Determination', description: 'Committed to achieving goals' },
    { icon: Lightbulb, title: 'Curiosity', description: 'Always eager to learn' },
    { icon: Heart, title: 'Creativity', description: 'Bringing ideas to life' },
    { icon: GraduationCap, title: 'Learning', description: 'Continuous improvement' }
  ];

  return (
    <section id="about" className="py-24 bg-background/70 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-8 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] animate-slide-up">
            <p className="text-lg leading-relaxed text-foreground/90 mb-6">
              I'm <span className="text-primary font-semibold">Gaikwad Suyash Tulshiram</span>, a Bachelor of Computer Science (BCS) student with a strong interest in coding, cybersecurity, and game creation. I enjoy solving challenges, writing code, and developing interactive digital experiences.
            </p>
            <div className="flex items-center gap-3 text-primary">
              <GraduationCap className="w-6 h-6" />
              <p className="text-lg font-medium">Currently pursuing Bachelor of Computer Science (BCS)</p>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card 
                key={value.title}
                className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
