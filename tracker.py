# Personal Expense Tracker

import os

expenses = []

def show_menu():
    print("""
--- Expense Tracker Menu ---
1. Add Expense
2. View Expenses
3. Update Expense
4. Delete Expense
5. Search Expense
6. Save Expenses to File
7. Load Expenses from File
8. Exit
""")

def add_expense():
    date = input("Enter date (YYYY-MM-DD): ")
    amount = input("Enter amount: ")
    category = input("Enter category: ")
    remark = input("Enter remark: ")
    expense = {"date": date, "amount": amount, "category": category, "remark": remark}
    expenses.append(expense)
    print("Expense added!\n")

def view_expenses():
    if not expenses:
        print("No expenses recorded.\n")
    else:
        print("Expenses:")
        for i, exp in enumerate(expenses):
            print(f"{i+1}. Date: {exp['date']}, Amount: {exp['amount']}, Category: {exp['category']}, Remark: {exp['remark']}")

def update_expense():
    view_expenses()
    idx = int(input("Enter expense number to update: ")) - 1
    if 0 <= idx < len(expenses):
        date = input("Enter new date: ")
        amount = input("Enter new amount: ")
        category = input("Enter new category: ")
        remark = input("Enter new remark: ")
        expenses[idx] = {"date": date, "amount": amount, "category": category, "remark": remark}
        print("Expense updated!\n")
    else:
        print("Invalid expense number.\n")

def delete_expense():
    view_expenses()
    idx = int(input("Enter expense number to delete: ")) - 1
    if 0 <= idx < len(expenses):
        expenses.pop(idx)
        print("Expense deleted!\n")
    else:
        print("Invalid expense number.\n")

def search_expense():
    keyword = input("Enter category or date to search: ")
    found = False
    for exp in expenses:
        if keyword.lower() in exp['category'].lower() or keyword == exp['date']:
            print(f"Found: Date: {exp['date']}, Amount: {exp['amount']}, Category: {exp['category']}, Remark: {exp['remark']}")
            found = True
    if not found:
        print("No matching expense found.\n")

def save_to_file():
    filename = input("Enter filename to save (e.g., expenses.txt): ")
    with open(filename, "w") as f:
        for exp in expenses:
            line = "|".join([exp["date"], exp["amount"], exp["category"], exp["remark"]])
            f.write(line + "\n")
    print("Expenses saved to file!\n")

def load_from_file():
    filename = input("Enter filename to load (e.g., expenses.txt): ")
    if not os.path.exists(filename):
        print("File not found.\n")
        return
    with open(filename) as f:
        expenses.clear()
        for line in f:
            parts = line.strip().split("|")
            if len(parts) == 4:
                expenses.append({"date": parts[0], "amount": parts[1], "category": parts[2], "remark": parts[3]})
    print("Expenses loaded from file!\n")

while True:
    show_menu()
    choice = input("Choose an option: ")
    if choice == "1":
        add_expense()
    elif choice == "2":
        view_expenses()
    elif choice == "3":
        update_expense()
    elif choice == "4":
        delete_expense()
    elif choice == "5":
        search_expense()
    elif choice == "6":
        save_to_file()
    elif choice == "7":
        load_from_file()
    elif choice == "8":
        print("Exiting program. Goodbye!")
        break
    else:
        print("Invalid choice. Please try again.\n")
