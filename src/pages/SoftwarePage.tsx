import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Code, Bot, FolderOpen, GraduationCap, Terminal, FileCode, Globe, CheckSquare } from 'lucide-react';

const SoftwarePage = () => {
  const projects = [
    {
      icon: Bot,
      title: 'Trading Bot',
      description: 'A CLI-based Binance futures trading bot with market and limit orders, built with Python.',
      color: 'from-primary to-accent',
      tech: ['Python', 'Binance API']
    },
    {
      icon: FolderOpen,
      title: 'File Organizer',
      description: 'Automated file organizer that sorts files into categories by extension type.',
      color: 'from-accent to-primary',
      tech: ['Python', 'OS Module']
    },
    {
      icon: GraduationCap,
      title: 'Student Manager',
      description: 'Student record management system with JSON storage for grades and attendance.',
      color: 'from-primary to-accent',
      tech: ['Python', 'JSON']
    },
    {
      icon: Terminal,
      title: 'Weather App',
      description: 'Weather information fetcher using API calls to display current conditions.',
      color: 'from-accent to-primary',
      tech: ['Python', 'API']
    },
    {
      icon: FileCode,
      title: 'Caesar Cipher',
      description: 'Classic Caesar cipher encoder/decoder for learning basic cryptography concepts.',
      color: 'from-primary to-accent',
      tech: ['Python']
    },
    {
      icon: Code,
      title: 'Hangman Game',
      description: 'Terminal-based Hangman word guessing game with ASCII art display.',
      color: 'from-accent to-primary',
      tech: ['Python']
    },
    {
      icon: Globe,
      title: 'Web Scraper',
      description: 'Automated web scraping tool to extract and organize data from websites efficiently.',
      color: 'from-primary to-accent',
      tech: ['Python', 'BeautifulSoup']
    },
    {
      icon: CheckSquare,
      title: 'To-Do List App',
      description: 'Task management application to create, track, and organize daily tasks and priorities.',
      color: 'from-accent to-primary',
      tech: ['Python']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block p-4 bg-gradient-to-r from-primary to-accent rounded-full mb-6">
              <Code className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Software Projects
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Python applications and utilities built to solve real-world problems
            </p>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-6" />
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <Card 
                  key={project.title}
                  className="p-8 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] group animate-slide-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`inline-block p-4 bg-gradient-to-r ${project.color} rounded-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 text-primary-foreground" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map(t => (
                        <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/50">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SoftwarePage;
