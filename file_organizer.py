import os
import shutil

# Define source directory (change to your desired folder)
source_dir = "C:/Users/YourUsername/Downloads"

# Define folder names by file types
folders = {
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
    "Documents": [".pdf", ".docx", ".txt", ".xlsx"],
    "Videos": [".mp4", ".mov", ".avi"],
    "Music": [".mp3", ".wav"],
    "Archives": [".zip", ".rar", ".tar.gz"]
}

def organize_files():
    for filename in os.listdir(source_dir):
        filepath = os.path.join(source_dir, filename)
        if os.path.isfile(filepath):
            ext = os.path.splitext(filename)[1].lower()
            moved = False
            for folder, extensions in folders.items():
                if ext in extensions:
                    folder_path = os.path.join(source_dir, folder)
                    if not os.path.exists(folder_path):
                        os.makedirs(folder_path)
                    shutil.move(filepath, os.path.join(folder_path, filename))
                    print(f"Moved {filename} to {folder}")
                    moved = True
                    break
            if not moved:
                print(f"No folder for file type: {filename}")

if __name__ == "__main__":
    organize_files()
