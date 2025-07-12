import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from flask import Flask, request, jsonify
import logging
import os
from dotenv import load_dotenv
from functools import wraps

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Simple token-based authentication
API_TOKEN = os.getenv('API_TOKEN', 'trustvault-ml-token')

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or token.replace('Bearer ', '') != API_TOKEN:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

class AnomalyDetector:
    """
    Anomaly detection service using Isolation Forest algorithm
    Detects unusual data access patterns that may indicate security breaches
    """
    
    def __init__(self):
        self.model = IsolationForest(
            n_estimators=100, 
            max_samples='auto',
            contamination=float(os.getenv('ANOMALY_CONTAMINATION', 0.1)),
            max_features=1.0,
            bootstrap=False,
            n_jobs=-1,
            random_state=42,
            verbose=0
        )
        self.is_trained = False
        
    def train(self, data):
        """
        Train the anomaly detection model
        
        Args:
            data (DataFrame): Training data with access patterns
        """
        if data.empty:
            logger.warning("Empty training data provided")
            return False
            
        try:
            self.model.fit(data)
            self.is_trained = True
            logger.info("Anomaly detection model trained successfully")
            return True
        except Exception as e:
            logger.error(f"Error training anomaly detection model: {e}")
            return False
    
    def detect_anomalies(self, data):
        """
        Detect anomalies in access patterns
        
        Args:
            data (DataFrame): Data to check for anomalies
            
        Returns:
            list: Boolean list indicating anomalies
        """
        if not self.is_trained:
            logger.warning("Model not trained yet")
            return None
            
        try:
            # Predict returns -1 for outliers and 1 for inliers
            predictions = self.model.predict(data)
            # Convert to boolean where True means anomaly
            anomalies = [pred == -1 for pred in predictions]
            
            logger.info(f"Detected {sum(anomalies)} anomalies in {len(anomalies)} records")
            return anomalies
        except Exception as e:
            logger.error(f"Error detecting anomalies: {e}")
            return None
            
    def get_anomaly_scores(self, data):
        """
        Get anomaly scores for data points
        More negative score indicates higher anomaly
        
        Args:
            data (DataFrame): Data to score
            
        Returns:
            list: Anomaly scores (more negative = more anomalous)
        """
        if not self.is_trained:
            logger.warning("Model not trained yet")
            return None
            
        try:
            scores = -self.model.score_samples(data)
            return scores.tolist()
        except Exception as e:
            logger.error(f"Error calculating anomaly scores: {e}")
            return None
        
    def save_model(self, path='anomaly_model.pkl'):
        import joblib
        joblib.dump(self.model, path)
        logging.info(f"Model saved to {path}")
        
    def load_model(self, path='anomaly_model.pkl'):
        import joblib
        if os.path.exists(path):
            self.model = joblib.load(path)
            self.is_trained = True
            logging.info(f"Model loaded from {path}")

# Initialize the detector
detector = AnomalyDetector()
detector.load_model()

@app.route('/train', methods=['POST'])
@require_auth
def train_model():
    """Train the anomaly detection model with historical access data"""
    data = request.json
    
    if not data or 'features' not in data:
        return jsonify({"error": "Missing required training data"}), 400
        
    try:
        df = pd.DataFrame(data['features'])
        success = detector.train(df)
        if success:
            detector.save_model()
            return jsonify({"status": "success", "message": "Model trained successfully"})
        else:
            return jsonify({"status": "error", "message": "Failed to train model"}), 500
    except Exception as e:
        logger.error(f"Error in training endpoint: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/detect', methods=['POST'])
@require_auth
def detect():
    """Detect anomalies in access patterns"""
    data = request.json
    
    if not data or 'features' not in data:
        return jsonify({"error": "Missing required features data"}), 400
        
    if not detector.is_trained:
        return jsonify({"error": "Model not trained yet"}), 400
        
    try:
        df = pd.DataFrame(data['features'])
        anomalies = detector.detect_anomalies(df)
        scores = detector.get_anomaly_scores(df)
        
        if anomalies is None or scores is None:
            return jsonify({"status": "error", "message": "Failed to detect anomalies"}), 500
            
        response = {
            "status": "success",
            "results": [
                {
                    "index": i,
                    "is_anomaly": bool(anomaly),
                    "anomaly_score": float(score)
                }
                for i, (anomaly, score) in enumerate(zip(anomalies, scores))
            ],
            "summary": {
                "total_records": len(anomalies),
                "anomalies_detected": sum(anomalies),
                "anomaly_rate": sum(anomalies) / len(anomalies) if anomalies else 0
            }
        }
        
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error in detection endpoint: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5002))
    app.run(host='0.0.0.0', port=port)
