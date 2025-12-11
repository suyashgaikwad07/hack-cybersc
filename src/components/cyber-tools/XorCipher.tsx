import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Key, Lock, Unlock, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const XorCipher = () => {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [outputHex, setOutputHex] = useState('');
  const [copied, setCopied] = useState(false);

  const xorEncrypt = (text: string, secretKey: string): { text: string; hex: string } => {
    let result = '';
    let hexResult = '';
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
      result += String.fromCharCode(charCode);
      hexResult += charCode.toString(16).padStart(2, '0') + ' ';
    }
    
    return { text: result, hex: hexResult.trim() };
  };

  const xorDecryptFromHex = (hexString: string, secretKey: string): string => {
    const hexArray = hexString.trim().split(' ');
    let result = '';
    
    for (let i = 0; i < hexArray.length; i++) {
      const charCode = parseInt(hexArray[i], 16) ^ secretKey.charCodeAt(i % secretKey.length);
      result += String.fromCharCode(charCode);
    }
    
    return result;
  };

  const handleEncrypt = () => {
    if (!input.trim()) {
      toast.error('Please enter text to encrypt');
      return;
    }
    if (!key.trim()) {
      toast.error('Please enter an encryption key');
      return;
    }

    const { text, hex } = xorEncrypt(input, key);
    setOutput(text);
    setOutputHex(hex);
    toast.success('Text encrypted!');
  };

  const handleDecrypt = () => {
    if (!input.trim()) {
      toast.error('Please enter hex values to decrypt');
      return;
    }
    if (!key.trim()) {
      toast.error('Please enter the decryption key');
      return;
    }

    try {
      const decrypted = xorDecryptFromHex(input, key);
      setOutput(decrypted);
      setOutputHex('');
      toast.success('Text decrypted!');
    } catch (error) {
      toast.error('Invalid hex input');
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-8 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg">
          <Key className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">XOR Cipher</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Input (Text for encryption, Hex values for decryption)
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encrypt or hex values (e.g., 1a 2b 3c) to decrypt..."
            className="min-h-[100px] bg-background border-border focus:border-primary font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Encryption Key
          </label>
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter secret key..."
            className="bg-background border-border focus:border-primary"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <Button
            onClick={handleEncrypt}
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Lock className="w-4 h-4 mr-2" />
            Encrypt
          </Button>
          <Button
            onClick={handleDecrypt}
            variant="outline"
            className="flex-1 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Unlock className="w-4 h-4 mr-2" />
            Decrypt
          </Button>
        </div>

        {output && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-muted-foreground">
                  Result
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(output)}
                  className="border-primary/50"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <Textarea
                value={output}
                readOnly
                className="min-h-[80px] bg-muted/30 border-border font-mono"
              />
            </div>

            {outputHex && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Hex Output (use this for decryption)
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(outputHex)}
                    className="border-primary/50"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  value={outputHex}
                  readOnly
                  className="min-h-[60px] bg-muted/30 border-border font-mono text-sm"
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">About XOR Cipher</h3>
          <p className="text-sm text-muted-foreground">
            XOR cipher is a symmetric encryption that uses the exclusive OR operation.
            The same key is used for both encryption and decryption. While simple,
            XOR forms the basis of many modern encryption algorithms like AES.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default XorCipher;
