import numpy as np
import pandas as pd
from typing import Union, List, Optional, Callable
import warnings

class DifferentialPrivacy:
    """
    A comprehensive differential privacy implementation for data protection.
    
    This class provides various mechanisms to add controlled noise to data
    while maintaining privacy guarantees.
    """
    
    def __init__(self, epsilon: float = 1.0, delta: float = 1e-5):
        """
        Initialize the differential privacy engine.
        
        Args:
            epsilon: Privacy budget (smaller = more private)
            delta: Probability of privacy breach (for approximate DP)
        """
        self.epsilon = epsilon
        self.delta = delta
        self.privacy_budget_used = 0.0
    
    def laplace_mechanism(self, data: Union[float, np.ndarray], 
                         sensitivity: float) -> Union[float, np.ndarray]:
        """
        Apply Laplace mechanism for differential privacy.
        
        Args:
            data: Original data value(s)
            sensitivity: Global sensitivity of the query
            
        Returns:
            Noisy data with privacy guarantees
        """
        scale = sensitivity / self.epsilon
        noise = np.random.laplace(0, scale, size=np.array(data).shape)
        return data + noise
    
    def gaussian_mechanism(self, data: Union[float, np.ndarray], 
                          sensitivity: float) -> Union[float, np.ndarray]:
        """
        Apply Gaussian mechanism for differential privacy.
        
        Args:
            data: Original data value(s)
            sensitivity: Global sensitivity of the query
            
        Returns:
            Noisy data with privacy guarantees
        """
        sigma = sensitivity * np.sqrt(2 * np.log(1.25 / self.delta)) / self.epsilon
        noise = np.random.normal(0, sigma, size=np.array(data).shape)
        return data + noise
    
    def exponential_mechanism(self, candidates: List, 
                            utility_function: Callable, 
                            sensitivity: float):
        """
        Apply exponential mechanism for differential privacy.
        
        Args:
            candidates: List of possible outputs
            utility_function: Function that scores each candidate
            sensitivity: Sensitivity of the utility function
            
        Returns:
            Privately selected candidate
        """
        scores = [utility_function(candidate) for candidate in candidates]
        probabilities = np.exp(self.epsilon * np.array(scores) / (2 * sensitivity))
        probabilities = probabilities / np.sum(probabilities)
        
        return np.random.choice(candidates, p=probabilities)
    
    def add_noise_to_dataframe(self, df: pd.DataFrame, 
                              columns: List[str], 
                              mechanism: str = 'laplace') -> pd.DataFrame:
        """
        Add differential privacy noise to specific columns of a DataFrame.
        
        Args:
            df: Input DataFrame
            columns: List of column names to add noise to
            mechanism: Type of mechanism ('laplace' or 'gaussian')
            
        Returns:
            DataFrame with noisy columns
        """
        df_noisy = df.copy()
        
        for col in columns:
            if col not in df.columns:
                warnings.warn(f"Column '{col}' not found in DataFrame")
                continue
                
            if not pd.api.types.is_numeric_dtype(df[col]):
                warnings.warn(f"Column '{col}' is not numeric, skipping")
                continue
            
            # Estimate sensitivity as the range of the data
            sensitivity = df[col].max() - df[col].min()
            
            if mechanism == 'laplace':
                df_noisy[col] = self.laplace_mechanism(df[col].values, sensitivity)
            elif mechanism == 'gaussian':
                df_noisy[col] = self.gaussian_mechanism(df[col].values, sensitivity)
            else:
                raise ValueError("Mechanism must be 'laplace' or 'gaussian'")
        
        return df_noisy
    
    def private_count(self, data: Union[pd.Series, np.ndarray, List]) -> float:
        """
        Return differentially private count.
        
        Args:
            data: Input data
            
        Returns:
            Noisy count
        """
        true_count = len(data)
        return self.laplace_mechanism(true_count, sensitivity=1.0)
    
    def private_sum(self, data: Union[pd.Series, np.ndarray, List], 
                   clipping_bound: float = None) -> float:
        """
        Return differentially private sum.
        
        Args:
            data: Input data
            clipping_bound: Maximum absolute value for clipping
            
        Returns:
            Noisy sum
        """
        data_array = np.array(data)
        
        if clipping_bound is not None:
            data_array = np.clip(data_array, -clipping_bound, clipping_bound)
            sensitivity = 2 * clipping_bound
        else:
            sensitivity = np.max(np.abs(data_array))
        
        true_sum = np.sum(data_array)
        return self.laplace_mechanism(true_sum, sensitivity)
    
    def private_mean(self, data: Union[pd.Series, np.ndarray, List], 
                    clipping_bound: float = None) -> float:
        """
        Return differentially private mean.
        
        Args:
            data: Input data
            clipping_bound: Maximum absolute value for clipping
            
        Returns:
            Noisy mean
        """
        noisy_sum = self.private_sum(data, clipping_bound)
        noisy_count = self.private_count(data)
        return noisy_sum / noisy_count if noisy_count != 0 else 0
    
    def private_histogram(self, data: Union[pd.Series, np.ndarray, List], 
                         bins: Union[int, List] = 10) -> tuple:
        """
        Return differentially private histogram.
        
        Args:
            data: Input data
            bins: Number of bins or bin edges
            
        Returns:
            Tuple of (noisy_counts, bin_edges)
        """
        counts, bin_edges = np.histogram(data, bins=bins)
        noisy_counts = self.laplace_mechanism(counts, sensitivity=1.0)
        return noisy_counts, bin_edges
    
    def check_privacy_budget(self, required_budget: float) -> bool:
        """
        Check if enough privacy budget is available.
        
        Args:
            required_budget: Amount of budget needed
            
        Returns:
            True if budget is available, False otherwise
        """
        return (self.privacy_budget_used + required_budget) <= self.epsilon
    
    def use_privacy_budget(self, amount: float):
        """
        Use privacy budget for a query.
        
        Args:
            amount: Amount of budget to use
        """
        if not self.check_privacy_budget(amount):
            raise ValueError("Insufficient privacy budget")
        
        self.privacy_budget_used += amount
    
    def reset_privacy_budget(self):
        """Reset the privacy budget counter."""
        self.privacy_budget_used = 0.0
    
    def get_remaining_budget(self) -> float:
        """Get the remaining privacy budget."""
        return self.epsilon - self.privacy_budget_used

