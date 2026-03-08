import { BookOpen, Code, Briefcase, Trophy } from 'lucide-react';
import { Card } from './ui/card';

const Goals = () => {
  const roadmap = [
    { icon: BookOpen, title: 'Learning', description: 'Building strong foundations', status: 'current' },
    { icon: Code, title: 'Building Projects', description: 'Creating real-world applications', status: 'in-progress' },
    { icon: Briefcase, title: 'Offering Services', description: 'Providing professional solutions', status: 'upcoming' },
    { icon: Trophy, title: 'Professional Developer', description: 'Achieving expertise', status: 'future' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-primary text-primary-foreground';
      case 'in-progress': return 'bg-primary/70 text-primary-foreground';
      case 'upcoming': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section id="goals" className="py-24 bg-card/40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Future Goals & Services
            </span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-card border-border mb-12 animate-slide-up">
            <p className="text-lg text-center text-foreground/90 leading-relaxed">
              Currently in the learning stage, I aim to build expertise in programming, game creation, and cybersecurity — eventually offering services in these fields.
            </p>
          </Card>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {roadmap.map((stage, index) => (
                <div 
                  key={stage.title}
                  className="flex flex-col items-center animate-slide-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className={`w-20 h-20 rounded-full ${getStatusColor(stage.status)} flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,255,255,0.3)] relative z-10`}>
                    <stage.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground text-center mb-2">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground text-center">{stage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Goals;
