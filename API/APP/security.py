import bcrypt

def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password=plain_password.encode('utf-8'), salt=salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password=plain_password.encode('utf-8'), hashed_password=hashed_password.encode('utf-8'))