def caesar_cipher(text, shift, mode='encrypt'):
    result = ""
    shift = shift % 26  # Normalize shift

    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            if mode == 'encrypt':
                # Shift letter
                result += chr((ord(char) - base + shift) % 26 + base)
            elif mode == 'decrypt':
                # Reverse shift
                result += chr((ord(char) - base - shift) % 26 + base)
        else:
            # Non-alphabet characters remain unchanged
            result += char
    return result

if __name__ == "__main__":
    text = input("Enter text: ")
    shift = int(input("Enter shift (key): "))
    choice = input("Encrypt or Decrypt? (e/d): ").lower()

    if choice == 'e':
        print("Encrypted text:", caesar_cipher(text, shift, 'encrypt'))
    elif choice == 'd':
        print("Decrypted text:", caesar_cipher(text, shift, 'decrypt'))
    else:
        print("Invalid choice. Please enter 'e' or 'd'.")
