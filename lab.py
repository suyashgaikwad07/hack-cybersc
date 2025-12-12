import socket

def scan_ports(target, start_port=1, end_port=1024):
    print(f"Scanning {target} from port {start_port} to {end_port}...\n")
    open_ports = []
    for port in range(start_port, end_port + 1):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)
        try:
            result = sock.connect_ex((target, port))
            if result == 0:
                open_ports.append(port)
                print(f"Port {port}: OPEN")
            sock.close()
        except Exception as e:
            print(f"Error scanning port {port}: {e}")
            sock.close()
    if not open_ports:
        print("No open ports found.")
    else:
        print(f"\nOpen ports on {target}: {open_ports}")

if __name__ == "__main__":
    target_ip_or_domain = input("Enter target IP or domain: ")
    scan_ports(target_ip_or_domain)
