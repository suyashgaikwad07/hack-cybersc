import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hash, Copy, Check, Shield, Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

const HashTools = () => {
  // Hash Generator State
  const [hashInput, setHashInput] = useState('');
  const [sha256Hash, setSha256Hash] = useState('');
  const [sha1Hash, setSha1Hash] = useState('');
  const [sha512Hash, setSha512Hash] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // Password Hasher State
  const [passwordToHash, setPasswordToHash] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');
  const [salt, setSalt] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  const { toast: toastHook } = useToast();

  // Hash Generator Functions
  const generateHash = async (algorithm: string, data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleGenerateHashes = async () => {
    if (!hashInput.trim()) {
      toast.error('Please enter some text to hash');
      return;
    }

    try {
      const [sha256, sha1, sha512] = await Promise.all([
        generateHash('SHA-256', hashInput),
        generateHash('SHA-1', hashInput),
        generateHash('SHA-512', hashInput),
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

  // Password Hasher Functions
  const generateSalt = (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

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
      toastHook({
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
    
    toastHook({
      title: "Password Hashed Successfully! 🔒",
      description: "Salt and hash have been generated.",
    });
  };

  const handleVerifyPassword = async () => {
    if (!verifyPassword.trim()) {
      toastHook({
        title: "Error",
        description: "Please enter a password to verify.",
        variant: "destructive"
      });
      return;
    }

    if (!salt || !hashedPassword) {
      toastHook({
        title: "Error",
        description: "Please hash a password first.",
        variant: "destructive"
      });
      return;
    }

    const verifyHash = await hashPassword(verifyPassword, salt);
    const isMatch = verifyHash === hashedPassword;
    
    setVerificationResult(isMatch);
    
    toastHook({
      title: isMatch ? "Verification Successful! ✅" : "Verification Failed ❌",
      description: isMatch ? "Passwords match!" : "Passwords do not match.",
      variant: isMatch ? "default" : "destructive"
    });
  };

  const resetPasswordHasher = () => {
    setPasswordToHash('');
    setHashedPassword('');
    setSalt('');
    setVerifyPassword('');
    setVerificationResult(null);
    setShowPassword(false);
    setShowVerifyPassword(false);
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
        <h2 className="text-2xl font-bold text-foreground">Hash Tools</h2>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="generator">Hash Generator</TabsTrigger>
          <TabsTrigger value="password">Password Hasher</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Input Text
            </label>
            <Textarea
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Enter text to hash..."
              className="min-h-[100px] bg-background border-border focus:border-primary"
            />
          </div>

          <Button
            onClick={handleGenerateHashes}
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

          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">About Hash Functions</h3>
            <p className="text-sm text-muted-foreground">
              Hash functions convert data into fixed-size strings. They are one-way functions,
              meaning you cannot reverse the hash to get the original data. SHA-256 and SHA-512
              are considered cryptographically secure, while SHA-1 is deprecated for security purposes.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
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

          <Button 
            variant="outline"
            onClick={resetPasswordHasher}
            className="w-full border-border hover:bg-muted"
          >
            Reset All
          </Button>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2 text-sm">How it works:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Generates a random 16-byte salt for each password</li>
              <li>• Uses PBKDF2 with SHA-256 and 100,000 iterations</li>
              <li>• Combines salt + hash for secure storage</li>
              <li>• Verifies passwords by re-hashing with the same salt</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default HashTools;
