import random
import string

def generate_password(length=12):
    if length < 6:
        print("Password length should be at least 6 characters.")
        return

    all_chars = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(all_chars) for _ in range(length))
    return password

def main():
    print("Welcome to Password Generator!")
    length_str = input("Enter desired password length (minimum 6): ")
    if length_str.isdigit():
        length = int(length_str)
        pwd = generate_password(length)
        if pwd:
            print(f"Generated Password: {pwd}")
    else:
        print("Please enter a valid number.")

if __name__ == "__main__":
    main()
