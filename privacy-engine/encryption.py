import hashlib
import secrets
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

class EncryptionManager:
    def __init__(self, password: str = None):
        """Initialize encryption manager with optional password."""
        if password:
            self.key = self._derive_key_from_password(password)
        else:
            self.key = Fernet.generate_key()
        self.cipher = Fernet(self.key)
    
    def _derive_key_from_password(self, password: str) -> bytes:
        """Derive encryption key from password using PBKDF2."""
        salt = b'canara_bank_salt'  # In production, use random salt
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        return key
    
    def encrypt(self, data: str) -> str:
        """Encrypt string data and return base64 encoded result."""
        encrypted_data = self.cipher.encrypt(data.encode())
        return base64.urlsafe_b64encode(encrypted_data).decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt base64 encoded data and return original string."""
        try:
            decoded_data = base64.urlsafe_b64decode(encrypted_data.encode())
            decrypted_data = self.cipher.decrypt(decoded_data)
            return decrypted_data.decode()
        except Exception as e:
            raise ValueError(f"Decryption failed: {str(e)}")
    
    def hash_data(self, data: str) -> str:
        """Create SHA-256 hash of data."""
        return hashlib.sha256(data.encode()).hexdigest()
    
    def get_key(self) -> str:
        """Get the encryption key as base64 string."""
        return base64.urlsafe_b64encode(self.key).decode()
    
    @staticmethod
    def generate_secure_token(length: int = 32) -> str:
        """Generate a secure random token."""
        return secrets.token_urlsafe(length)

# Utility functions
def encrypt_sensitive_data(data: str, password: str = None) -> tuple:
    """Encrypt sensitive data and return encrypted data with key."""
    encryptor = EncryptionManager(password)
    encrypted = encryptor.encrypt(data)
    return encrypted, encryptor.get_key()

def decrypt_sensitive_data(encrypted_data: str, key: str) -> str:
    """Decrypt data using provided key."""
    key_bytes = base64.urlsafe_b64decode(key.encode())
    cipher = Fernet(key_bytes)
    decoded_data = base64.urlsafe_b64decode(encrypted_data.encode())
    decrypted = cipher.decrypt(decoded_data)
    return decrypted.decode()