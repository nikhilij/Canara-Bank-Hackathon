import React, { useState, useEffect } from 'react';
import './ComplianceReports.css';

// Compliance reports page
// TODO: Implement compliance reporting interface
const ComplianceReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            // Replace with actual API call
            const mockReports = [
                {
                    id: 1,
                    title: 'AML Transaction Report',
                    type: 'AML',
                    date: '2024-01-15',
                    status: 'Completed',
                    violations: 3
                },
                {
                    id: 2,
                    title: 'KYC Compliance Report',
                    type: 'KYC',
                    date: '2024-01-14',
                    status: 'In Progress',
                    violations: 0
                },
                {
                    id: 3,
                    title: 'Regulatory Filing Report',
                    type: 'Regulatory',
                    date: '2024-01-13',
                    status: 'Pending Review',
                    violations: 1
                }
            ];
            setReports(mockReports);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setLoading(false);
        }
    };

    const generateReport = async (reportType) => {
        try {
            // Replace with actual API call
            console.log('Generating report:', reportType);
            // Refresh reports after generation
            fetchReports();
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const downloadReport = (reportId) => {
        // Replace with actual download logic
        console.log('Downloading report:', reportId);
    };

    if (loading) {
        return <div className="loading">Loading compliance reports...</div>;
    }

    return (
        <div className="compliance-reports">
            <div className="reports-header">
                <h1>Compliance Reports</h1>
                <div className="report-actions">
                    <div className="date-filter">
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                            placeholder="Start Date"
                        />
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                            placeholder="End Date"
                        />
                    </div>
                    <button className="generate-btn" onClick={() => generateReport('AML')}>
                        Generate AML Report
                    </button>
                    <button className="generate-btn" onClick={() => generateReport('KYC')}>
                        Generate KYC Report
                    </button>
                </div>
            </div>

            <div className="reports-grid">
                {reports.map(report => (
                    <div key={report.id} className="report-card">
                        <div className="report-header">
                            <h3>{report.title}</h3>
                            <span className={`status ${report.status.toLowerCase().replace(' ', '-')}`}>
                                {report.status}
                            </span>
                        </div>
                        <div className="report-details">
                            <p><strong>Type:</strong> {report.type}</p>
                            <p><strong>Date:</strong> {report.date}</p>
                            <p><strong>Violations:</strong> 
                                <span className={report.violations > 0 ? 'violations-found' : 'no-violations'}>
                                    {report.violations}
                                </span>
                            </p>
                        </div>
                        <div className="report-actions">
                            <button 
                                className="view-btn"
                                onClick={() => setSelectedReport(report)}
                            >
                                View Details
                            </button>
                            <button 
                                className="download-btn"
                                onClick={() => downloadReport(report.id)}
                            >
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedReport && (
                <div className="report-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{selectedReport.title}</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setSelectedReport(null)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Report Type:</strong> {selectedReport.type}</p>
                            <p><strong>Generated Date:</strong> {selectedReport.date}</p>
                            <p><strong>Status:</strong> {selectedReport.status}</p>
                            <p><strong>Violations Found:</strong> {selectedReport.violations}</p>
                            <div className="report-summary">
                                <h4>Summary</h4>
                                <p>This report contains detailed compliance information for the selected period.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplianceReports;