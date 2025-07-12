import React, { useState, useEffect } from 'react';
import './Profile.css';

// User profile page
// TODO: Implement user profile management
const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        avatar: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user data from API
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            // Replace with actual API call
            const response = await fetch('/api/user/profile');
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Replace with actual API call
            await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) {
        return <div className="profile-loading">Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>User Profile</h1>
                <button 
                    className="edit-btn"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-avatar">
                    <img 
                        src={user.avatar || '/default-avatar.png'} 
                        alt="Profile"
                        className="avatar-image"
                    />
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={user.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={user.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={user.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            rows="3"
                        />
                    </div>

                    {isEditing && (
                        <button type="submit" className="save-btn">
                            Save Changes
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;