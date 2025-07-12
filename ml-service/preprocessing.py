import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import warnings

warnings.filterwarnings('ignore')

class DataPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
        
    def load_data(self, file_path):
        """Load data from CSV file"""
        try:
            data = pd.read_csv(file_path)
            return data
        except Exception as e:
            print(f"Error loading data: {e}")
            return None
    
    def handle_missing_values(self, df):
        """Handle missing values in the dataset"""
        # Fill numerical columns with median
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        df[numerical_cols] = df[numerical_cols].fillna(df[numerical_cols].median())
        
        # Fill categorical columns with mode
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else 'Unknown')
        
        return df
    
    def encode_categorical_features(self, df, categorical_columns):
        """Encode categorical features"""
        df_encoded = df.copy()
        
        for col in categorical_columns:
            if col in df_encoded.columns:
                le = LabelEncoder()
                df_encoded[col] = le.fit_transform(df_encoded[col].astype(str))
                self.label_encoders[col] = le
        
        return df_encoded
    
    def scale_features(self, X_train, X_test=None):
        """Scale numerical features"""
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        if X_test is not None:
            X_test_scaled = self.scaler.transform(X_test)
            return X_train_scaled, X_test_scaled
        
        return X_train_scaled
    
    def split_data(self, X, y, test_size=0.2, random_state=42):
        """Split data into training and testing sets"""
        return train_test_split(X, y, test_size=test_size, random_state=random_state)
    
    def preprocess_pipeline(self, data, target_column, categorical_columns=None):
        """Complete preprocessing pipeline"""
        # Handle missing values
        data_clean = self.handle_missing_values(data)
        
        # Separate features and target
        X = data_clean.drop(columns=[target_column])
        y = data_clean[target_column]
        
        # Encode categorical features
        if categorical_columns:
            X = self.encode_categorical_features(X, categorical_columns)
        
        # Split data
        X_train, X_test, y_train, y_test = self.split_data(X, y)
        
        # Scale features
        X_train_scaled, X_test_scaled = self.scale_features(X_train, X_test)
        
        return X_train_scaled, X_test_scaled, y_train, y_test
    
    def transform_new_data(self, new_data, categorical_columns=None):
        """Transform new data using fitted preprocessors"""
        # Handle missing values
        new_data_clean = self.handle_missing_values(new_data)
        
        # Encode categorical features
        if categorical_columns:
            for col in categorical_columns:
                if col in new_data_clean.columns and col in self.label_encoders:
                    new_data_clean[col] = self.label_encoders[col].transform(new_data_clean[col].astype(str))
        
        # Scale features
        new_data_scaled = self.scaler.transform(new_data_clean)
        
        return new_data_scaled