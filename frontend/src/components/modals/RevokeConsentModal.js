import React, { useState } from 'react';
import './Modal.css';

// Revoke consent modal
// TODO: Implement consent revocation modal
const RevokeConsentModal = ({ isOpen, onClose, onRevoke, consentDetails }) => {
    const [isRevoking, setIsRevoking] = useState(false);

    const handleRevoke = async () => {
        setIsRevoking(true);
        try {
            await onRevoke();
            onClose();
        } catch (error) {
            console.error('Failed to revoke consent:', error);
        } finally {
            setIsRevoking(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Revoke Consent</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to revoke consent for:</p>
                    <div className="consent-details">
                        <p><strong>Service:</strong> {consentDetails?.serviceName}</p>
                        <p><strong>Provider:</strong> {consentDetails?.provider}</p>
                        <p><strong>Granted on:</strong> {consentDetails?.grantedDate}</p>
                    </div>
                    <div className="warning-message">
                        <p>⚠️ This action cannot be undone. The service will no longer have access to your data.</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        className="btn-danger" 
                        onClick={handleRevoke}
                        disabled={isRevoking}
                    >
                        {isRevoking ? 'Revoking...' : 'Revoke Consent'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RevokeConsentModal;