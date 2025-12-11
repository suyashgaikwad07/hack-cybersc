import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Network, Play, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface PacketData {
  id: number;
  timestamp: string;
  protocol: string;
  source: string;
  destination: string;
  length: number;
  info: string;
}

const NetworkPacketAnalyzer = () => {
  const [packets, setPackets] = useState<PacketData[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [filter, setFilter] = useState('');

  const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'ICMP', 'ARP'];
  const infoMessages: Record<string, string[]> = {
    TCP: ['SYN', 'SYN-ACK', 'ACK', 'FIN', 'RST', 'PSH-ACK'],
    UDP: ['Request', 'Response', 'Datagram'],
    HTTP: ['GET /index.html', 'POST /api/data', 'GET /images/logo.png', '200 OK', '404 Not Found'],
    HTTPS: ['TLS Handshake', 'Application Data', 'Change Cipher Spec'],
    DNS: ['Standard query A', 'Standard query response', 'Query AAAA'],
    ICMP: ['Echo request', 'Echo reply', 'Destination unreachable'],
    ARP: ['Who has', 'is at', 'Request', 'Reply'],
  };

  const generateRandomIP = () => {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  };

  const generatePacket = (id: number): PacketData => {
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const infos = infoMessages[protocol];
    
    return {
      id,
      timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
      protocol,
      source: generateRandomIP(),
      destination: generateRandomIP(),
      length: Math.floor(Math.random() * 1500) + 40,
      info: infos[Math.floor(Math.random() * infos.length)],
    };
  };

  const startCapture = () => {
    setIsCapturing(true);
    setPackets([]);
    toast.info('Starting packet capture simulation...');

    let packetId = 0;
    const interval = setInterval(() => {
      packetId++;
      setPackets((prev) => {
        const newPackets = [...prev, generatePacket(packetId)];
        return newPackets.slice(-50); // Keep last 50 packets
      });

      if (packetId >= 20) {
        clearInterval(interval);
        setIsCapturing(false);
        toast.success('Capture complete! 20 packets captured.');
      }
    }, 300);
  };

  const clearPackets = () => {
    setPackets([]);
    toast.info('Packets cleared');
  };

  const filteredPackets = packets.filter((packet) => {
    if (!filter) return true;
    const searchTerm = filter.toLowerCase();
    return (
      packet.protocol.toLowerCase().includes(searchTerm) ||
      packet.source.includes(searchTerm) ||
      packet.destination.includes(searchTerm) ||
      packet.info.toLowerCase().includes(searchTerm)
    );
  });

  const getProtocolColor = (protocol: string) => {
    const colors: Record<string, string> = {
      TCP: 'text-blue-400',
      UDP: 'text-green-400',
      HTTP: 'text-yellow-400',
      HTTPS: 'text-emerald-400',
      DNS: 'text-purple-400',
      ICMP: 'text-pink-400',
      ARP: 'text-orange-400',
    };
    return colors[protocol] || 'text-foreground';
  };

  return (
    <Card className="p-8 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg">
          <Network className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Network Packet Analyzer</h2>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4 flex-wrap">
          <Button
            onClick={startCapture}
            disabled={isCapturing}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Play className="w-4 h-4 mr-2" />
            {isCapturing ? 'Capturing...' : 'Start Capture'}
          </Button>
          <Button
            onClick={clearPackets}
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by protocol, IP, or info..."
            className="flex-1 min-w-[200px] bg-background border-border focus:border-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-2 text-muted-foreground font-medium">No.</th>
                <th className="p-2 text-muted-foreground font-medium">Time</th>
                <th className="p-2 text-muted-foreground font-medium">Protocol</th>
                <th className="p-2 text-muted-foreground font-medium">Source</th>
                <th className="p-2 text-muted-foreground font-medium">Destination</th>
                <th className="p-2 text-muted-foreground font-medium">Length</th>
                <th className="p-2 text-muted-foreground font-medium">Info</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    {isCapturing ? 'Capturing packets...' : 'No packets captured. Click "Start Capture" to begin.'}
                  </td>
                </tr>
              ) : (
                filteredPackets.map((packet) => (
                  <tr key={packet.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-2 font-mono text-muted-foreground">{packet.id}</td>
                    <td className="p-2 font-mono text-muted-foreground">{packet.timestamp}</td>
                    <td className={`p-2 font-semibold ${getProtocolColor(packet.protocol)}`}>
                      {packet.protocol}
                    </td>
                    <td className="p-2 font-mono">{packet.source}</td>
                    <td className="p-2 font-mono">{packet.destination}</td>
                    <td className="p-2 font-mono">{packet.length}</td>
                    <td className="p-2 text-muted-foreground">{packet.info}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">About Packet Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Network packet analysis involves capturing and examining data packets traveling
            through a network. This educational simulator demonstrates how tools like Wireshark
            display packet information including protocols, source/destination addresses, and payload data.
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Note: This is a simulation for educational purposes. No actual network traffic is captured.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default NetworkPacketAnalyzer;
