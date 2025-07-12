import React from 'react';
import './ConsentDetailsModal.css';

// Consent details modal
// TODO: Implement consent details modal
const ConsentDetailsModal = ({ isOpen, onClose, consentData }) => {
    if (!isOpen) return null;

    return (
        <div className="consent-modal-overlay" onClick={onClose}>
            <div className="consent-modal-content" onClick={e => e.stopPropagation()}>
                <div className="consent-modal-header">
                    <h2>Consent Details</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                <div className="consent-modal-body">
                    <div className="consent-section">
                        <h3>Account Information</h3>
                        <p><strong>Account Number:</strong> {consentData?.accountNumber}</p>
                        <p><strong>Account Type:</strong> {consentData?.accountType}</p>
                    </div>
                    
                    <div className="consent-section">
                        <h3>Data Access Permissions</h3>
                        <ul>
                            {consentData?.permissions?.map((permission, index) => (
                                <li key={index}>{permission}</li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="consent-section">
                        <h3>Duration</h3>
                        <p><strong>Valid From:</strong> {consentData?.validFrom}</p>
                        <p><strong>Valid Until:</strong> {consentData?.validUntil}</p>
                    </div>
                    
                    <div className="consent-section">
                        <h3>Third Party Details</h3>
                        <p><strong>Organization:</strong> {consentData?.organization}</p>
                        <p><strong>Purpose:</strong> {consentData?.purpose}</p>
                    </div>
                </div>
                
                <div className="consent-modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ConsentDetailsModal;