# Utility functions for sensitivity analysis
def calculate_sensitivity(query_function: Callable, 
                         dataset1: Union[pd.DataFrame, np.ndarray],
                         dataset2: Union[pd.DataFrame, np.ndarray]) -> float:
    """
    Calculate the sensitivity of a query function between two datasets.
    
    Args:
        query_function: Function to analyze
        dataset1: First dataset
        dataset2: Second dataset (differing by one record)
        
    Returns:
        Sensitivity value
    """
    result1 = query_function(dataset1)
    result2 = query_function(dataset2)
    return abs(result1 - result2)

# Example usage and testing
if __name__ == "__main__":
    # Create sample data
    np.random.seed(42)
    data = np.random.normal(100, 15, 1000)
    df = pd.DataFrame({
        'salary': data,
        'age': np.random.randint(20, 65, 1000),
        'department': np.random.choice(['A', 'B', 'C'], 1000)
    })
    
    # Initialize differential privacy
    dp = DifferentialPrivacy(epsilon=1.0, delta=1e-5)
    
    # Test various mechanisms
    print("Original mean:", np.mean(data))
    print("Private mean:", dp.private_mean(data))
    print("Private count:", dp.private_count(data))
    print("Private sum:", dp.private_sum(data))
    
    # Test DataFrame noise addition
    df_noisy = dp.add_noise_to_dataframe(df, ['salary', 'age'])
    print("\nOriginal salary mean:", df['salary'].mean())
    print("Noisy salary mean:", df_noisy['salary'].mean())
    
    # Test histogram
    noisy_counts, bin_edges = dp.private_histogram(data)
    print("\nHistogram bins:", len(bin_edges) - 1)
    print("Remaining budget:", dp.get_remaining_budget())