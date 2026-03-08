import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Shield, Network, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CyberSecurityPage = () => {
  const navigate = useNavigate();

  const tools = [
    {
      icon: Shield,
      title: 'Port Scanner',
      description: 'Educational port scanning simulator to learn about network security, open ports, and vulnerability assessment.',
      color: 'from-primary to-accent',
      route: '/port-scanner'
    },
    {
      icon: Car,
      title: 'V2X Message Signing',
      description: 'Vehicle-to-Everything communication security simulation demonstrating message signing and tamper detection.',
      color: 'from-accent to-primary',
      route: '/v2x-signing'
    },
    {
      icon: Network,
      title: 'Network Packet Analyzer',
      description: 'Educational packet capture simulator showing network traffic structure, protocols, and packet inspection.',
      color: 'from-primary to-accent',
      route: '/packet-analyzer'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block p-4 bg-gradient-to-r from-primary to-accent rounded-full mb-6">
              <Lock className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Cyber Security
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Network security tools and simulations for hands-on learning
            </p>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-6" />
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card 
                  key={tool.title}
                  className="p-8 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] group animate-slide-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`inline-block p-4 bg-gradient-to-r ${tool.color} rounded-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 text-primary-foreground" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">{tool.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>

                    <Button 
                      variant="outline"
                      className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground w-full group-hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                      onClick={() => navigate(tool.route)}
                    >
                      Try It Out
                      <Lock className="w-4 h-4 ml-2" />
                    </Button>
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

export default CyberSecurityPage;
