import os
import json
import pickle
import logging
from datetime import datetime
from typing import Dict, Any, Tuple, Optional
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelTrainer:
    def __init__(self, data_path: str = "data/", model_path: str = "models/"):
        self.data_path = data_path
        self.model_path = model_path
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.model = None
        self.best_model = None
        self.best_score = 0.0
        
        # Create directories if they don't exist
        os.makedirs(self.model_path, exist_ok=True)
        
    def load_data(self, filename: str) -> pd.DataFrame:
        """Load data from CSV file"""
        try:
            filepath = os.path.join(self.data_path, filename)
            data = pd.read_csv(filepath)
            logger.info(f"Data loaded successfully from {filepath}")
            logger.info(f"Data shape: {data.shape}")
            return data
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            raise
    
    def preprocess_data(self, data: pd.DataFrame, target_column: str) -> Tuple[np.ndarray, np.ndarray]:
        """Preprocess data for training"""
        try:
            # Handle missing values
            data = data.fillna(data.mean(numeric_only=True))
            data = data.fillna(data.mode().iloc[0])
            
            # Separate features and target
            X = data.drop(columns=[target_column])
            y = data[target_column]
            
            # Encode categorical variables
            categorical_columns = X.select_dtypes(include=['object']).columns
            for col in categorical_columns:
                le = LabelEncoder()
                X[col] = le.fit_transform(X[col])
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Encode target if it's categorical
            if y.dtype == 'object':
                y_encoded = self.label_encoder.fit_transform(y)
            else:
                y_encoded = y.values
            
            logger.info("Data preprocessing completed")
            return X_scaled, y_encoded
            
        except Exception as e:
            logger.error(f"Error in preprocessing: {e}")
            raise
    
    def train_models(self, X_train: np.ndarray, y_train: np.ndarray, 
                    X_test: np.ndarray, y_test: np.ndarray) -> Dict[str, Any]:
        """Train multiple models and select the best one"""
        models = {
            'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
            'gradient_boosting': GradientBoostingClassifier(random_state=42),
            'logistic_regression': LogisticRegression(random_state=42, max_iter=1000)
        }
        
        results = {}
        
        for name, model in models.items():
            try:
                logger.info(f"Training {name}...")
                model.fit(X_train, y_train)
                
                # Make predictions
                y_pred = model.predict(X_test)
                
                # Calculate metrics
                accuracy = accuracy_score(y_test, y_pred)
                report = classification_report(y_test, y_pred, output_dict=True)
                
                results[name] = {
                    'model': model,
                    'accuracy': accuracy,
                    'classification_report': report
                }
                
                logger.info(f"{name} accuracy: {accuracy:.4f}")
                
                # Update best model
                if accuracy > self.best_score:
                    self.best_score = accuracy
                    self.best_model = model
                    self.model = model
                    
            except Exception as e:
                logger.error(f"Error training {name}: {e}")
                continue
        
        return results
    
    def save_model(self, model_name: str = "best_model") -> str:
        """Save the trained model and preprocessing objects"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            model_filename = f"{model_name}_{timestamp}.pkl"
            model_filepath = os.path.join(self.model_path, model_filename)
            
            # Save model and preprocessing objects
            model_data = {
                'model': self.model,
                'scaler': self.scaler,
                'label_encoder': self.label_encoder,
                'best_score': self.best_score,
                'timestamp': timestamp
            }
            
            joblib.dump(model_data, model_filepath)
            logger.info(f"Model saved to {model_filepath}")
            
            # Save model metadata
            metadata = {
                'model_file': model_filename,
                'accuracy': self.best_score,
                'timestamp': timestamp
            }
            
            metadata_filepath = os.path.join(self.model_path, "model_metadata.json")
            with open(metadata_filepath, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            return model_filepath
            
        except Exception as e:
            logger.error(f"Error saving model: {e}")
            raise
    
    def load_model(self, model_filepath: str) -> bool:
        """Load a trained model"""
        try:
            model_data = joblib.load(model_filepath)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.label_encoder = model_data['label_encoder']
            self.best_score = model_data['best_score']
            logger.info(f"Model loaded from {model_filepath}")
            return True
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False
    
    def train_pipeline(self, data_filename: str, target_column: str, 
                      test_size: float = 0.2) -> Dict[str, Any]:
        """Complete training pipeline"""
        try:
            # Load data
            data = self.load_data(data_filename)
            
            # Preprocess data
            X, y = self.preprocess_data(data, target_column)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=42, stratify=y
            )
            
            logger.info(f"Training set size: {X_train.shape[0]}")
            logger.info(f"Test set size: {X_test.shape[0]}")
            
            # Train models
            results = self.train_models(X_train, y_train, X_test, y_test)
            
            # Save best model
            model_path = self.save_model()
            
            return {
                'results': results,
                'model_path': model_path,
                'best_score': self.best_score
            }
            
        except Exception as e:
            logger.error(f"Error in training pipeline: {e}")
            raise

def main():
    """Main training function"""
    # Initialize trainer
    trainer = ModelTrainer()
    
    # Example usage
    try:
        # Replace with your actual data file and target column
        data_filename = "training_data.csv"
        target_column = "target"
        
        # Run training pipeline
        results = trainer.train_pipeline(data_filename, target_column)
        
        print(f"Training completed successfully!")
        print(f"Best model accuracy: {results['best_score']:.4f}")
        print(f"Model saved to: {results['model_path']}")
        
    except Exception as e:
        logger.error(f"Training failed: {e}")

if __name__ == "__main__":
    main()