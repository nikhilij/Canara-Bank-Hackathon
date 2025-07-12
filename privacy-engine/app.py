from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import logging
from datetime import datetime
import hashlib
import re

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['DEBUG'] = os.environ.get('DEBUG', 'False').lower() == 'true'

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PrivacyEngine:
    """Privacy engine for data anonymization and masking"""
    
    @staticmethod
    def mask_email(email):
        """Mask email address"""
        if not email or '@' not in email:
            return email
        local, domain = email.split('@', 1)
        if len(local) <= 2:
            return email
        return f"{local[0]}{'*' * (len(local) - 2)}{local[-1]}@{domain}"
    
    @staticmethod
    def mask_phone(phone):
        """Mask phone number"""
        if not phone:
            return phone
        phone = re.sub(r'\D', '', phone)
        if len(phone) < 4:
            return phone
        return f"{'*' * (len(phone) - 4)}{phone[-4:]}"
    
    @staticmethod
    def mask_pan(pan):
        """Mask PAN number"""
        if not pan or len(pan) < 4:
            return pan
        return f"{'*' * (len(pan) - 4)}{pan[-4:]}"
    
    @staticmethod
    def hash_data(data):
        """Hash sensitive data"""
        if not data:
            return data
        return hashlib.sha256(str(data).encode()).hexdigest()[:10]
    
    @staticmethod
    def anonymize_record(record, fields_to_mask=None, fields_to_hash=None):
        """Anonymize a single record"""
        if not fields_to_mask:
            fields_to_mask = ['email', 'phone', 'pan']
        if not fields_to_hash:
            fields_to_hash = ['ssn', 'account_number']
        
        result = record.copy()
        
        for field in fields_to_mask:
            if field in result:
                if field == 'email':
                    result[field] = PrivacyEngine.mask_email(result[field])
                elif field == 'phone':
                    result[field] = PrivacyEngine.mask_phone(result[field])
                elif field == 'pan':
                    result[field] = PrivacyEngine.mask_pan(result[field])
        
        for field in fields_to_hash:
            if field in result:
                result[field] = PrivacyEngine.hash_data(result[field])
        
        return result

# Initialize privacy engine
privacy_engine = PrivacyEngine()

@app.route('/')
def index():
    """Home page"""
    return jsonify({
        'message': 'Privacy Engine API',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/mask', methods=['POST'])
def mask_data():
    """Mask sensitive data"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Get configuration
        fields_to_mask = data.get('fields_to_mask', ['email', 'phone', 'pan'])
        fields_to_hash = data.get('fields_to_hash', ['ssn', 'account_number'])
        records = data.get('records', [])
        
        if not records:
            return jsonify({'error': 'No records provided'}), 400
        
        # Process records
        masked_records = []
        for record in records:
            masked_record = privacy_engine.anonymize_record(
                record, fields_to_mask, fields_to_hash
            )
            masked_records.append(masked_record)
        
        return jsonify({
            'success': True,
            'masked_records': masked_records,
            'total_records': len(masked_records),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error masking data: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/anonymize', methods=['POST'])
def anonymize_data():
    """Anonymize sensitive data (alias for mask endpoint)"""
    return mask_data()

@app.route('/validate', methods=['POST'])
def validate_data():
    """Validate data privacy compliance"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        records = data.get('records', [])
        sensitive_fields = data.get('sensitive_fields', ['email', 'phone', 'pan', 'ssn'])
        
        violations = []
        
        for i, record in enumerate(records):
            record_violations = []
            for field in sensitive_fields:
                if field in record:
                    value = record[field]
                    if field == 'email' and '@' in str(value) and '*' not in str(value):
                        record_violations.append(f"Unmasked email: {field}")
                    elif field == 'phone' and str(value).isdigit() and len(str(value)) > 4:
                        record_violations.append(f"Unmasked phone: {field}")
                    elif field in ['pan', 'ssn'] and len(str(value)) > 10:
                        record_violations.append(f"Unmasked {field}: {field}")
            
            if record_violations:
                violations.append({
                    'record_index': i,
                    'violations': record_violations
                })
        
        return jsonify({
            'compliant': len(violations) == 0,
            'violations': violations,
            'total_records': len(records),
            'total_violations': len(violations),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error validating data: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Method not allowed'}), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])