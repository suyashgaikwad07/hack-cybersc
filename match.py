# Simple Quiz Game

questions = [
    {
        "question": "What is the capital of India?",
        "options": ["Mumbai", "Kolkata", "Delhi", "Chennai"],
        "answer": "Delhi"
    },
    {
        "question": "Which language is used for web development?",
        "options": ["Python", "HTML", "C++", "Java"],
        "answer": "HTML"
    },
    {
        "question": "Who invented Python?",
        "options": ["Guido van Rossum", "Bill Gates", "Elon Musk", "Mark Zuckerberg"],
        "answer": "Guido van Rossum"
    }
]

score = 0

for q in questions:
    print("\n" + q["question"])
    for i, option in enumerate(q["options"], 1):
        print(f"{i}. {option}")
    choice = input("Enter the option number: ")
    if choice.isdigit() and 1 <= int(choice) <= len(q["options"]):
        selected = q["options"][int(choice) - 1]
        if selected == q["answer"]:
            print("Correct!")
            score += 1
        else:
            print(f"Wrong! The correct answer is: {q['answer']}")
    else:
        print("Invalid option.")

print(f"\nYour final score: {score} out of {len(questions)}")
