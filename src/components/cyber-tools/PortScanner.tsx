import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Shield, AlertCircle } from 'lucide-react';

const PortScanner = () => {
  const [target, setTarget] = useState('');
  const [startPort, setStartPort] = useState(1);
  const [endPort, setEndPort] = useState(1024);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // Common ports for educational purposes
  const commonPorts: { [key: number]: string } = {
    21: 'FTP',
    22: 'SSH',
    23: 'Telnet',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    110: 'POP3',
    143: 'IMAP',
    443: 'HTTPS',
    3306: 'MySQL',
    5432: 'PostgreSQL',
    8080: 'HTTP Proxy'
  };

  const simulateScan = () => {
    if (!target) return;

    setScanning(true);
    setResults([]);
    
    const scanResults: string[] = [`Scanning ${target}...`, ''];
    
    // Simulate scanning delay
    setTimeout(() => {
      // Simulate finding some common ports
      const foundPorts = Object.keys(commonPorts)
        .map(Number)
        .filter(port => port >= startPort && port <= endPort)
        .filter(() => Math.random() > 0.5); // Randomly "find" ports

      if (foundPorts.length > 0) {
        foundPorts.forEach(port => {
          scanResults.push(`Port ${port} (${commonPorts[port]}): OPEN`);
        });
        scanResults.push('');
        scanResults.push(`Found ${foundPorts.length} open port(s)`);
      } else {
        scanResults.push('No open ports found in this range');
      }

      setResults(scanResults);
      setScanning(false);
    }, 2000);
  };

  return (
    <Card className="p-8 bg-card border-border max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-block p-4 bg-gradient-to-r from-primary to-accent rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Port Scanner Simulator
          </h2>
          <p className="text-muted-foreground">
            Educational tool to learn about network port scanning
          </p>
        </div>

        <div className="bg-destructive/10 border border-destructive/50 p-4 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-destructive font-semibold">Educational Purpose Only</p>
            <p className="text-xs text-muted-foreground mt-1">
              This is a simulation. Real port scanning without authorization is illegal. 
              Only scan networks you own or have permission to test.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="target">Target (IP or Domain)</Label>
            <Input
              id="target"
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g., 192.168.1.1 or example.com"
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startPort">Start Port</Label>
              <Input
                id="startPort"
                type="number"
                value={startPort}
                onChange={(e) => setStartPort(parseInt(e.target.value) || 1)}
                min="1"
                max="65535"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="endPort">End Port</Label>
              <Input
                id="endPort"
                type="number"
                value={endPort}
                onChange={(e) => setEndPort(parseInt(e.target.value) || 1024)}
                min="1"
                max="65535"
                className="mt-2"
              />
            </div>
          </div>

          <Button
            onClick={simulateScan}
            disabled={scanning || !target}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {scanning ? 'Scanning...' : 'Start Scan'}
          </Button>

          {results.length > 0 && (
            <div className="bg-background border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-foreground">Scan Results:</h3>
              <div className="font-mono text-sm space-y-1">
                {results.map((line, index) => (
                  <div key={index} className={line.includes('OPEN') ? 'text-primary' : 'text-muted-foreground'}>
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-foreground">What is port scanning?</h3>
          <p className="text-sm text-muted-foreground">
            Port scanning checks which network ports on a computer are open and accepting connections. 
            Security professionals use it to find vulnerabilities, while attackers might use it to find 
            ways into systems. Common ports include 80 (HTTP), 443 (HTTPS), 22 (SSH), and 3306 (MySQL).
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PortScanner;
