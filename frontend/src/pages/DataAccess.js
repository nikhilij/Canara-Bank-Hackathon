import React, { useState, useEffect } from 'react';
import './DataAccess.css';

// Data access page
// TODO: Implement data access history
const DataAccess = () => {
    const [accessHistory, setAccessHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccessHistory();
    }, []);

    const fetchAccessHistory = async () => {
        try {
            // Replace with actual API endpoint
            const response = await fetch('/api/data-access-history');
            const data = await response.json();
            setAccessHistory(data);
        } catch (error) {
            console.error('Error fetching access history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading access history...</div>;
    }

    return (
        <div className="data-access-container">
            <h2>Data Access History</h2>
            <div className="access-history">
                {accessHistory.length === 0 ? (
                    <p>No data access history found.</p>
                ) : (
                    <table className="access-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>User</th>
                                <th>Data Type</th>
                                <th>Action</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accessHistory.map((record, index) => (
                                <tr key={index}>
                                    <td>{new Date(record.timestamp).toLocaleDateString()}</td>
                                    <td>{record.userId}</td>
                                    <td>{record.dataType}</td>
                                    <td>{record.action}</td>
                                    <td className={`status ${record.status.toLowerCase()}`}>
                                        {record.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DataAccess;