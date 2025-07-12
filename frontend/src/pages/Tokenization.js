import React, { useState } from 'react';
import './Tokenization.css';

// Tokenization page
// TODO: Implement tokenization interface
const Tokenization = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTokenize = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Simulate API call for tokenization
            const response = await fetch('/api/tokenize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cardNumber,
                    expiryDate,
                    cvv
                })
            });
            
            const data = await response.json();
            setToken(data.token);
        } catch (error) {
            console.error('Tokenization failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tokenization-container">
            <h1>Card Tokenization</h1>
            <form onSubmit={handleTokenize} className="tokenization-form">
                <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                        type="text"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                        type="text"
                        id="expiryDate"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                        type="text"
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        required
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Tokenizing...' : 'Generate Token'}
                </button>
            </form>
            
            {token && (
                <div className="token-result">
                    <h3>Generated Token:</h3>
                    <p className="token-value">{token}</p>
                </div>
            )}
        </div>
    );
};

export default Tokenization;