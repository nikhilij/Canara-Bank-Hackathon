import { useState, useEffect } from 'react';

// Custom hook for consent management
// TODO: Implement useConsent hook
export const useConsent = () => {
    const [consents, setConsents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const grantConsent = async (consentData) => {
        setLoading(true);
        setError(null);
        try {
            // API call to grant consent
            const response = await fetch('/api/consent/grant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(consentData),
            });
            
            if (!response.ok) {
                throw new Error('Failed to grant consent');
            }
            
            const result = await response.json();
            setConsents(prev => [...prev, result]);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const revokeConsent = async (consentId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/consent/revoke/${consentId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to revoke consent');
            }
            
            setConsents(prev => prev.filter(consent => consent.id !== consentId));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchConsents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/consent');
            if (!response.ok) {
                throw new Error('Failed to fetch consents');
            }
            const data = await response.json();
            setConsents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsents();
    }, []);

    return {
        consents,
        loading,
        error,
        grantConsent,
        revokeConsent,
        fetchConsents,
    };
};