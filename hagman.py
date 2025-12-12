import random

def hangman():
    words = ['suyash','yashraj''shreya','ajinkya','vidhi','priya','aryaki']
    word = random.choice(words)
    guessed = ['_'] * len(word)
    attempts = 2
    guessed_letters = set()

    print("Welcome to Hangman!")
    print("Try to guess the word letter by letter.")

    while attempts > 0 and '_' in guessed:
        print("\nWord: " + ' '.join(guessed))
        print(f"Attempts left: {attempts}")
        guess = input("Guess a letter: ").lower()

        if len(guess) != 1 or not guess.isalpha():
            print("Please enter a single alphabetic letter.")
            continue

        if guess in guessed_letters:
            print("You already guessed that letter.")
            continue

        guessed_letters.add(guess)

        if guess in word:
            for idx, letter in enumerate(word):
                if letter == guess:
                    guessed[idx] = guess
            print("Good guess!")
        else:
            attempts -= 1
            print(f"Wrong guess! '{guess}' is not in the word.")

    if '_' not in guessed:
        print(f"\nCongratulations! You guessed the word: {word}")
    else:
        print(f"\nGame over! The word was: {word}")

if __name__ == "__main__":
    hangman()
