import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

// Header component
// TODO: Implement application header
const Header = () => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="header-brand">
                    <Link to="/" className="brand-link">
                        <img src="/logo.png" alt="Canara Bank" className="brand-logo" />
                        <span className="brand-text">Canara Bank</span>
                    </Link>
                </div>
                
                <nav className="header-nav">
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/profile" className="nav-link">Profile</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/logout" className="nav-link">Logout</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;