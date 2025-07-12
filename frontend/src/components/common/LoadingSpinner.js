import React from 'react';
import './LoadingSpinner.css';

// Loading spinner component
// TODO: Implement loading spinner
const LoadingSpinner = ({ size = 'medium', color = '#007bff' }) => {
    return (
        <div className="loading-spinner-container">
            <div 
                className={`loading-spinner ${size}`}
                style={{ borderTopColor: color }}
            />
        </div>
    );
};

export default LoadingSpinner;