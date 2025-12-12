import hashlib
import os

def hash_password(password):
    # Generate a random salt
    salt = os.urandom(16)
    # Compute the hash using SHA-256 with salt
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    # Return salt and hash combined for storage
    return salt + pwd_hash

def verify_password(stored_password, input_password):
    salt = stored_password[:16]
    stored_hash = stored_password[16:]
    # Hash the input password with the same salt
    input_hash = hashlib.pbkdf2_hmac('sha256', input_password.encode(), salt, 100000)
    return input_hash == stored_hash

def main():
    print("Secure Password Hashing Demo")

    password = input("Enter a password to hash securely: ")
    stored = hash_password(password)
    print(f"Stored (salt + hash): {stored.hex()}")

    attempt = input("Re-enter password to verify: ")
    if verify_password(stored, attempt):
        print("Password verified successfully!")
    else:
        print("Verification failed. Incorrect password.")

if __name__ == "__main__":
    main()
