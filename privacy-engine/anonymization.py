import hashlib
import random
import string
import re
from typing import Dict, List, Optional, Union, Any
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

class PrivacyEngine:
    """
    A comprehensive privacy engine for data anonymization and pseudonymization.
    Supports various anonymization techniques for financial and personal data.
    """
    
    def __init__(self, seed: Optional[int] = None):
        """Initialize the privacy engine with optional seed for reproducible results."""
        self.seed = seed
        if seed:
            random.seed(seed)
            np.random.seed(seed)
        
        # Predefined replacement data
        self.fake_names = [
            "John Smith", "Jane Doe", "Mike Johnson", "Sarah Wilson", 
            "David Brown", "Lisa Davis", "Robert Miller", "Emily Taylor"
        ]
        
        self.fake_addresses = [
            "123 Main St", "456 Oak Ave", "789 Pine Rd", "321 Elm St",
            "654 Maple Dr", "987 Cedar Ln", "147 Birch Way", "258 Ash Blvd"
        ]
        
        self.fake_companies = [
            "Tech Corp", "Business Inc", "Enterprise LLC", "Solutions Ltd",
            "Services Co", "Systems Group", "Digital Works", "Global Partners"
        ]
    
    def hash_value(self, value: str, salt: str = "default_salt") -> str:
        """Create a consistent hash of a value with salt."""
        combined = f"{value}{salt}"
        return hashlib.sha256(combined.encode()).hexdigest()[:8]
    
    def mask_account_number(self, account_num: str) -> str:
        """Mask account number showing only last 4 digits."""
        if len(account_num) <= 4:
            return "*" * len(account_num)
        return "*" * (len(account_num) - 4) + account_num[-4:]
    
    def mask_phone_number(self, phone: str) -> str:
        """Mask phone number showing only last 4 digits."""
        digits_only = re.sub(r'\D', '', phone)
        if len(digits_only) <= 4:
            return "*" * len(digits_only)
        return "*" * (len(digits_only) - 4) + digits_only[-4:]
    
    def mask_email(self, email: str) -> str:
        """Mask email address preserving domain structure."""
        if "@" not in email:
            return "*" * len(email)
        
        local, domain = email.split("@", 1)
        if len(local) <= 2:
            masked_local = "*" * len(local)
        else:
            masked_local = local[0] + "*" * (len(local) - 2) + local[-1]
        
        return f"{masked_local}@{domain}"
    
    def anonymize_name(self, name: str) -> str:
        """Replace name with a fake name based on hash."""
        hash_val = int(self.hash_value(name), 16)
        return self.fake_names[hash_val % len(self.fake_names)]
    
    def anonymize_address(self, address: str) -> str:
        """Replace address with a fake address based on hash."""
        hash_val = int(self.hash_value(address), 16)
        return self.fake_addresses[hash_val % len(self.fake_addresses)]
    
    def generalize_age(self, age: int, bin_size: int = 10) -> str:
        """Generalize age into age ranges."""
        if age < 0:
            return "Unknown"
        
        lower_bound = (age // bin_size) * bin_size
        upper_bound = lower_bound + bin_size - 1
        return f"{lower_bound}-{upper_bound}"
    
    def generalize_salary(self, salary: float, bin_size: int = 10000) -> str:
        """Generalize salary into salary ranges."""
        if salary < 0:
            return "Unknown"
        
        lower_bound = int(salary // bin_size) * bin_size
        upper_bound = lower_bound + bin_size - 1
        return f"{lower_bound}-{upper_bound}"
    
    def add_noise_to_amount(self, amount: float, noise_percentage: float = 0.05) -> float:
        """Add random noise to numerical amounts."""
        noise = amount * noise_percentage * (2 * random.random() - 1)
        return round(amount + noise, 2)
    
    def k_anonymize_dataframe(self, df: pd.DataFrame, quasi_identifiers: List[str], k: int = 3) -> pd.DataFrame:
        """Apply k-anonymity to a DataFrame by generalizing quasi-identifiers."""
        result_df = df.copy()
        
        # Group by quasi-identifiers and check group sizes
        groups = result_df.groupby(quasi_identifiers)
        
        for name, group in groups:
            if len(group) < k:
                # Generalize the group to achieve k-anonymity
                for qi in quasi_identifiers:
                    if qi in result_df.columns:
                        if result_df[qi].dtype in ['int64', 'float64']:
                            # Generalize numerical values
                            result_df.loc[group.index, qi] = self._generalize_numerical(
                                result_df.loc[group.index, qi]
                            )
                        else:
                            # Generalize categorical values
                            result_df.loc[group.index, qi] = self._generalize_categorical(
                                result_df.loc[group.index, qi]
                            )
        
        return result_df
    
    def _generalize_numerical(self, series: pd.Series) -> pd.Series:
        """Generalize numerical values by creating ranges."""
        min_val = series.min()
        max_val = series.max()
        return f"{min_val}-{max_val}"
    
    def _generalize_categorical(self, series: pd.Series) -> pd.Series:
        """Generalize categorical values by using a common category."""
        return "General"
    
    def anonymize_transaction_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Anonymize transaction data with appropriate techniques."""
        result_df = df.copy()
        
        # Common anonymization patterns for financial data
        if 'account_number' in result_df.columns:
            result_df['account_number'] = result_df['account_number'].apply(self.mask_account_number)
        
        if 'customer_name' in result_df.columns:
            result_df['customer_name'] = result_df['customer_name'].apply(self.anonymize_name)
        
        if 'phone' in result_df.columns:
            result_df['phone'] = result_df['phone'].apply(self.mask_phone_number)
        
        if 'email' in result_df.columns:
            result_df['email'] = result_df['email'].apply(self.mask_email)
        
        if 'amount' in result_df.columns:
            result_df['amount'] = result_df['amount'].apply(self.add_noise_to_amount)
        
        if 'address' in result_df.columns:
            result_df['address'] = result_df['address'].apply(self.anonymize_address)
        
        if 'age' in result_df.columns:
            result_df['age'] = result_df['age'].apply(self.generalize_age)
        
        if 'salary' in result_df.columns:
            result_df['salary'] = result_df['salary'].apply(self.generalize_salary)
        
        return result_df
    
    def differential_privacy_noise(self, value: float, epsilon: float = 1.0, sensitivity: float = 1.0) -> float:
        """Add Laplace noise for differential privacy."""
        scale = sensitivity / epsilon
        noise = np.random.laplace(0, scale)
        return value + noise
    
    def suppress_rare_values(self, df: pd.DataFrame, column: str, threshold: int = 5) -> pd.DataFrame:
        """Suppress rare values in a column that appear less than threshold times."""
        result_df = df.copy()
        value_counts = result_df[column].value_counts()
        rare_values = value_counts[value_counts < threshold].index
        result_df.loc[result_df[column].isin(rare_values), column] = "*SUPPRESSED*"
        return result_df
    
    def pseudonymize_ids(self, df: pd.DataFrame, id_columns: List[str]) -> Dict[str, pd.DataFrame]:
        """Create pseudonymized versions of ID columns with mapping tables."""
        result_df = df.copy()
        mapping_tables = {}
        
        for col in id_columns:
            if col in result_df.columns:
                unique_values = result_df[col].unique()
                pseudonym_map = {}
                
                for i, value in enumerate(unique_values):
                    pseudonym_map[value] = f"ID_{col}_{i:06d}"
                
                result_df[col] = result_df[col].map(pseudonym_map)
                mapping_tables[col] = pd.DataFrame(list(pseudonym_map.items()), 
                                                 columns=['original', 'pseudonym'])
        
        return {"anonymized_data": result_df, "mapping_tables": mapping_tables}
    
    def anonymize_dataset(self, df: pd.DataFrame, config: Dict[str, Any]) -> pd.DataFrame:
        """
        Anonymize a dataset based on configuration.
        
        Config example:
        {
            'mask_columns': ['account_number', 'phone'],
            'anonymize_columns': ['customer_name', 'address'],
            'generalize_columns': {'age': 10, 'salary': 10000},
            'noise_columns': {'amount': 0.05},
            'k_anonymity': {'quasi_identifiers': ['age', 'zipcode'], 'k': 3},
            'suppress_rare': {'column': 'category', 'threshold': 5}
        }
        """
        result_df = df.copy()
        
        # Apply masking
        if 'mask_columns' in config:
            for col in config['mask_columns']:
                if col in result_df.columns:
                    if 'account' in col.lower():
                        result_df[col] = result_df[col].apply(self.mask_account_number)
                    elif 'phone' in col.lower():
                        result_df[col] = result_df[col].apply(self.mask_phone_number)
                    elif 'email' in col.lower():
                        result_df[col] = result_df[col].apply(self.mask_email)
        
        # Apply anonymization
        if 'anonymize_columns' in config:
            for col in config['anonymize_columns']:
                if col in result_df.columns:
                    if 'name' in col.lower():
                        result_df[col] = result_df[col].apply(self.anonymize_name)
                    elif 'address' in col.lower():
                        result_df[col] = result_df[col].apply(self.anonymize_address)
        
        # Apply generalization
        if 'generalize_columns' in config:
            for col, bin_size in config['generalize_columns'].items():
                if col in result_df.columns:
                    if 'age' in col.lower():
                        result_df[col] = result_df[col].apply(lambda x: self.generalize_age(x, bin_size))
                    elif 'salary' in col.lower():
                        result_df[col] = result_df[col].apply(lambda x: self.generalize_salary(x, bin_size))
        
        # Apply noise
        if 'noise_columns' in config:
            for col, noise_pct in config['noise_columns'].items():
                if col in result_df.columns:
                    result_df[col] = result_df[col].apply(lambda x: self.add_noise_to_amount(x, noise_pct))
        
        # Apply k-anonymity
        if 'k_anonymity' in config:
            k_config = config['k_anonymity']
            result_df = self.k_anonymize_dataframe(
                result_df, 
                k_config['quasi_identifiers'], 
                k_config['k']
            )
        
        # Apply suppression
        if 'suppress_rare' in config:
            suppress_config = config['suppress_rare']
            result_df = self.suppress_rare_values(
                result_df,
                suppress_config['column'],
                suppress_config['threshold']
            )
        
        return result_df

# Usage example and utility functions
def create_sample_banking_data():
    """Create sample banking data for testing."""
    return pd.DataFrame({
        'customer_id': ['C001', 'C002', 'C003', 'C004', 'C005'],
        'customer_name': ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 'David Brown'],
        'account_number': ['1234567890', '2345678901', '3456789012', '4567890123', '5678901234'],
        'phone': ['555-1234', '555-2345', '555-3456', '555-4567', '555-5678'],
        'email': ['john@email.com', 'jane@email.com', 'mike@email.com', 'sarah@email.com', 'david@email.com'],
        'amount': [1000.50, 2500.75, 750.25, 3200.00, 1800.30],
        'age': [25, 35, 45, 30, 40],
        'salary': [50000, 75000, 60000, 80000, 65000],
        'address': ['123 Main St', '456 Oak Ave', '789 Pine Rd', '321 Elm St', '654 Maple Dr']
    })

if __name__ == "__main__":
    # Example usage
    privacy_engine = PrivacyEngine(seed=42)
    
    # Create sample data
    sample_data = create_sample_banking_data()
    print("Original Data:")
    print(sample_data)
    
    # Anonymize using predefined transaction data method
    anonymized_data = privacy_engine.anonymize_transaction_data(sample_data)
    print("\nAnonymized Data:")
    print(anonymized_data)
    
    # Custom anonymization configuration
    config = {
        'mask_columns': ['account_number', 'phone'],
        'anonymize_columns': ['customer_name', 'address'],
        'generalize_columns': {'age': 10, 'salary': 10000},
        'noise_columns': {'amount': 0.05}
    }
    
    custom_anonymized = privacy_engine.anonymize_dataset(sample_data, config)
    print("\nCustom Anonymized Data:")
    print(custom_anonymized)