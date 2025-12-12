import random

def rock_paper_scissors():
    options = ['rock', 'paper', 'scissors']
    
    print("Welcome to Rock, Paper, Scissors!")
    print("Enter 'quit' to stop playing.")

    while True:
        user_choice = input("Choose rock, paper, or scissors: ").lower()
        if user_choice == 'quit':
            print("Thanks for playing! Goodbye.")
            break
        
        if user_choice not in options:
            print("Invalid choice. Try again.")
            continue
        
        computer_choice = random.choice(options)
        print(f"Computer chose: {computer_choice}")

        if user_choice == computer_choice:
            print("It's a tie!\n")
        elif (user_choice == 'rock' and computer_choice == 'scissors') or \
             (user_choice == 'paper' and computer_choice == 'rock') or \
             (user_choice == 'scissors' and computer_choice == 'paper'):
            print("You win!\n")
        else:
            print("You lose!\n")

if __name__ == "__main__":
    rock_paper_scissors()
