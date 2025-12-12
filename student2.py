import json
import os
from typing import List, Dict, Optional

DATA_FILE = "students.json"
students: List[Dict[str, str]] = []


def load_students() -> None:
    global students
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                students = json.load(f)
        except Exception:
            students = []


def save_students() -> None:
    try:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(students, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Warning: failed to save students: {e}")


def show_menu() -> None:
    print("""
--- Student Management Menu ---
1. Add Student
2. View Students
3. Update Student
4. Delete Student
5. Search Student
6. Exit
""")


def prompt_nonempty(prompt: str) -> Optional[str]:
    try:
        value = input(prompt).strip()
    except (EOFError, KeyboardInterrupt):
        return None
    return value if value != "" else None


def parse_marks(marks_str: str) -> str:
    # Try to store marks as int if possible, otherwise float, otherwise keep string
    try:
        iv = int(marks_str)
        return str(iv)
    except Exception:
        try:
            fv = float(marks_str)
            return str(fv)
        except Exception:
            return marks_str


def find_by_roll(roll: str) -> Optional[int]:
    for i, s in enumerate(students):
        if s.get("roll") == roll:
            return i
    return None


def add_student() -> None:
    name = prompt_nonempty("Enter student name: ")
    if name is None:
        print("Add cancelled.\n")
        return
    roll = prompt_nonempty("Enter roll number: ")
    if roll is None:
        print("Add cancelled.\n")
        return
    if find_by_roll(roll) is not None:
        print("A student with this roll number already exists. Use update if you want to change it.\n")
        return
    marks_in = prompt_nonempty("Enter marks: ")
    if marks_in is None:
        print("Add cancelled.\n")
        return
    marks = parse_marks(marks_in)
    student = {"name": name, "roll": roll, "marks": marks}
    students.append(student)
    save_students()
    print("Student added successfully!\n")


def view_students() -> None:
    if not students:
        print("No students registered.\n")
        return
    print("List of Students:")
    for i, s in enumerate(students, start=1):
        print(f"{i}. Name: {s['name']}, Roll: {s['roll']}, Marks: {s['marks']}")
    print("")


def _read_index(action: str) -> Optional[int]:
    view_students()
    if not students:
        return None
    raw = prompt_nonempty(f"Enter student number to {action}: ")
    if raw is None:
        print(f"{action.capitalize()} cancelled.\n")
        return None
    try:
        idx = int(raw) - 1
        if 0 <= idx < len(students):
            return idx
        else:
            print("Invalid student number.\n")
            return None
    except ValueError:
        print("Please enter a valid number.\n")
        return None


def update_student() -> None:
    idx = _read_index("update")
    if idx is None:
        return
    current = students[idx]
    print(f"Current: Name: {current['name']}, Roll: {current['roll']}, Marks: {current['marks']}")
    name = prompt_nonempty("Enter new name (leave blank to keep current): ")
    roll = prompt_nonempty("Enter new roll (leave blank to keep current): ")
    marks_in = prompt_nonempty("Enter new marks (leave blank to keep current): ")

    if name is not None:
        current["name"] = name
    if roll is not None:
        # check duplicate roll except for current record
        existing = find_by_roll(roll)
        if existing is not None and existing != idx:
            print("Another student already has that roll number. Update aborted.\n")
            return
        current["roll"] = roll
    if marks_in is not None:
        current["marks"] = parse_marks(marks_in)

    students[idx] = current
    save_students()
    print("Student record updated!\n")


def delete_student() -> None:
    idx = _read_index("delete")
    if idx is None:
        return
    student = students[idx]
    confirm = prompt_nonempty(f"Confirm delete {student['name']} (y/N): ")
    if confirm and confirm.lower().startswith("y"):
        students.pop(idx)
        save_students()
        print("Student deleted successfully!\n")
    else:
        print("Delete cancelled.\n")


def search_student() -> None:
    keyword = prompt_nonempty("Enter name or roll to search: ")
    if keyword is None:
        print("Search cancelled.\n")
        return
    keyword_lower = keyword.lower()
    found = False
    for s in students:
        if keyword_lower in s.get("name", "").lower() or keyword_lower in s.get("roll", "").lower():
            print(f"Found: Name: {s['name']}, Roll: {s['roll']}, Marks: {s['marks']}")
            found = True
    if not found:
        print("No matching student found.\n")
    else:
        print("")


def main_loop() -> None:
    load_students()
    try:
        while True:
            show_menu()
            choice = prompt_nonempty("Choose an option: ")
            if choice is None:
                print("\nExiting program. Goodbye!")
                break
            if choice == "1":
                add_student()
            elif choice == "2":
                view_students()
            elif choice == "3":
                update_student()
            elif choice == "4":
                delete_student()
            elif choice == "5":
                search_student()
            elif choice == "6":
                print("Exiting program. Goodbye!")
                break
            else:
                print("Invalid choice. Please try again.\n")
    except (KeyboardInterrupt, EOFError):
        print("\nExiting program. Goodbye!")
    finally:
        save_students()


if __name__ == "__main__":
    main_loop()