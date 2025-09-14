import React, { useState, useEffect } from 'react';

const StoreOwnerDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [store, setStore] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showAddStoreModal, setShowAddStoreModal] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [newStoreData, setNewStoreData] = useState({
        name: '',
        email: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchStoreData();
        fetchStoreRatings();
    }, []);

    const fetchStoreData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/stores/my-store', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const data = await response.json();
            
            if (data.success) {
                setStore(data.store);
                setAverageRating(parseFloat(data.store.average_rating) || 0);
            }
        } catch (error) {
            console.error('Error fetching store data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStoreRatings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/ratings/my-store-ratings', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const data = await response.json();
            
            if (data.success) {
                setRatings(data.ratings || []);
                if (data.ratings && data.ratings.length > 0) {
                    const avg = data.ratings.reduce((sum, rating) => sum + rating.rating, 0) / data.ratings.length;
                    setAverageRating(avg);
                }
            } else {
                setRatings([]);
            }
        } catch (error) {
            console.error('Error fetching store ratings:', error);
            setRatings([]);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match!');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('New password must be at least 6 characters long!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setSuccess('Password updated successfully!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setTimeout(() => {
                    setShowPasswordModal(false);
                    setSuccess('');
                }, 2000);
            } else {
                setError(data.message || 'Failed to update password');
            }
        } catch (error) {
            setError('An error occurred while updating password');
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newStoreData.name || !newStoreData.email || !newStoreData.address) {
            setError('All fields are required!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/stores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(newStoreData)
            });

            const data = await response.json();
            
            if (data.success) {
                setSuccess('Store added successfully!');
                setStore(data.store);
                setNewStoreData({
                    name: '',
                    email: '',
                    address: ''
                });
                setTimeout(() => {
                    setShowAddStoreModal(false);
                    setSuccess('');
                    fetchStoreData(); // Refresh store data
                }, 2000);
            } else {
                setError(data.message || 'Failed to add store');
            }
        } catch (error) {
            setError('An error occurred while adding store');
        }
    };

    const renderRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} style={{ color: '#ffc107' }}>★</span>);
        }
        
        if (hasHalfStar) {
            stars.push(<span key="half" style={{ color: '#ffc107' }}>☆</span>);
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} style={{ color: '#e4e5e9' }}>☆</span>);
        }
        
        return stars;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
                <h2>Store Owner Dashboard</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        onClick={() => setShowAddStoreModal(true)}
                    >
                        Add Store
                    </button>
                    <button 
                        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        onClick={() => setShowPasswordModal(true)}
                    >
                        Update Password
                    </button>
                    <button onClick={onLogout} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <button
                    style={{
                        flex: 1,
                        padding: '15px',
                        border: 'none',
                        backgroundColor: activeTab === 'overview' ? '#007bff' : 'white',
                        color: activeTab === 'overview' ? 'white' : '#333',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: activeTab === 'overview' ? 'bold' : 'normal'
                    }}
                    onClick={() => setActiveTab('overview')}
                >
                    Store Overview
                </button>
                <button
                    style={{
                        flex: 1,
                        padding: '15px',
                        border: 'none',
                        backgroundColor: activeTab === 'ratings' ? '#007bff' : 'white',
                        color: activeTab === 'ratings' ? 'white' : '#333',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: activeTab === 'ratings' ? 'bold' : 'normal'
                    }}
                    onClick={() => setActiveTab('ratings')}
                >
                    Customer Ratings ({ratings.length})
                </button>
            </div>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {activeTab === 'overview' && (
                    <div>
                        <h3>Store Overview</h3>
                        {store ? (
                            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                                <h4 style={{ color: '#007bff', fontSize: '24px', margin: '0 0 10px 0' }}>{store.name}</h4>
                                <p style={{ margin: '5px 0', color: '#666', fontSize: '16px' }}> {store.email}</p>
                                <p style={{ margin: '5px 0', color: '#666', fontSize: '16px' }}> {store.address}</p>
                                <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#333' }}>Average Rating: </span>
                                    <span style={{ fontSize: '18px' }}>{renderRatingStars(averageRating)}</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#007bff' }}>{averageRating.toFixed(1)}/5</span>
                                    <span style={{ color: '#666', fontSize: '14px' }}>({ratings.length} reviews)</span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                <p>You don't have a store yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'ratings' && (
                    <div>
                        <h3>Customer Ratings & Reviews</h3>
                        {ratings.length > 0 ? (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {ratings.map((rating, index) => (
                                    <div key={index} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <span style={{ fontWeight: 'bold', color: '#333' }}>{rating.user_name || 'Anonymous Customer'}</span>
                                            <span style={{ color: '#666', fontSize: '14px' }}>{new Date(rating.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                            <span style={{ fontSize: '18px' }}>{renderRatingStars(rating.rating)}</span>
                                            <span style={{ fontWeight: 'bold', color: '#007bff' }}>({rating.rating}/5)</span>
                                        </div>
                                        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}> {rating.user_email}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                <p>No ratings yet. Share your store with customers to get reviews!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Password Update Modal */}
            {showPasswordModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setShowPasswordModal(false)}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Update Password</h3>
                        {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}
                        {success && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '5px', marginBottom: '15px' }}>{success}</div>}
                        <form onSubmit={handleUpdatePassword}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Current Password:</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>New Password:</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Confirm New Password:</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Update Password</button>
                                <button type="button" style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setShowPasswordModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Store Modal */}
            {showAddStoreModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setShowAddStoreModal(false)}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Add New Store</h3>
                        {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}
                        {success && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '5px', marginBottom: '15px' }}>{success}</div>}
                        <form onSubmit={handleAddStore}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Store Name:</label>
                                <input
                                    type="text"
                                    value={newStoreData.name}
                                    onChange={(e) => setNewStoreData({...newStoreData, name: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Store Email:</label>
                                <input
                                    type="email"
                                    value={newStoreData.email}
                                    onChange={(e) => setNewStoreData({...newStoreData, email: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Store Address:</label>
                                <textarea
                                    value={newStoreData.address}
                                    onChange={(e) => setNewStoreData({...newStoreData, address: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box', minHeight: '80px' }}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add Store</button>
                                <button type="button" style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setShowAddStoreModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreOwnerDashboard;
