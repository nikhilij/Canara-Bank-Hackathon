import React, { useState, useEffect } from 'react';
import './Notification.css';

// Notification component
// TODO: Implement notification system
const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getNotificationClass = () => {
        const baseClass = 'notification';
        const typeClass = `notification--${type}`;
        const visibleClass = isVisible ? 'notification--visible' : 'notification--hidden';
        return `${baseClass} ${typeClass} ${visibleClass}`;
    };

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible) return null;

    return (
        <div className={getNotificationClass()}>
            <div className="notification__content">
                <span className="notification__message">{message}</span>
                <button 
                    className="notification__close"
                    onClick={handleClose}
                    aria-label="Close notification"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Notification;