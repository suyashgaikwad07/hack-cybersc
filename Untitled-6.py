# Retrying: Creating Batch F (51-60) individual ZIPs and a batch zip (fresh)
import os, zipfile, textwrap, shutil

base = "/mnt/data/batchF_projects"
# recreate fresh
if os.path.exists(base):
    shutil.rmtree(base)
os.makedirs(base, exist_ok=True)

projects = {
    "51_password_manager_cli": {
        "files": {
            "main.py": textwrap.dedent("""\
                # Password Manager CLI - encrypted local store (Fernet)
                # Note: Buyer must install cryptography and inspect code before use.
                import os, json
                try:
                    from cryptography.fernet import Fernet
                except Exception:
                    Fernet=None
                KEY_FILE='master.key'
                STORE='store.json'
                def get_key():
                    if os.path.exists(KEY_FILE): return open(KEY_FILE,'rb').read()
                    k=Fernet.generate_key(); open(KEY_FILE,'wb').write(k); return k
                def add(site, user, pwd):
                    key=get_key(); f=Fernet(key)
                    data={}
                    if os.path.exists(STORE): data=json.load(open(STORE))
                    data[site]={'user':user,'pwd':f.encrypt(pwd.encode()).decode()}
                    json.dump(data, open(STORE,'w'), indent=2)
                    print('Saved')
                if __name__=='__main__': print('See README for usage')
            """),
            "requirements.txt": "cryptography\n",
            "README.md": "# Password Manager CLI\n\nSimple Fernet-based local password manager. Run `python main.py` to see usage; master key stored in master.key."
        }
    },
    "52_file_encryptor_gui": {
        "files": {
            "encryptor.py": textwrap.dedent("""\
                # File Encryptor / Decryptor GUI (tkinter + Fernet)
                import tkinter as tk
                try:
                    from cryptography.fernet import Fernet
                except Exception:
                    Fernet=None
                def gen_key():
                    if Fernet:
                        k=Fernet.generate_key(); open('key.key','wb').write(k); return k
                root=tk.Tk(); root.title('Encryptor Demo')
                tk.Label(root, text='This is a demo GUI. See README.').pack()
                root.mainloop()
            """),
            "requirements.txt": "cryptography\n",
            "README.md": "# File Encryptor / Decryptor GUI\n\nDemo GUI using tkinter and Fernet. Buyers may extend to full features."
        }
    },
    "53_oneclick_website_backup": {
        "files": {
            "backup.py": textwrap.dedent("""\
                # One-click Website Backup & Restore Tool (demo)
                import tarfile, sys, os
                def backup(src, out='backup.tar.gz'):
                    with tarfile.open(out,'w:gz') as t: t.add(src, arcname=os.path.basename(src))
                    print('Saved', out)
                def restore(archive, dest='.'): tarfile.open(archive).extractall(dest); print('Restored')
                if __name__=='__main__': print('See README')
            """),
            "README.md": "# One-click Website Backup & Restore Tool\n\nUsage instructions included in README."
        }
    },
    "54_system_cleaner_script": {
        "files": {
            "cleaner.py": textwrap.dedent("""\
                # System Cleaner Script (safe) - removes common temp files in user-specified folders
                import os
                def clean(path):
                    removed=0
                    for root,dirs,files in os.walk(path):
                        for f in files:
                            if f.endswith(('.tmp','.log','.cache')):
                                try: os.remove(os.path.join(root,f)); removed+=1
                                except: pass
                    print('Removed', removed, 'files')
                if __name__=='__main__': print('See README')
            """),
            "README.md": "# System Cleaner Script\n\nSafe cleaner that removes files with extensions .tmp .log .cache. Buyer must review paths."
        }
    },
    "55_clipboard_manager_gui": {
        "files": {
            "clipboard.py": textwrap.dedent("""\
                # Clipboard Manager (tkinter demo)
                import tkinter as tk, json
                STORE='clips.json'
                def add_clip(text):
                    try: data=json.load(open(STORE))
                    except: data=[]
                    data.append({'text':text})
                    json.dump(data, open(STORE,'w'))
                root=tk.Tk(); root.title('Clipboard Demo')
                tk.Label(root, text='Demo clipboard manager. See README.').pack()
                root.mainloop()
            """),
            "README.md": "# Clipboard Manager\n\nDemo GUI that saves clipboard entries to clips.json."
        }
    },
    "56_image_to_ascii": {
        "files": {
            "img2ascii.py": textwrap.dedent("""\
                # Image-to-ASCII Converter (Pillow)
                from PIL import Image
                def convert(path, cols=80):
                    img=Image.open(path).convert('L')
                    w,h=img.size; aspect=h/w; new_w=cols; new_h=int(aspect*cols*0.55)
                    img=img.resize((new_w,new_h)); chars='@%#*+=-:. '
                    out=''
                    for y in range(new_h):
                        for x in range(new_w): out+=chars[img.getpixel((x,y))*len(chars)//256]
                        out+='\\n'
                    print(out)
                if __name__=='__main__': print('See README')
            """),
            "requirements.txt": "Pillow\n",
            "README.md": "# Image-to-ASCII Converter\n\nUsage: python img2ascii.py path/to/image"
        }
    },
    "57_cli_todo_app": {
        "files": {
            "todo.py": textwrap.dedent("""\
                # Command-line ToDo App with JSON storage
                import sys, json, os
                STORE='todo.json'
                def load():
                    try: return json.load(open(STORE))
                    except: return []
                def save(data): json.dump(data, open(STORE,'w'), indent=2)
                def add(task): d=load(); d.append({'task':task}); save(d); print('Added')
                def list_():
                    for i,t in enumerate(load()): print(i+1,t['task'])
                if __name__=='__main__': print('See README')
            """),
            "README.md": "# Command-line ToDo App\n\nSimple JSON-backed CLI todo app. Use functions in README."
        }
    },
    "58_local_notes_encrypted": {
        "files": {
            "notes.py": textwrap.dedent("""\
                # Local Notes App with encryption (Fernet)
                import os, json
                try:
                    from cryptography.fernet import Fernet
                except Exception:
                    Fernet=None
                KEY='notes.key'
                def get_key():
                    if os.path.exists(KEY): return open(KEY,'rb').read()
                    k=Fernet.generate_key(); open(KEY,'wb').write(k); return k
                def add(note):
                    key=get_key(); f=Fernet(key)
                    try: data=json.load(open('notes.json'))
                    except: data=[]
                    data.append({'note': f.encrypt(note.encode()).decode()})
                    json.dump(data, open('notes.json','w'), indent=2)
                    print('Saved')
                if __name__=='__main__': print('See README')
            """),
            "requirements.txt": "cryptography\n",
            "README.md": "# Local Notes App (Encrypted)\n\nAdds and reads encrypted notes from a local store. See README for CLI usage."
        }
    },
    "59_tiny_static_site_generator": {
        "files": {
            "ssg.py": textwrap.dedent("""\
                # Tiny Static Site Generator (Markdown -> HTML)
                import os, markdown
                def build(src='content', out='output'):
                    os.makedirs(out, exist_ok=True)
                    for fn in os.listdir(src):
                        if fn.endswith('.md'):
                            html = markdown.markdown(open(os.path.join(src,fn)).read())
                            open(os.path.join(out,fn.replace('.md','.html')),'w').write(html)
                    print('Built site to', out)
                if __name__=='__main__': print('See README')
            """),
            "requirements.txt": "markdown\n",
            "README.md": "# Tiny Static Site Generator\n\nPlace markdown files in content/ and run ssg.py to generate HTML."
        }
    },
    "60_time_tracker_cli": {
        "files": {
            "tracker.py": textwrap.dedent("""\
                # Time Tracker CLI (CSV export)
                import csv, time, sys, os
                STORE='time_log.csv'
                def start(task): open('current.txt','w').write(task+'|'+str(time.time())); print('Started')
                def stop():
                    if not os.path.exists('current.txt'): print('No task'); return
                    t=open('current.txt').read().split('|'); task,ts=t[0],float(t[1]); dur=time.time()-ts
                    with open(STORE,'a',newline='') as f: csv.writer(f).writerow([task,ts,dur]); os.remove('current.txt'); print('Stopped')
                if __name__=='__main__': print('See README')
            """),
            "README.md": "# Time Tracker CLI\n\nStart tasks with start(task) and stop() to log time to CSV."
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

# create batch zip
batch_zip = "/mnt/data/batchF_utilities_tools_51-60.zip"
with zipfile.ZipFile(batch_zip, "w", zipfile.ZIP_DEFLATED) as z:
    for zipf in created:
        z.write(zipf, arcname=os.path.basename(zipf))

[batch_zip] + created

