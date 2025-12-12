// Simple Todo List App in Swift

var todoList: [String] = []

func showMenu() {
    print("""
    --- Todo List Menu ---
    1. Add Todo
    2. View Todos
    3. Delete Todo
    4. Exit
    """)
}

func addTodo() {
    print("Enter your todo item:")
    if let newTodo = readLine() {
        todoList.append(newTodo)
        print("Added: \(newTodo)")
    }
}

func viewTodos() {
    if todoList.isEmpty {
        print("Todo list is empty.")
    } else {
        print("Your Todos:")
        for (index, item) in todoList.enumerated() {
            print("\(index + 1). \(item)")
        }
    }
}

func deleteTodo() {
    viewTodos()
    if !todoList.isEmpty {
        print("Enter the number of the item to delete:")
        if let input = readLine(), let number = Int(input), number > 0, number <= todoList.count {
            let removed = todoList.remove(at: number - 1)
            print("Deleted: \(removed)")
        } else {
            print("Invalid selection.")
        }
    }
}

// Main Loop
while true {
    showMenu()
    print("Choose an option:")
    if let choice = readLine() {
        switch choice {
        case "1":
            addTodo()
        case "2":
            viewTodos()
        case "3":
            deleteTodo()
        case "4":
            print("Exiting. Goodbye!")
            break
        default:
            print("Invalid choice, please try again.")
        }
        if choice == "4" { break }
    }
}
