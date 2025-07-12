import React, { useState, useEffect } from 'react';
import './AuditLogs.css';

// Audit logs page
// TODO: Implement audit log viewing
const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const fetchAuditLogs = async () => {
        try {
            const response = await fetch('/api/audit-logs');
            const data = await response.json();
            setLogs(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => 
        filter === 'all' || log.action === filter
    );

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString();
    };

    if (loading) {
        return <div className="loading">Loading audit logs...</div>;
    }

    return (
        <div className="audit-logs">
            <h1>Audit Logs</h1>
            
            <div className="filter-section">
                <label>Filter by action:</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All Actions</option>
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                    <option value="create">Create</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                </select>
            </div>

            <div className="logs-table">
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Resource</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log.id}>
                                <td>{formatDateTime(log.timestamp)}</td>
                                <td>{log.user}</td>
                                <td className={`action-${log.action}`}>{log.action}</td>
                                <td>{log.resource}</td>
                                <td>{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;