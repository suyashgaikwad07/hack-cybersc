import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileCode, ArrowRight, ArrowLeft, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const Base64Encoder = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    if (!input.trim()) {
      toast.error('Please enter some text');
      return;
    }
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setMode('encode');
      toast.success('Text encoded successfully!');
    } catch (error) {
      toast.error('Error encoding text');
    }
  };

  const handleDecode = () => {
    if (!input.trim()) {
      toast.error('Please enter Base64 text');
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setMode('decode');
      toast.success('Text decoded successfully!');
    } catch (error) {
      toast.error('Invalid Base64 string');
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const swapInputOutput = () => {
    setInput(output);
    setOutput('');
  };

  return (
    <Card className="p-8 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg">
          <FileCode className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Base64 Encoder/Decoder</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Input Text
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode or Base64 to decode..."
            className="min-h-[120px] bg-background border-border focus:border-primary font-mono"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <Button
            onClick={handleEncode}
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Encode to Base64
          </Button>
          <Button
            onClick={handleDecode}
            variant="outline"
            className="flex-1 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Decode from Base64
          </Button>
        </div>

        {output && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-muted-foreground">
                {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
              </label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={swapInputOutput}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Use as input
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="border-primary/50"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <Textarea
              value={output}
              readOnly
              className="min-h-[120px] bg-muted/30 border-border font-mono"
            />
          </div>
        )}

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">About Base64</h3>
          <p className="text-sm text-muted-foreground">
            Base64 is an encoding scheme that converts binary data into ASCII text format.
            It is commonly used to encode data when transmitting over media that only support
            text, such as email attachments and embedding images in HTML/CSS.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Base64Encoder;
