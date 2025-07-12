import React, { useState } from 'react';
import './NewConsentModal.css';

// New consent modal
// TODO: Implement new consent creation modal
const NewConsentModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        accountNumber: '',
        purpose: '',
        dataTypes: [],
        expiryDate: '',
        permissions: []
    });

    const dataTypeOptions = [
        'Account Balance',
        'Transaction History',
        'Personal Information',
        'Credit Score',
        'Investment Portfolio'
    ];

    const permissionOptions = [
        'Read Only',
        'Limited Access',
        'Full Access'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [field]: checked 
                ? [...prev[field], value]
                : prev[field].filter(item => item !== value)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            customerName: '',
            accountNumber: '',
            purpose: '',
            dataTypes: [],
            expiryDate: '',
            permissions: []
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Create New Consent</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="consent-form">
                    <div className="form-group">
                        <label htmlFor="customerName">Customer Name</label>
                        <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="accountNumber">Account Number</label>
                        <input
                            type="text"
                            id="accountNumber"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="purpose">Purpose</label>
                        <textarea
                            id="purpose"
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleInputChange}
                            rows="3"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Data Types</label>
                        <div className="checkbox-group">
                            {dataTypeOptions.map(option => (
                                <label key={option} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        value={option}
                                        checked={formData.dataTypes.includes(option)}
                                        onChange={(e) => handleCheckboxChange(e, 'dataTypes')}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Permissions</label>
                        <div className="checkbox-group">
                            {permissionOptions.map(option => (
                                <label key={option} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        value={option}
                                        checked={formData.permissions.includes(option)}
                                        onChange={(e) => handleCheckboxChange(e, 'permissions')}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <input
                            type="date"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Create Consent
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewConsentModal;