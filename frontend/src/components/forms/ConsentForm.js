import React, { useState } from 'react';
import './ConsentForm.css';

// Consent form component
// TODO: Implement consent creation/editing form
const ConsentForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
        purpose: initialData.purpose || '',
        dataTypes: initialData.dataTypes || [],
        duration: initialData.duration || '',
        thirdParties: initialData.thirdParties || [],
        ...initialData
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked 
                ? [...prev[name], value]
                : prev[name].filter(item => item !== value)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="consent-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="purpose">Purpose of Data Access</label>
                <textarea
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe the purpose for data access..."
                />
            </div>

            <div className="form-group">
                <label>Data Types</label>
                <div className="checkbox-group">
                    {['Account Balance', 'Transaction History', 'Personal Information', 'Contact Details'].map(type => (
                        <label key={type} className="checkbox-label">
                            <input
                                type="checkbox"
                                name="dataTypes"
                                value={type}
                                checked={formData.dataTypes.includes(type)}
                                onChange={handleCheckboxChange}
                            />
                            {type}
                        </label>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="duration">Access Duration</label>
                <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select duration</option>
                    <option value="1 month">1 Month</option>
                    <option value="3 months">3 Months</option>
                    <option value="6 months">6 Months</option>
                    <option value="1 year">1 Year</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="thirdParties">Third Party Access</label>
                <input
                    type="text"
                    id="thirdParties"
                    name="thirdParties"
                    value={formData.thirdParties.join(', ')}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        thirdParties: e.target.value.split(', ').filter(Boolean)
                    }))}
                    placeholder="Enter third parties (comma separated)"
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    Save Consent
                </button>
                <button type="button" className="btn btn-secondary">
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ConsentForm;