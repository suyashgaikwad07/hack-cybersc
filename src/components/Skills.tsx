import { Code, Shield, Gamepad2, Globe, Terminal } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

const Skills = () => {
  const technicalSkills = [
    { 
      icon: Terminal, 
      name: 'Python Programming', 
      level: 70,
      description: 'Strong foundation for logic and problem-solving' 
    },
    { 
      icon: Code, 
      name: 'C Language', 
      level: 90,
      description: 'Core understanding of programming fundamentals' 
    },
    { 
      icon: Globe, 
      name: 'HTML', 
      level: 65,
      description: 'Basic front-end development and website structure' 
    },
    { 
      icon: Shield, 
      name: 'Cybersecurity', 
      level: 60,
      description: 'Learning network security and threat awareness' 
    },
    { 
      icon: Gamepad2, 
      name: 'Game Creation', 
      level: 65,
      description: 'Developing Python-based interactive games' 
    }
  ];

  const softSkills = [
    'Logical Thinking',
    'Adaptability',
    'Team Collaboration',
    'Problem Solving',
    'Creative Mindset'
  ];

  return (
    <section id="skills" className="py-24 bg-card/40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Skills & Expertise
            </span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Technical Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {technicalSkills.map((skill, index) => (
                <Card 
                  key={skill.name}
                  className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <skill.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-foreground mb-1">{skill.name}</h4>
                      <p className="text-sm text-muted-foreground">{skill.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Proficiency</span>
                      <span className="text-primary font-semibold">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Soft Skills</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {softSkills.map((skill, index) => (
                <div 
                  key={skill}
                  className="px-6 py-3 bg-secondary/50 border border-primary/30 rounded-full text-foreground hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
