import { Gamepad2, Shield, ExternalLink, Code, Lock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const projects = [
    {
      icon: Gamepad2,
      title: 'Games',
      description: 'Interactive games including Snake, Car Racing, Tic Tac Toe, Memory Card, Flappy Bird, 2048, and more.',
      status: 'Active',
      link: '/games',
      color: 'from-primary to-accent'
    },
    {
      icon: Code,
      title: 'Software',
      description: 'Software development projects including Python automation, bots, file organizers, and utility applications.',
      status: 'Active',
      link: '/software',
      color: 'from-accent to-primary'
    },
    {
      icon: Shield,
      title: 'Cyber Tools',
      description: 'Encoding and cryptography tools: Password Generator, Hash Tools, Cipher Encryption, Base64, URL Encoder, and Steganography.',
      status: 'Active',
      link: '/cyber-tools',
      color: 'from-primary to-accent'
    },
    {
      icon: Lock,
      title: 'Cyber Security',
      description: 'Network security tools: Port Scanner, V2X Message Signing, Network Packet Analyzer, and security simulations.',
      status: 'Active',
      link: '/cyber-security',
      color: 'from-accent to-primary'
    }
  ];

  return (
    <section id="projects" className="py-24 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              My Projects
            </span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={project.title}
              className="p-8 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] group animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`inline-block p-4 bg-gradient-to-r ${project.color} rounded-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <project.icon className="w-10 h-10 text-primary-foreground" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent border border-accent/50">
                    {project.status}
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                <Button 
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground w-full group-hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                  onClick={() => navigate(project.link)}
                >
                  Try It Out
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
