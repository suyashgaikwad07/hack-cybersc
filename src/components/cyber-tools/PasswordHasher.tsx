import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Eye, EyeOff, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PasswordHasher = () => {
  const [passwordToHash, setPasswordToHash] = useState<string>('');
  const [hashedPassword, setHashedPassword] = useState<string>('');
  const [salt, setSalt] = useState<string>('');
  
  const [verifyPassword, setVerifyPassword] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState<boolean>(false);
  
  const { toast } = useToast();

  // Generate random salt (16 bytes as hex)
  const generateSalt = (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Hash password using Web Crypto API (SHA-256 with PBKDF2)
  const hashPassword = async (password: string, saltHex: string): Promise<string> => {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    const hashArray = Array.from(new Uint8Array(derivedBits));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const handleHashPassword = async () => {
    if (!passwordToHash.trim()) {
      toast({
        title: "Error",
        description: "Please enter a password to hash.",
        variant: "destructive"
      });
      return;
    }

    const newSalt = generateSalt();
    const hash = await hashPassword(passwordToHash, newSalt);
    
    setSalt(newSalt);
    setHashedPassword(hash);
    setVerificationResult(null);
    
    toast({
      title: "Password Hashed Successfully! 🔒",
      description: "Salt and hash have been generated.",
    });
  };

  const handleVerifyPassword = async () => {
    if (!verifyPassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a password to verify.",
        variant: "destructive"
      });
      return;
    }

    if (!salt || !hashedPassword) {
      toast({
        title: "Error",
        description: "Please hash a password first.",
        variant: "destructive"
      });
      return;
    }

    const verifyHash = await hashPassword(verifyPassword, salt);
    const isMatch = verifyHash === hashedPassword;
    
    setVerificationResult(isMatch);
    
    toast({
      title: isMatch ? "Verification Successful! ✅" : "Verification Failed ❌",
      description: isMatch ? "Passwords match!" : "Passwords do not match.",
      variant: isMatch ? "default" : "destructive"
    });
  };

  const reset = () => {
    setPasswordToHash('');
    setHashedPassword('');
    setSalt('');
    setVerifyPassword('');
    setVerificationResult(null);
    setShowPassword(false);
    setShowVerifyPassword(false);
  };

  return (
    <Card className="p-8 max-w-3xl mx-auto bg-card border-border">
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-gradient-to-r from-primary to-accent rounded-full mb-4">
          <Shield className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Password Hasher
          </span>
        </h2>
        <p className="text-muted-foreground">Secure password hashing with salt using SHA-256</p>
      </div>

      <div className="space-y-8">
        {/* Hash Password Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Hash Password</h3>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password to hash..."
              value={passwordToHash}
              onChange={(e) => setPasswordToHash(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Button 
            onClick={handleHashPassword}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Generate Hash
          </Button>

          {salt && hashedPassword && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg animate-fade-in">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Salt (16 bytes):</p>
                <code className="text-xs break-all block bg-background p-2 rounded border border-border">
                  {salt}
                </code>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Hash (SHA-256):</p>
                <code className="text-xs break-all block bg-background p-2 rounded border border-border">
                  {hashedPassword}
                </code>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Stored (Salt + Hash):</p>
                <code className="text-xs break-all block bg-background p-2 rounded border border-border">
                  {salt + hashedPassword}
                </code>
              </div>
            </div>
          )}
        </div>

        {/* Verify Password Section */}
        {salt && hashedPassword && (
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-xl font-semibold">Verify Password</h3>
            <div className="relative">
              <Input
                type={showVerifyPassword ? "text" : "password"}
                placeholder="Re-enter password to verify..."
                value={verifyPassword}
                onChange={(e) => {
                  setVerifyPassword(e.target.value);
                  setVerificationResult(null);
                }}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showVerifyPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button 
              onClick={handleVerifyPassword}
              variant="outline"
              className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Verify Password
            </Button>

            {verificationResult !== null && (
              <div className={`flex items-center gap-2 p-4 rounded-lg animate-fade-in ${
                verificationResult 
                  ? 'bg-green-500/10 text-green-500 border border-green-500/50' 
                  : 'bg-red-500/10 text-red-500 border border-red-500/50'
              }`}>
                {verificationResult ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">Password verified successfully!</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    <span className="font-semibold">Verification failed. Incorrect password.</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Reset Button */}
        <Button 
          variant="outline"
          onClick={reset}
          className="w-full border-border hover:bg-muted"
        >
          Reset All
        </Button>

        {/* Info Section */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold mb-2 text-sm">How it works:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Generates a random 16-byte salt for each password</li>
            <li>• Uses PBKDF2 with SHA-256 and 100,000 iterations</li>
            <li>• Combines salt + hash for secure storage</li>
            <li>• Verifies passwords by re-hashing with the same salt</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default PasswordHasher;
