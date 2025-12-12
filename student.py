# Student Management System (Command Line Project)

students = []

def show_menu():
    print("""
--- Student Management Menu ---
1. Add Student
2. View Students
3. Update Student
4. Delete Student
5. Search Student
6. Exit
""")

def add_student():
    name = input("Enter student name: ")
    roll = input("Enter roll number: ")
    marks = input("Enter marks: ")
    student = {"name": name, "roll": roll, "marks": marks}
    students.append(student)
    print("Student added successfully!\n")

def view_students():
    if not students:
        print("No students registered.\n")
    else:
        print("List of Students:")
        for i, s in enumerate(students):
            print(f"{i+1}. Name: {s['name']}, Roll: {s['roll']}, Marks: {s['marks']}")

def update_student():
    view_students()
    idx = int(input("Enter student number to update: ")) - 1
    if 0 <= idx < len(students):
        name = input("Enter new name: ")
        roll = input("Enter new roll: ")
        marks = input("Enter new marks: ")
        students[idx] = {"name": name, "roll": roll, "marks": marks}
        print("Student record updated!\n")
    else:
        print("Invalid student number.\n")

def delete_student():
    view_students()
    idx = int(input("Enter student number to delete: ")) - 1
    if 0 <= idx < len(students):
        students.pop(idx)
        print("Student deleted successfully!\n")
    else:
        print("Invalid student number.\n")

def search_student():
    keyword = input("Enter name or roll to search: ")
    found = False
    for s in students:
        if keyword.lower() in s['name'].lower() or keyword == s['roll']:
            print(f"Found: Name: {s['name']}, Roll: {s['roll']}, Marks: {s['marks']}")
            found = True
    if not found:
        print("No matching student found.\n")

while True:
    show_menu()
    choice = input("Choose an option: ")
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
