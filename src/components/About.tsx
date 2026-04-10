import { GraduationCap, Heart, Lightbulb, Target, Code, Shield, Gamepad2, Globe } from 'lucide-react';
import { Card } from './ui/card';

const About = () => {
  const values = [
    { icon: Target, title: 'Determination', description: 'Committed to achieving goals with persistence and focus' },
    { icon: Lightbulb, title: 'Curiosity', description: 'Always eager to explore new technologies and ideas' },
    { icon: Heart, title: 'Creativity', description: 'Bringing innovative ideas to life through code' },
    { icon: GraduationCap, title: 'Learning', description: 'Continuous self-improvement and skill development' }
  ];

  const interests = [
    { icon: Shield, title: 'Cybersecurity', description: 'Passionate about network security, ethical hacking, and protecting digital systems from threats.' },
    { icon: Code, title: 'Programming', description: 'Proficient in C and Python with experience building tools, bots, and automation scripts.' },
    { icon: Gamepad2, title: 'Game Development', description: 'Creating interactive games from classic snake to car racing using various frameworks.' },
    { icon: Globe, title: 'Web Development', description: 'Building responsive web applications with modern technologies like React and TypeScript.' }
  ];

  return (
    <section id="about" className="py-24 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto space-y-10">
          {/* Bio Card */}
          <Card className="p-8 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] animate-slide-up">
            <p className="text-lg leading-relaxed text-foreground/90 mb-4">
              I'm <span className="text-primary font-semibold">Gaikwad Suyash Tulshiram</span>, a Bachelor of Computer Science (BCS) student with a strong passion for coding, cybersecurity, and game creation. I thrive on solving complex challenges, writing efficient code, and building interactive digital experiences that make an impact.
            </p>
            <p className="text-lg leading-relaxed text-foreground/80 mb-4">
              My journey in tech started with a curiosity about how things work under the hood — from understanding how networks communicate to reverse-engineering game mechanics. Today, I channel that curiosity into building real-world projects, from cybersecurity tools and web scrapers to full-featured games and portfolio websites.
            </p>
            <p className="text-lg leading-relaxed text-foreground/80 mb-6">
              I believe in learning by doing. Every project I take on is an opportunity to sharpen my skills, explore new technologies, and push the boundaries of what I can create. Whether it's writing a Python automation script, designing a cipher tool, or developing a racing game — I pour my dedication into every line of code.
            </p>
            <div className="flex items-center gap-3 text-primary">
              <GraduationCap className="w-6 h-6" />
              <p className="text-lg font-medium">Currently pursuing Bachelor of Computer Science (BCS)</p>
            </div>
          </Card>

          {/* Interests Section */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">What I'm Focused On</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interests.map((interest, index) => (
                <Card
                  key={interest.title}
                  className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300 shrink-0">
                      <interest.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-foreground mb-1">{interest.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{interest.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Core Values</h3>
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
      </div>
    </section>
  );
};

export default About;
