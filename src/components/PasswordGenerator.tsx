import { useState } from 'react';
import { Shield, Copy, RefreshCw, Check } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const PasswordGenerator = () => {
  const [length, setLength] = useState<number>(12);
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    if (length < 6) {
      toast({
        title: "Invalid Length",
        description: "Password length should be at least 6 characters.",
        variant: "destructive"
      });
      return;
    }

    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const punctuation = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = letters + digits + punctuation;

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block p-4 bg-gradient-to-r from-primary to-accent rounded-lg mb-6">
              <Shield className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Password Generator
              </span>
            </h1>
            <p className="text-muted-foreground">
              Generate strong, secure passwords for your online accounts
            </p>
          </div>

          <Card className="p-8 bg-card border-border animate-slide-up">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Password Length (minimum 6)
                </label>
                <Input
                  type="number"
                  min="6"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value) || 6)}
                  className="bg-background border-border"
                />
              </div>

              <Button
                onClick={generatePassword}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Password
              </Button>

              {password && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Generated Password
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={password}
                      readOnly
                      className="bg-background border-border font-mono"
                    />
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-semibold mb-3 text-foreground">Security Tips:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use at least 12 characters for strong passwords</li>
                  <li>• Never reuse passwords across different accounts</li>
                  <li>• Store passwords securely using a password manager</li>
                  <li>• Enable two-factor authentication when available</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
