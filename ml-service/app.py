from flask import Flask, request, jsonify
import pickle
import numpy as np
from sklearn.preprocessing import StandardScaler
import pandas as pd
from functools import wraps
import os

app = Flask(__name__)

# Load the trained model (you'll need to train and save this first)
# model = pickle.load(open('model.pkl', 'rb'))
# scaler = pickle.load(open('scaler.pkl', 'rb'))

API_TOKEN = os.getenv('API_TOKEN', 'trustvault-ml-token')

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or token.replace('Bearer ', '') != API_TOKEN:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/')
def home():
    return "ML Service is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Convert to DataFrame or numpy array as needed
        features = np.array(data['features']).reshape(1, -1)
        
        # Scale features if scaler is available
        # features_scaled = scaler.transform(features)
        
        # Make prediction
        # prediction = model.predict(features_scaled)
        # probability = model.predict_proba(features_scaled)
        
        # Mock prediction for now
        prediction = [1]
        probability = [[0.3, 0.7]]
        
        return jsonify({
            'prediction': prediction[0],
            'probability': probability[0][1],
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

@app.route('/credit-score', methods=['POST'])
@require_auth
def credit_score():
    try:
        data = request.get_json()
        # features = np.array(data['features']).reshape(1, -1)
        # prediction = credit_model.predict(features)
        # For demo, return mock score
        return jsonify({
            'credit_score': 750,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 400

@app.route('/risk-analysis', methods=['POST'])
@require_auth
def risk_analysis():
    try:
        data = request.get_json()
        # features = np.array(data['features']).reshape(1, -1)
        # prediction = risk_model.predict(features)
        # For demo, return mock risk
        return jsonify({
            'risk_level': 'low',
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)