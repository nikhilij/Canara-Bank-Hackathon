from typing import Optional, List
from pydantic import BaseModel

"""
Models for the ML service
"""



class PredictionRequest(BaseModel):
    """Request model for predictions"""
    data: List[float]
    model_type: str


class PredictionResponse(BaseModel):
    """Response model for predictions"""
    prediction: float
    confidence: Optional[float] = None
    model_used: str


class TrainingRequest(BaseModel):
    """Request model for training"""
    dataset_path: str
    model_type: str
    parameters: Optional[dict] = None


class TrainingResponse(BaseModel):
    """Response model for training"""
    model_id: str
    accuracy: float
    status: str