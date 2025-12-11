import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Hash, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const HashGenerator = () => {
  const [input, setInput] = useState('');
  const [sha256Hash, setSha256Hash] = useState('');
  const [sha1Hash, setSha1Hash] = useState('');
  const [sha512Hash, setSha512Hash] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const generateHash = async (algorithm: string, data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please enter some text to hash');
      return;
    }

    try {
      const [sha256, sha1, sha512] = await Promise.all([
        generateHash('SHA-256', input),
        generateHash('SHA-1', input),
        generateHash('SHA-512', input),
      ]);

      setSha256Hash(sha256);
      setSha1Hash(sha1);
      setSha512Hash(sha512);
      toast.success('Hashes generated successfully!');
    } catch (error) {
      toast.error('Error generating hashes');
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(`${type} hash copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const hashResults = [
    { label: 'SHA-256', value: sha256Hash, key: 'sha256' },
    { label: 'SHA-1', value: sha1Hash, key: 'sha1' },
    { label: 'SHA-512', value: sha512Hash, key: 'sha512' },
  ];

  return (
    <Card className="p-8 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg">
          <Hash className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Hash Generator</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Input Text
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="min-h-[100px] bg-background border-border focus:border-primary"
          />
        </div>

        <Button
          onClick={handleGenerate}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
        >
          Generate Hashes
        </Button>

        {hashResults.map((hash) => (
          hash.value && (
            <div key={hash.key} className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">
                {hash.label}
              </label>
              <div className="flex gap-2">
                <Input
                  value={hash.value}
                  readOnly
                  className="font-mono text-xs bg-background border-border"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(hash.value, hash.label)}
                  className="border-primary/50 hover:bg-primary hover:text-primary-foreground"
                >
                  {copied === hash.label ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )
        ))}

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">About Hash Functions</h3>
          <p className="text-sm text-muted-foreground">
            Hash functions convert data into fixed-size strings. They are one-way functions,
            meaning you cannot reverse the hash to get the original data. SHA-256 and SHA-512
            are considered cryptographically secure, while SHA-1 is deprecated for security purposes.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default HashGenerator;
