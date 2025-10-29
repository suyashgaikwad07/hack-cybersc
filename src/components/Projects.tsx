import { Gamepad2, Shield, ExternalLink } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

const Projects = () => {
  const projects = [
    {
      icon: Gamepad2,
      title: 'Funny Games',
      description: 'A fun Python-based project building small interactive games to practice coding logic and creativity.',
      status: 'Completed',
      link: 'https://github.com/suyashgaikwad07/Basic-Programming.../commits/python/',
      color: 'from-primary to-accent'
    },
    {
      icon: Shield,
      title: 'Cyber Learning Tools',
      description: 'Interactive cybersecurity tools including a secure password generator to enhance online safety and security awareness.',
      status: 'Active',
      link: '/password-generator',
      color: 'from-accent to-primary'
    }
  ];

  return (
    <section id="projects" className="py-24 bg-background">
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
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'Completed' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-accent/20 text-accent border border-accent/50'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {project.link && (
                  <Button 
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground w-full group-hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                    onClick={() => {
                      if (project.link?.startsWith('http')) {
                        window.open(project.link, '_blank');
                      } else {
                        window.location.href = project.link || '#';
                      }
                    }}
                  >
                    {project.link.startsWith('http') ? 'View on GitHub' : 'Try It Out'}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
