import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Car, Shield, CheckCircle, XCircle } from 'lucide-react';

const V2XMessageSigning = () => {
  const [vehicleId, setVehicleId] = useState('V123');
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [verifyMessage, setVerifyMessage] = useState('');
  const [verifySignature, setVerifySignature] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const SECRET_KEY = 'V2XSecretKey';

  const generateMessage = async () => {
    const position = Math.floor(Math.random() * 100);
    const speed = Math.floor(Math.random() * 60) + 20;
    const msg = `Vehicle ${vehicleId} position ${position}, speed ${speed}`;
    setMessage(msg);
    
    // Create signature
    const sig = await signMessage(msg);
    setSignature(sig);
    setVerificationResult(null);
  };

  const signMessage = async (msg: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(msg + SECRET_KEY);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const verifyMsg = async () => {
    if (!verifyMessage || !verifySignature) return;
    
    const expectedSignature = await signMessage(verifyMessage);
    setVerificationResult(expectedSignature === verifySignature);
  };

  const testWithTampering = () => {
    const tamperedMsg = message.replace('speed', 'sp33d');
    setVerifyMessage(tamperedMsg);
    setVerifySignature(signature);
    setTimeout(() => verifyMsg(), 100);
  };

  return (
    <Card className="p-8 bg-card border-border max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-block p-4 bg-gradient-to-r from-primary to-accent rounded-full mb-4">
            <Car className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            V2X Message Signing
          </h2>
          <p className="text-muted-foreground">
            Vehicle-to-Everything communication security simulation
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="vehicleId">Vehicle ID</Label>
            <Input
              id="vehicleId"
              type="text"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              placeholder="e.g., V123"
              className="mt-2"
            />
          </div>

          <Button
            onClick={generateMessage}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Car className="w-4 h-4 mr-2" />
            Generate Signed Message
          </Button>

          {message && (
            <div className="space-y-3 bg-muted p-4 rounded-lg">
              <div>
                <Label className="text-xs">Message</Label>
                <p className="text-sm font-mono mt-1 break-all">{message}</p>
              </div>
              <div>
                <Label className="text-xs">Signature (SHA-256)</Label>
                <p className="text-xs font-mono mt-1 break-all text-primary">{signature}</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="font-semibold text-lg text-foreground">Verify Message</h3>
          
          <div>
            <Label htmlFor="verifyMessage">Message to Verify</Label>
            <Input
              id="verifyMessage"
              type="text"
              value={verifyMessage}
              onChange={(e) => setVerifyMessage(e.target.value)}
              placeholder="Paste message here"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="verifySignature">Signature</Label>
            <Input
              id="verifySignature"
              type="text"
              value={verifySignature}
              onChange={(e) => setVerifySignature(e.target.value)}
              placeholder="Paste signature here"
              className="mt-2"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={verifyMsg}
              disabled={!verifyMessage || !verifySignature}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Shield className="w-4 h-4 mr-2" />
              Verify
            </Button>
            <Button
              onClick={testWithTampering}
              disabled={!message || !signature}
              variant="outline"
              className="flex-1 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Test Tampering
            </Button>
          </div>

          {verificationResult !== null && (
            <div className={`flex items-center gap-2 p-4 rounded-lg ${
              verificationResult 
                ? 'bg-primary/10 border border-primary/50' 
                : 'bg-destructive/10 border border-destructive/50'
            }`}>
              {verificationResult ? (
                <>
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-primary">Message verified successfully!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-destructive" />
                  <span className="font-semibold text-destructive">Verification failed - Message tampered!</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-foreground">What is V2X?</h3>
          <p className="text-sm text-muted-foreground">
            Vehicle-to-Everything (V2X) communication allows vehicles to share information about position, 
            speed, and road conditions. Message signing ensures the authenticity and integrity of these 
            messages, preventing malicious actors from sending fake data that could cause accidents.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default V2XMessageSigning;
