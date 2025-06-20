import hashlib
import hmac
import base64
import json
import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
SECRET_KEY = os.getenv("TOKENIZATION_SECRET_KEY", "change-this-in-production")

class TokenizationService:
    """
    Tokenization service for sensitive data
    Uses HMAC-SHA256 for tokenization
    """
    
    def __init__(self, secret_key):
        self.secret_key = secret_key.encode('utf-8')
        
    def tokenize(self, data, context=None):
        """
        Tokenize sensitive data
        
        Args:
            data (str): The sensitive data to tokenize
            context (dict, optional): Additional context for the tokenization
            
        Returns:
            str: The tokenized value
        """
        if not data:
            return None
            
        # Prepare data for tokenization
        data_bytes = data.encode('utf-8')
        
        # Include context in tokenization if provided
        if context:
            context_str = json.dumps(context, sort_keys=True)
            data_bytes = data_bytes + context_str.encode('utf-8')
        
        # Create HMAC
        h = hmac.new(self.secret_key, data_bytes, hashlib.sha256)
        
        # Encode as URL-safe base64
        token = base64.urlsafe_b64encode(h.digest()).decode('utf-8')
        
        return token
        
    def detokenize(self, token, original_data, context=None):
        """
        Verify if a token matches the original data
        
        Args:
            token (str): The token to verify
            original_data (str): The original data that was tokenized
            context (dict, optional): The context used during tokenization
            
        Returns:
            bool: True if the token matches the original data, False otherwise
        """
        expected_token = self.tokenize(original_data, context)
        return hmac.compare_digest(token, expected_token)

# Initialize tokenization service
tokenizer = TokenizationService(SECRET_KEY)

@app.route('/tokenize', methods=['POST'])
def tokenize():
    data = request.json
    
    if not data or 'value' not in data:
        return jsonify({"error": "Missing required field 'value'"}), 400
        
    value = data['value']
    context = data.get('context')
    
    token = tokenizer.tokenize(value, context)
    
    return jsonify({
        "token": token,
        "type": data.get('type', 'default')
    })
    
@app.route('/verify', methods=['POST'])
def verify():
    data = request.json
    
    if not data or 'token' not in data or 'originalValue' not in data:
        return jsonify({"error": "Missing required fields"}), 400
        
    token = data['token']
    original_value = data['originalValue']
    context = data.get('context')
    
    is_valid = tokenizer.detokenize(token, original_value, context)
    
    return jsonify({"valid": is_valid})

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))
    app.run(host='0.0.0.0', port=port)
