import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AnomalyDetection.css';

// Anomaly detection page
// TODO: Implement anomaly detection interface
const AnomalyDetection = () => {
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        severity: 'all',
        type: 'all',
        timeRange: '24h'
    });

    useEffect(() => {
        fetchAnomalies();
    }, [filters]);

    const fetchAnomalies = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/anomalies', {
                params: filters
            });
            setAnomalies(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch anomalies');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return '#ff4444';
            case 'medium': return '#ff9900';
            case 'low': return '#ffcc00';
            default: return '#666';
        }
    };

    if (loading) return <div className="loading">Loading anomalies...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="anomaly-detection">
            <h1>Anomaly Detection</h1>
            
            <div className="filters">
                <select 
                    value={filters.severity} 
                    onChange={(e) => handleFilterChange('severity', e.target.value)}
                >
                    <option value="all">All Severities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>

                <select 
                    value={filters.type} 
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                    <option value="all">All Types</option>
                    <option value="fraud">Fraud</option>
                    <option value="unusual_transaction">Unusual Transaction</option>
                    <option value="account_access">Account Access</option>
                </select>

                <select 
                    value={filters.timeRange} 
                    onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                >
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                </select>
            </div>

            <div className="anomalies-list">
                {anomalies.length === 0 ? (
                    <p>No anomalies detected</p>
                ) : (
                    anomalies.map((anomaly) => (
                        <div key={anomaly.id} className="anomaly-card">
                            <div className="anomaly-header">
                                <span 
                                    className="severity-badge"
                                    style={{ backgroundColor: getSeverityColor(anomaly.severity) }}
                                >
                                    {anomaly.severity.toUpperCase()}
                                </span>
                                <span className="anomaly-type">{anomaly.type}</span>
                                <span className="anomaly-time">{new Date(anomaly.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="anomaly-details">
                                <p>{anomaly.description}</p>
                                <div className="anomaly-meta">
                                    <span>Account: {anomaly.accountId}</span>
                                    <span>Risk Score: {anomaly.riskScore}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AnomalyDetection;