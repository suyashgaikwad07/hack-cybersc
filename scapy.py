from scapy.all import sniff
from scapy.layers.inet import IP

def packet_callback(packet):
    if IP in packet:
        ip_layer = packet[IP]
        print(f"Protocol: {ip_layer.proto}, Source IP: {ip_layer.src}, Destination IP: {ip_layer.dst}")

def main():
    print("Starting packet sniffer...")
    sniff(prn=packet_callback, filter="ip", store=0)

if __name__ == "__main__":
    main()
