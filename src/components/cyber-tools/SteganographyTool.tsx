import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon, Lock, Unlock, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

const SteganographyTool = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [encodedImage, setEncodedImage] = useState<string | null>(null);
  const [secretMessage, setSecretMessage] = useState('');
  const [extractedMessage, setExtractedMessage] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setEncodedImage(null);
      setExtractedMessage('');
    };
    reader.readAsDataURL(file);
  };

  const textToBinary = (text: string): string => {
    return text
      .split('')
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join('');
  };

  const binaryToText = (binary: string): string => {
    const bytes = binary.match(/.{8}/g) || [];
    return bytes.map((byte) => String.fromCharCode(parseInt(byte, 2))).join('');
  };

  const encodeMessage = () => {
    if (!originalImage) {
      toast.error('Please upload an image first');
      return;
    }
    if (!secretMessage.trim()) {
      toast.error('Please enter a secret message');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Add delimiter to mark end of message
      const messageWithDelimiter = secretMessage + '\0\0\0';
      const binaryMessage = textToBinary(messageWithDelimiter);

      if (binaryMessage.length > data.length / 4) {
        toast.error('Message is too long for this image');
        return;
      }

      // Encode message in LSB of red channel
      for (let i = 0; i < binaryMessage.length; i++) {
        const pixelIndex = i * 4; // RGBA
        const bit = parseInt(binaryMessage[i]);
        data[pixelIndex] = (data[pixelIndex] & 0xfe) | bit; // Modify LSB of red channel
      }

      ctx.putImageData(imageData, 0, 0);
      setEncodedImage(canvas.toDataURL('image/png'));
      toast.success('Message hidden successfully!');
    };
    img.src = originalImage;
  };

  const decodeMessage = () => {
    if (!originalImage) {
      toast.error('Please upload an image to decode');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let binaryMessage = '';
      // Extract LSB from red channel
      for (let i = 0; i < data.length; i += 4) {
        binaryMessage += (data[i] & 1).toString();
      }

      const message = binaryToText(binaryMessage);
      // Find end delimiter
      const endIndex = message.indexOf('\0\0\0');
      const extractedMsg = endIndex !== -1 ? message.slice(0, endIndex) : 'No hidden message found';
      
      setExtractedMessage(extractedMsg);
      if (endIndex !== -1) {
        toast.success('Hidden message extracted!');
      } else {
        toast.info('No hidden message detected in this image');
      }
    };
    img.src = originalImage;
  };

  const downloadImage = () => {
    if (!encodedImage) return;
    const link = document.createElement('a');
    link.download = 'stego-image.png';
    link.href = encodedImage;
    link.click();
    toast.success('Image downloaded!');
  };

  return (
    <Card className="p-8 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg">
          <ImageIcon className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Steganography Tool</h2>
      </div>

      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-4">
          <Button
            variant={mode === 'encode' ? 'default' : 'outline'}
            onClick={() => setMode('encode')}
            className={mode === 'encode' 
              ? 'bg-gradient-to-r from-primary to-accent' 
              : 'border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground'}
          >
            <Lock className="w-4 h-4 mr-2" />
            Hide Message
          </Button>
          <Button
            variant={mode === 'decode' ? 'default' : 'outline'}
            onClick={() => setMode('decode')}
            className={mode === 'decode' 
              ? 'bg-gradient-to-r from-primary to-accent' 
              : 'border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground'}
          >
            <Unlock className="w-4 h-4 mr-2" />
            Extract Message
          </Button>
        </div>

        {/* Image Upload */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-dashed border-2 border-primary/50 h-24 hover:bg-primary/10"
          >
            <Upload className="w-5 h-5 mr-2" />
            {originalImage ? 'Change Image' : 'Upload Image'}
          </Button>
        </div>

        {/* Image Preview */}
        {originalImage && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">
              {mode === 'encode' ? 'Original Image' : 'Image to Decode'}
            </label>
            <div className="border border-border rounded-lg p-2 bg-muted/20">
              <img
                src={originalImage}
                alt="Uploaded"
                className="max-w-full max-h-64 mx-auto rounded"
              />
            </div>
          </div>
        )}

        {mode === 'encode' ? (
          <>
            {/* Secret Message Input */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Secret Message
              </label>
              <Textarea
                value={secretMessage}
                onChange={(e) => setSecretMessage(e.target.value)}
                placeholder="Enter the message to hide..."
                className="min-h-[100px] bg-background border-border focus:border-primary"
              />
            </div>

            <Button
              onClick={encodeMessage}
              disabled={!originalImage || !secretMessage}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Lock className="w-4 h-4 mr-2" />
              Hide Message in Image
            </Button>

            {/* Encoded Image Result */}
            {encodedImage && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  Encoded Image (with hidden message)
                </label>
                <div className="border border-primary/50 rounded-lg p-2 bg-muted/20">
                  <img
                    src={encodedImage}
                    alt="Encoded"
                    className="max-w-full max-h-64 mx-auto rounded"
                  />
                </div>
                <Button
                  onClick={downloadImage}
                  variant="outline"
                  className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Encoded Image
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <Button
              onClick={decodeMessage}
              disabled={!originalImage}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Extract Hidden Message
            </Button>

            {/* Extracted Message */}
            {extractedMessage && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  Extracted Message
                </label>
                <Textarea
                  value={extractedMessage}
                  readOnly
                  className="min-h-[100px] bg-muted/30 border-border font-mono"
                />
              </div>
            )}
          </>
        )}

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">About Steganography</h3>
          <p className="text-sm text-muted-foreground">
            Steganography is the practice of hiding secret information within ordinary,
            non-secret data. This tool uses LSB (Least Significant Bit) encoding to hide
            messages in the pixel data of images. The changes are imperceptible to the
            human eye, making it an effective way to conceal information.
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Tip: Use PNG images for best results as JPEG compression may corrupt hidden data.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SteganographyTool;
