import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Lock, Unlock } from 'lucide-react';

const CaesarCipher = () => {
  const [text, setText] = useState('');
  const [shift, setShift] = useState(3);
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const caesarCipher = (input: string, shiftValue: number, cipherMode: 'encrypt' | 'decrypt') => {
    const normalizedShift = ((shiftValue % 26) + 26) % 26;
    let output = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      
      if (char.match(/[a-z]/i)) {
        const base = char === char.toUpperCase() ? 65 : 97;
        const charCode = char.charCodeAt(0);
        
        let shifted;
        if (cipherMode === 'encrypt') {
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

  const handleProcess = () => {
    const processed = caesarCipher(text, shift, mode);
    setResult(processed);
  };

  return (
    <Card className="p-8 bg-card border-border max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-block p-4 bg-gradient-to-r from-primary to-accent rounded-full mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Caesar Cipher
          </h2>
          <p className="text-muted-foreground">
            Encrypt or decrypt text using the classic Caesar cipher
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="text">Enter Text</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
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
              onClick={() => {
                setMode('encrypt');
                if (text) handleProcess();
              }}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Lock className="w-4 h-4 mr-2" />
              Encrypt
            </Button>
            <Button
              onClick={() => {
                setMode('decrypt');
                if (text) handleProcess();
              }}
              variant="outline"
              className="flex-1 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Decrypt
            </Button>
          </div>

          {result && (
            <div>
              <Label>Result</Label>
              <Textarea
                value={result}
                readOnly
                className="min-h-[100px] mt-2 bg-muted"
              />
            </div>
          )}
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-foreground">How it works:</h3>
          <p className="text-sm text-muted-foreground">
            The Caesar cipher shifts each letter by a fixed number of positions in the alphabet. 
            For example, with a shift of 3, A becomes D, B becomes E, and so on.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CaesarCipher;
