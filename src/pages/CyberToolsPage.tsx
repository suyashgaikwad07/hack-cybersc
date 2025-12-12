import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Hash, Key, FileCode, Network, ImageIcon, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CyberToolsPage = () => {
  const navigate = useNavigate();

  const tools = [
    {
      icon: Lock,
      title: 'Password Generator',
      description: 'Generate strong, cryptographically secure passwords with customizable length and character options.',
      color: 'from-primary to-accent',
      route: '/password-generator'
    },
    {
      icon: Hash,
      title: 'Hash Tools',
      description: 'Generate hashes (SHA-1, SHA-256, SHA-512) and securely hash passwords with salt verification.',
      color: 'from-accent to-primary',
      route: '/hash-tools'
    },
    {
      icon: Key,
      title: 'Cipher Tools',
      description: 'Encrypt and decrypt using XOR and Caesar cipher techniques. Learn the foundations of encryption.',
      color: 'from-primary to-accent',
      route: '/cipher-tools'
    },
    {
      icon: Shield,
      title: 'Port Scanner',
      description: 'Educational port scanning simulator to learn about network security and open ports.',
      color: 'from-accent to-primary',
      route: '/port-scanner'
    },
    {
      icon: Shield,
      title: 'V2X Message Signing',
      description: 'Learn how vehicle-to-everything communication uses message signing to ensure authenticity and prevent tampering.',
      color: 'from-primary to-accent',
      route: '/v2x-signing'
    },
    {
      icon: FileCode,
      title: 'Base64 Encoder/Decoder',
      description: 'Convert text to and from Base64 encoding. Commonly used for data transmission and embedding.',
      color: 'from-accent to-primary',
      route: '/base64-encoder'
    },
    {
      icon: Network,
      title: 'Network Packet Analyzer',
      description: 'Educational packet capture simulator showing network traffic structure and protocols.',
      color: 'from-primary to-accent',
      route: '/packet-analyzer'
    },
    {
      icon: ImageIcon,
      title: 'Steganography',
      description: 'Hide secret messages within images using LSB encoding. Extract hidden messages from images.',
      color: 'from-accent to-primary',
      route: '/steganography'
    },
    {
      icon: Link,
      title: 'URL Encoder/Decoder',
      description: 'Encode special characters for URLs or decode URL-encoded strings safely.',
      color: 'from-primary to-accent',
      route: '/url-encoder'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block p-4 bg-gradient-to-r from-primary to-accent rounded-full mb-6">
              <Shield className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Cyber Learning Tools
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Interactive cybersecurity tools to enhance online safety and security awareness
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
                      <Shield className="w-4 h-4 ml-2" />
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

export default CyberToolsPage;
