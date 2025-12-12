import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, Lock, Unlock, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const CipherTools = () => {
  // XOR Cipher State
  const [xorInput, setXorInput] = useState('');
  const [xorKey, setXorKey] = useState('');
  const [xorOutput, setXorOutput] = useState('');
  const [xorOutputHex, setXorOutputHex] = useState('');
  const [xorCopied, setXorCopied] = useState(false);

  // Caesar Cipher State
  const [caesarText, setCaesarText] = useState('');
  const [shift, setShift] = useState(3);
  const [caesarResult, setCaesarResult] = useState('');
  const [caesarCopied, setCaesarCopied] = useState(false);

  // XOR Functions
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

  const handleXorEncrypt = () => {
    if (!xorInput.trim()) {
      toast.error('Please enter text to encrypt');
      return;
    }
    if (!xorKey.trim()) {
      toast.error('Please enter an encryption key');
      return;
    }

    const { text, hex } = xorEncrypt(xorInput, xorKey);
    setXorOutput(text);
    setXorOutputHex(hex);
    toast.success('Text encrypted!');
  };

  const handleXorDecrypt = () => {
    if (!xorInput.trim()) {
      toast.error('Please enter hex values to decrypt');
      return;
    }
    if (!xorKey.trim()) {
      toast.error('Please enter the decryption key');
      return;
    }

    try {
      const decrypted = xorDecryptFromHex(xorInput, xorKey);
      setXorOutput(decrypted);
      setXorOutputHex('');
      toast.success('Text decrypted!');
    } catch (error) {
      toast.error('Invalid hex input');
    }
  };

  // Caesar Functions
  const caesarCipher = (input: string, shiftValue: number, mode: 'encrypt' | 'decrypt') => {
    const normalizedShift = ((shiftValue % 26) + 26) % 26;
    let output = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      
      if (char.match(/[a-z]/i)) {
        const base = char === char.toUpperCase() ? 65 : 97;
        const charCode = char.charCodeAt(0);
        
        let shifted;
        if (mode === 'encrypt') {
          shifted = ((charCode - base + normalizedShift) % 26) + base;
        } else {
          shifted = ((charCode - base - normalizedShift + 26) % 26) + base;
        }
        
        output += String.fromCharCode(shifted);
      } else {
        output += char;
      }
    }

    return output;
  };

  const handleCaesarEncrypt = () => {
    if (!caesarText.trim()) {
      toast.error('Please enter text to encrypt');
      return;
    }
    const result = caesarCipher(caesarText, shift, 'encrypt');
    setCaesarResult(result);
    toast.success('Text encrypted!');
  };

  const handleCaesarDecrypt = () => {
    if (!caesarText.trim()) {
      toast.error('Please enter text to decrypt');
      return;
    }
    const result = caesarCipher(caesarText, shift, 'decrypt');
    setCaesarResult(result);
    toast.success('Text decrypted!');
  };

  const copyToClipboard = async (text: string, type: 'xor' | 'caesar') => {
    await navigator.clipboard.writeText(text);
    if (type === 'xor') {
      setXorCopied(true);
      setTimeout(() => setXorCopied(false), 2000);
    } else {
      setCaesarCopied(true);
      setTimeout(() => setCaesarCopied(false), 2000);
    }
    toast.success('Copied to clipboard!');
  };

  return (
    <Card className="p-8 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg">
          <Key className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Cipher Tools</h2>
      </div>

      <Tabs defaultValue="xor" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="xor">XOR Cipher</TabsTrigger>
          <TabsTrigger value="caesar">Caesar Cipher</TabsTrigger>
        </TabsList>

        <TabsContent value="xor" className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Input (Text for encryption, Hex values for decryption)
            </label>
            <Textarea
              value={xorInput}
              onChange={(e) => setXorInput(e.target.value)}
              placeholder="Enter text to encrypt or hex values (e.g., 1a 2b 3c) to decrypt..."
              className="min-h-[100px] bg-background border-border focus:border-primary font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Encryption Key
            </label>
            <Input
              value={xorKey}
              onChange={(e) => setXorKey(e.target.value)}
              placeholder="Enter secret key..."
              className="bg-background border-border focus:border-primary"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={handleXorEncrypt}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Lock className="w-4 h-4 mr-2" />
              Encrypt
            </Button>
            <Button
              onClick={handleXorDecrypt}
              variant="outline"
              className="flex-1 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Decrypt
            </Button>
          </div>

          {xorOutput && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Result
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(xorOutput, 'xor')}
                    className="border-primary/50"
                  >
                    {xorCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <Textarea
                  value={xorOutput}
                  readOnly
                  className="min-h-[80px] bg-muted/30 border-border font-mono"
                />
              </div>

              {xorOutputHex && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-muted-foreground">
                      Hex Output (use this for decryption)
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(xorOutputHex, 'xor')}
                      className="border-primary/50"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={xorOutputHex}
                    readOnly
                    className="min-h-[60px] bg-muted/30 border-border font-mono text-sm"
                  />
                </div>
              )}
            </div>
          )}

          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">About XOR Cipher</h3>
            <p className="text-sm text-muted-foreground">
              XOR cipher is a symmetric encryption that uses the exclusive OR operation.
              The same key is used for both encryption and decryption. While simple,
              XOR forms the basis of many modern encryption algorithms like AES.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="caesar" className="space-y-6">
          <div>
            <Label htmlFor="caesar-text">Enter Text</Label>
            <Textarea
              id="caesar-text"
              value={caesarText}
              onChange={(e) => setCaesarText(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[100px] mt-2"
            />
          </div>

          <div>
            <Label htmlFor="shift">Shift Value (Key)</Label>
            <Input
              id="shift"
              type="number"
              value={shift}
              onChange={(e) => setShift(parseInt(e.target.value) || 0)}
              className="mt-2"
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleCaesarEncrypt}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Lock className="w-4 h-4 mr-2" />
              Encrypt
            </Button>
            <Button
              onClick={handleCaesarDecrypt}
              variant="outline"
              className="flex-1 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Decrypt
            </Button>
          </div>

          {caesarResult && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Result</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(caesarResult, 'caesar')}
                  className="border-primary/50"
                >
                  {caesarCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <Textarea
                value={caesarResult}
                readOnly
                className="min-h-[100px] bg-muted"
              />
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-foreground">How it works:</h3>
            <p className="text-sm text-muted-foreground">
              The Caesar cipher shifts each letter by a fixed number of positions in the alphabet. 
              For example, with a shift of 3, A becomes D, B becomes E, and so on.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default CipherTools;
