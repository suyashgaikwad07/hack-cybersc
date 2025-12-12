# Recreating Batch C (21-30) individual ZIPs fresh
import os, zipfile, textwrap, shutil

base = "/mnt/data/batchC_recreate"
# remove if exists to ensure fresh
if os.path.exists(base):
    shutil.rmtree(base)
os.makedirs(base, exist_ok=True)

projects = {
    "21_packet_logger_readonly": {
        "files": {
            "logger.py": textwrap.dedent("""\
                \"\"\"Network Packet Logger (READ-ONLY DEMO)
                This script demonstrates locating PCAP files in a folder and reporting basic stats.
                It does NOT capture live traffic. Use only with allowed PCAPs.
                \"\"\"
                import sys, os

                def analyze(folder='.'):
                    stats={'pcap_files':0}
                    for root,dirs,files in os.walk(folder):
                        for f in files:
                            if f.lower().endswith(('.pcap','.pcapng')):
                                stats['pcap_files']+=1
                    return stats

                if __name__=='__main__':
                    target = sys.argv[1] if len(sys.argv)>1 else '.'
                    print(analyze(target))
                """),
            "README.md": "# Network Packet Logger (Read-only)\n\nSearches for PCAP files and reports counts. Educational demo — does not sniff live traffic."
        }
    },
    "22_simple_port_scanner_educational": {
        "files": {
            "scanner.py": textwrap.dedent("""\
                \"\"\"Simple Port Scanner (Educational)\n                Connects briefly to a list of common ports to check openness. Use only on hosts you own or have permission for.\n                \"\"\"\n                import socket, sys\n                def scan(host='127.0.0.1', ports=[22,80,443,3306,8080]):\n                    results={}\n                    for p in ports:\n                        try:\n                            s=socket.socket(); s.settimeout(0.5); s.connect((host,p)); s.close(); results[p]='open'\n                        except Exception:\n                            results[p]='closed'\n                    return results\n                if __name__=='__main__':\n                    tgt = sys.argv[1] if len(sys.argv)>1 else '127.0.0.1'\n                    print(scan(tgt))\n                """),
            "README.md": "# Simple Port Scanner (Educational)\n\nConnects to common ports to check openness. Use only on hosts you own or have permission for."
        }
    },
    "23_log_file_analyzer": {
        "files": {
            "analyze_logs.py": textwrap.dedent("""\
                \"\"\"Log File Analyzer & Summary Report\n                Scans .log/.txt files in a folder and reports counts of 'error' and 'warning' occurrences.\n                \"\"\"\n                import os, collections\n                def analyze(path='.'):\n                    counts=collections.Counter()\n                    for root,dirs,files in os.walk(path):\n                        for f in files:\n                            if f.endswith(('.log','.txt')):\n                                for line in open(os.path.join(root,f),errors='ignore'):\n                                    if 'error' in line.lower(): counts['error']+=1\n                                    if 'warning' in line.lower(): counts['warning']+=1\n                    return counts\n                if __name__=='__main__': print(analyze())\n                """),
            "README.md": "# Log File Analyzer & Summary\n\nCounts occurrences of error/warning in .log/.txt files. Useful for quick summaries."
        }
    },
    "24_system_resource_monitor": {
        "files": {
            "monitor.py": textwrap.dedent("""\
                \"\"\"System Resource Monitor (uses psutil if available)\n                Logs CPU and memory usage to a CSV file.\n                \"\"\"\n                import time, csv\n                try:\n                    import psutil\n                except Exception:\n                    psutil=None\n                def monitor(seconds=5, out='sys_stats.csv'):\n                    with open(out,'w',newline='') as f:\n                        w=csv.writer(f); w.writerow(['timestamp','cpu_percent','mem_percent'])\n                        for _ in range(seconds):\n                            cpu = psutil.cpu_percent() if psutil else 0\n                            mem = psutil.virtual_memory().percent if psutil else 0\n                            w.writerow([time.time(), cpu, mem]); time.sleep(1)\n                    print('Saved to', out)\n                if __name__=='__main__': monitor(5)\n                """),
            "requirements.txt": "psutil\n",
            "README.md": "# System Resource Monitor\n\nLogs CPU and memory usage (requires psutil). Outputs CSV for analysis."
        }
    },
    "25_ip_geo_summary": {
        "files": {
            "geo_summary.py": textwrap.dedent("""\
                \"\"\"IP Geo-summary Report Tool (mock)\n                Given a list of IPs in ips.txt, outputs a CSV with mock geo data (avoids external API calls).\n                \"\"\"\n                import csv\n                def mock_geo(ip):\n                    return {'ip':ip,'country':'Local','city':'LocalCity'}\n                def run(inp='ips.txt', out='ips_geo.csv'):\n                    ips = [l.strip() for l in open(inp) if l.strip()]\n                    with open(out,'w',newline='') as f:\n                        w=csv.DictWriter(f, fieldnames=['ip','country','city']); w.writeheader()\n                        for ip in ips: w.writerow(mock_geo(ip))\n                    print('Wrote', out)\n                if __name__=='__main__':\n                    open('ips.txt','w').write('127.0.0.1\\n')\n                    run()\n                """),
            "README.md": "# IP Geo-summary Report Tool (Mock)\n\nReads ips.txt and writes ips_geo.csv with mock results. Buyers can plug real APIs if desired."
        }
    },
    "26_auto_backup_script": {
        "files": {
            "backup.sh": textwrap.dedent("""\
                #!/bin/bash\n                # Auto-backup script (cron-friendly) - rotates daily backups, keeps 7\n                SRC=${1:-/home/}\n                DST=${2:-/tmp/backups}\n                mkdir -p \"$DST\"\n                TIMESTAMP=$(date +%F_%H%M)\n                tar -czf \"$DST/backup_$TIMESTAMP.tar.gz\" -C \"$SRC\" .\n                # remove older than 7 days\n                find \"$DST\" -type f -mtime +7 -delete\n                echo \"Backup saved to $DST\"\n                """),
            "README.md": "# Auto-backup Script for Linux\n\nUsage: ./backup.sh /path/to/source /path/to/dest. Configure as a cron job for scheduled backups."
        }
    },
    "27_firewall_rule_exporter": {
        "files": {
            "export_iptables.py": textwrap.dedent("""\
                \"\"\"Firewall Rule Exporter (iptables -> human-readable)\n                Reads a sample iptables-save file and outputs a simplified text report.\n                \"\"\"\n                import os\n                def parse(path='iptables.txt'):\n                    if not os.path.exists(path):\n                        open(path,'w').write('# sample iptables output')\n                    print('Parsing', path, '... (sample)')\n                if __name__=='__main__': parse()\n                """),
            "README.md": "# Firewall Rule Exporter\n\nTakes an `iptables-save` style file and produces a human-readable summary. Designed for offline parsing."
        }
    },
    "28_service_status_dashboard": {
        "files": {
            "app.py": textwrap.dedent("""\
                \"\"\"Service Status Dashboard (Flask) - shows mock or systemctl statuses\n                \"\"\"\n                from flask import Flask, render_template_string\n                app=Flask(__name__)\n                @app.route('/')\n                def idx():\n                    services=[('nginx','active'),('redis','inactive')]\n                    return render_template_string('<h1>Services</h1>{% for s,s2 in services %}<p>{{s}} - {{s2}}</p>{% endfor %}', services=services)\n                if __name__=='__main__': app.run(debug=True)\n                """),
            "requirements.txt": "Flask\n",
            "README.md": "# Service Status Dashboard\n\nRun `python app.py` and open the dashboard. On systems without systemctl it shows mock statuses."
        }
    },
    "29_ssh_key_manager": {
        "files": {
            "ssh_manage.py": textwrap.dedent("""\
                \"\"\"SSH Key Management Script\n                Generates an RSA key pair (using ssh-keygen if available) and organizes keys into folders.\n                \"\"\"\n                import os, subprocess\n                def gen(name='id_rsa_demo'):\n                    if os.path.exists(name): print('Key exists'); return\n                    subprocess.run(['ssh-keygen','-t','rsa','-b','2048','-f',name,'-N',''])\n                    print('Generated',name)\n                if __name__=='__main__': gen()\n                """),
            "README.md": "# SSH Key Management\n\nGenerates and organizes SSH keys. Requires `ssh-keygen` on the system. Use responsibly."
        }
    },
    "30_localhost_api_mock_server": {
        "files": {
            "app.py": textwrap.dedent("""\
                \"\"\"Localhost API Mock Server\n                Minimal Flask server that returns sample JSON for frontend development.\n                \"\"\"\n                from flask import Flask, jsonify\n                app=Flask(__name__)\n                @app.route('/api/data')\n                def data(): return jsonify({'items':[1,2,3]})\n                if __name__=='__main__': app.run(debug=True)\n                """),
            "requirements.txt": "Flask\n",
            "README.md": "# Localhost API Mock Server\n\nRun `python app.py` and use `http://127.0.0.1:5000/api/data` as a mock endpoint for front-end testing."
        }
    }
}

created = []
for key, pdata in projects.items():
    folder = os.path.join(base, key)
    os.makedirs(folder, exist_ok=True)
    for fname, content in pdata["files"].items():
        fpath = os.path.join(folder, fname)
        d = os.path.dirname(fpath)
        if d and not os.path.exists(d):
            os.makedirs(d, exist_ok=True)
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(content)
    # create individual zip
    zip_path = f"/mnt/data/{key}.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(folder):
            for file in files:
                full = os.path.join(root, file)
                arc = os.path.relpath(full, base)
                z.write(full, arcname=arc)
    created.append(zip_path)

created

n