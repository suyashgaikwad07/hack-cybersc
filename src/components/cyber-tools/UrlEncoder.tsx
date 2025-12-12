import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Link, ArrowRightLeft, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const UrlEncoder = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      toast({
        title: "Encoded Successfully",
        description: "Text has been URL encoded",
      });
    } catch (error) {
      toast({
        title: "Encoding Error",
        description: "Failed to encode the text",
        variant: "destructive",
      });
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      toast({
        title: "Decoded Successfully",
        description: "URL has been decoded",
      });
    } catch (error) {
      toast({
        title: "Decoding Error",
        description: "Invalid URL-encoded string",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Output copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const swapInputOutput = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Link className="h-6 w-6" />
          URL Encoder/Decoder
        </CardTitle>
        <CardDescription>
          Encode special characters for URLs or decode URL-encoded strings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            onClick={() => setMode("encode")}
            className="flex-1"
          >
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            onClick={() => setMode("decode")}
            className="flex-1"
          >
            Decode
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="input">
            {mode === "encode" ? "Text to Encode" : "URL to Decode"}
          </Label>
          <Textarea
            id="input"
            placeholder={
              mode === "encode"
                ? "Enter text with special characters (e.g., Hello World! @#$%)"
                : "Enter URL-encoded string (e.g., Hello%20World%21)"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px] bg-background/50 border-primary/30 font-mono text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={mode === "encode" ? handleEncode : handleDecode}
            className="flex-1"
          >
            {mode === "encode" ? "Encode URL" : "Decode URL"}
          </Button>
          <Button
            variant="outline"
            onClick={swapInputOutput}
            className="border-primary/30"
            title="Swap input/output and toggle mode"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>

        {output && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="output">Result</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="text-primary hover:text-primary/80"
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <Textarea
              id="output"
              value={output}
              readOnly
              className="min-h-[100px] bg-background/50 border-primary/30 font-mono text-sm"
            />
          </div>
        )}

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-primary mb-2">About URL Encoding</h4>
          <p className="text-sm text-muted-foreground mb-3">
            URL encoding converts special characters into a format that can be safely transmitted in URLs. 
            Characters like spaces, &, ?, = and others are replaced with percent-encoded values.
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Common encodings:</strong></p>
            <p>Space → %20 | & → %26 | = → %3D | ? → %3F | # → %23</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UrlEncoder;
