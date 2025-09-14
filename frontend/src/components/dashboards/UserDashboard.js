import React, { useState, useEffect } from 'react';

const UserDashboard = ({ onLogout }) => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [newRating, setNewRating] = useState(5);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Utility function to safely parse rating values
    const safeParseRating = (value) => {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/stores/for-user', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (data.success) {
                setStores(data.stores);
            } else {
                console.error('Failed to fetch stores:', data.message);
            }
        } catch (error) {
            console.error('Error fetching stores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitRating = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    store_id: selectedStore.id,
                    rating: newRating
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setShowRatingModal(false);
                setSelectedStore(null);
                setNewRating(5);
                
                // Refresh stores to get updated ratings and averages
                await fetchStores();
                
                alert(data.isUpdate ? 'Rating updated successfully!' : 'Rating submitted successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Error submitting rating');
        }
    };

    const handleUpdateRating = async (storeId, rating) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    store_id: storeId,
                    rating: rating 
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Refresh stores to get updated ratings and averages
                await fetchStores();
                alert('Rating updated successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating rating:', error);
            alert('Error updating rating');
        }
    };

    const handleDeleteRating = async (storeId) => {
        if (window.confirm('Are you sure you want to delete your rating?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/ratings/store/${storeId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Refresh stores to get updated ratings and averages
                    await fetchStores();
                    alert('Rating deleted successfully!');
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                console.error('Error deleting rating:', error);
                alert('Error deleting rating');
            }
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New password and confirm password do not match');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            alert('New password must be at least 6 characters long');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Password updated successfully!');
                setShowPasswordModal(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Error updating password');
        }
    };

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderStarRating = (rating, onRatingChange = null, interactive = false) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{
                        ...styles.star,
                        color: i <= rating ? '#FFD700' : '#DDD',
                        cursor: interactive ? 'pointer' : 'default'
                    }}
                    onClick={() => interactive && onRatingChange && onRatingChange(i)}
                >
                    ★
                </span>
            );
        }
        return <div style={styles.starContainer}>{stars}</div>;
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>User Dashboard</h1>
                <div style={styles.headerActions}>
                    <button
                        style={styles.updatePasswordBtn}
                        onClick={() => setShowPasswordModal(true)}
                    >
                        Update Password
                    </button>
                    <button style={styles.logoutBtn} onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.content}>
                <div style={styles.storesSection}>
                    <h2 style={styles.sectionTitle}>All Registered Stores</h2>
                    
                    <div style={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search stores by name or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    {loading ? (
                        <div style={styles.loading}>Loading stores...</div>
                    ) : filteredStores.length === 0 ? (
                        <div style={styles.noResults}>
                            No stores found matching your search criteria.
                        </div>
                    ) : (
                        <div style={styles.storesGrid}>
                            {filteredStores.map(store => (
                                <div key={store.id} style={styles.storeCard}>
                                    {/* Store Image Section */}
                                    <div style={styles.imageSection}>
                                        {store.image_url ? (
                                            <img 
                                                src={store.image_url} 
                                                alt={store.name}
                                                style={styles.storeImage}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div style={styles.imagePlaceholder}>
                                            <span style={styles.placeholderIcon}>🏪</span>
                                            <span style={styles.placeholderText}>Store Image</span>
                                        </div>
                                    </div>

                                    <div style={styles.storeInfo}>
                                        <h3 style={styles.storeName}>{store.name}</h3>
                                        <p style={styles.storeAddress}>{store.address}</p>
                                        
                                        <div style={styles.ratingSection}>
                                            <div style={styles.overallRating}>
                                                <strong>Overall Rating: </strong>
                                                {renderStarRating(safeParseRating(store.average_rating))}
                                                <span style={styles.ratingNumber}>
                                                    ({safeParseRating(store.average_rating).toFixed(1)}) 
                                                    {store.total_ratings ? ` - ${store.total_ratings} ratings` : ' - No ratings yet'}
                                                </span>
                                            </div>
                                            
                                            {store.user_rating ? (
                                                <div style={styles.userRating}>
                                                    <div style={styles.ratingRow}>
                                                        <strong>Your Rating: </strong>
                                                        {renderStarRating(safeParseRating(store.user_rating), (rating) => handleUpdateRating(store.id, rating), true)}
                                                        <span style={styles.ratingNumber}>({safeParseRating(store.user_rating)})</span>
                                                    </div>
                                                    <button
                                                        style={styles.deleteRatingBtn}
                                                        onClick={() => handleDeleteRating(store.id)}
                                                    >
                                                        Delete Rating
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    style={styles.rateBtn}
                                                    onClick={() => {
                                                        setSelectedStore(store);
                                                        setShowRatingModal(true);
                                                    }}
                                                >
                                                    Rate This Store
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Rating Modal */}
            {showRatingModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Rate {selectedStore?.name}</h3>
                        <form onSubmit={handleSubmitRating}>
                            <div style={styles.ratingModalSection}>
                                <label>Select Rating (1-5 stars):</label>
                                {renderStarRating(newRating, setNewRating, true)}
                                <span style={styles.ratingNumber}>({newRating})</span>
                            </div>
                            <div style={styles.modalActions}>
                                <button type="submit" style={styles.submitBtn}>Submit Rating</button>
                                <button 
                                    type="button" 
                                    style={styles.cancelBtn}
                                    onClick={() => {
                                        setShowRatingModal(false);
                                        setSelectedStore(null);
                                        setNewRating(5);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Password Update Modal */}
            {showPasswordModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Update Password</h3>
                        <form onSubmit={handlePasswordUpdate}>
                            <div style={styles.formGroup}>
                                <label htmlFor="currentPassword">Current Password:</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        currentPassword: e.target.value
                                    })}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label htmlFor="newPassword">New Password:</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value
                                    })}
                                    style={styles.input}
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label htmlFor="confirmPassword">Confirm New Password:</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value
                                    })}
                                    style={styles.input}
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div style={styles.modalActions}>
                                <button type="submit" style={styles.submitBtn}>Update Password</button>
                                <button 
                                    type="button" 
                                    style={styles.cancelBtn}
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordData({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '0'
    },
    header: {
        backgroundColor: 'white',
        padding: '20px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        margin: '0',
        color: '#333',
        fontSize: '24px'
    },
    headerActions: {
        display: 'flex',
        gap: '10px'
    },
    updatePasswordBtn: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    logoutBtn: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    content: {
        padding: '20px'
    },
    storesSection: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
        marginTop: '0',
        marginBottom: '20px',
        color: '#333',
        fontSize: '20px'
    },
    searchContainer: {
        marginBottom: '20px'
    },
    searchInput: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        boxSizing: 'border-box'
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        color: '#666',
        fontSize: '16px'
    },
    noResults: {
        textAlign: 'center',
        padding: '40px',
        color: '#999',
        fontSize: '16px'
    },
    storesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
    },
    storeCard: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '0',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
    },
    imageSection: {
        position: 'relative',
        width: '100%',
        height: '200px',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #eee'
    },
    storeImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    imagePlaceholder: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6c757d',
        height: '100%'
    },
    placeholderIcon: {
        fontSize: '48px',
        marginBottom: '8px'
    },
    placeholderText: {
        fontSize: '14px',
        fontWeight: '500'
    },
    storeInfo: {
        padding: '20px'
    },
    storeName: {
        margin: '0 0 10px 0',
        color: '#333',
        fontSize: '18px'
    },
    storeAddress: {
        margin: '0 0 15px 0',
        color: '#666',
        fontSize: '14px'
    },
    ratingSection: {
        borderTop: '1px solid #eee',
        paddingTop: '15px'
    },
    overallRating: {
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    userRating: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    starContainer: {
        display: 'flex',
        gap: '2px'
    },
    star: {
        fontSize: '18px',
        userSelect: 'none'
    },
    ratingNumber: {
        fontSize: '14px',
        color: '#666'
    },
    rateBtn: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    modal: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
    },
    ratingModalSection: {
        margin: '20px 0',
        textAlign: 'center'
    },
    modalActions: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
        marginTop: '20px'
    },
    submitBtn: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    cancelBtn: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    ratingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px'
    },
    deleteRatingBtn: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    formGroup: {
        marginBottom: '20px'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        boxSizing: 'border-box',
        marginTop: '5px'
    }
};

export default UserDashboard;