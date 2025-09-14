import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login(formData);
            
            // Redirect based on role
            switch (response.role) {
                case 'admin':
                    history.push('/admin/dashboard');
                    break;
                case 'store_owner':
                    history.push('/store/dashboard');
                    break;
                case 'user':
                default:
                    history.push('/dashboard');
                    break;
            }
        } catch (err) {
            setErrors({ 
                submit: err.error || 'Login failed. Please check your credentials.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Sign in to your account</p>
                
                {errors.submit && (
                    <div style={styles.errorAlert}>
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                ...(errors.email ? styles.inputError : {})
                            }}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <span style={styles.errorText}>{errors.email}</span>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                ...(errors.password ? styles.inputError : {})
                            }}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <span style={styles.errorText}>{errors.password}</span>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {})
                        }}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p style={styles.linkText}>
                    Don't have an account? 
                    <Link to="/signup" style={styles.link}> Sign Up</Link>
                </p>

                <div style={styles.demoSection}>
                    <h4 style={styles.demoTitle}>📋 Complete Database Information (for testing):</h4>
                    
                    <div style={styles.demoSubSection}>
                        <h5 style={styles.demoSubTitle}>👥 ALL USERS & LOGIN CREDENTIALS:</h5>
                        <div style={styles.demoAccounts}>
                            <div style={styles.demoAccount}>
                                <strong>👨‍💼 ADMIN:</strong> admin@demo.com | Password: Password123!
                                <span style={styles.roleTag}>Full System Admin Access</span>
                            </div>
                            <div style={styles.demoAccount}>
                                <strong>👤 USER 1:</strong> test@example.com | Password: Password123!
                                <span style={styles.roleTag}>Regular User Access</span>
                            </div>
                            <div style={styles.demoAccount}>
                                <strong>👤 USER 2:</strong> test@test.com | Password: Password123!
                                <span style={styles.roleTag}>Regular User Access</span>
                            </div>
                            <div style={styles.demoAccount}>
                                <strong>👤 USER 3:</strong> varun@kkk.com | Password: Password123!
                                <span style={styles.roleTag}>Regular User Access</span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.demoSubSection}>
                        <h5 style={styles.demoSubTitle}>🏪 ALL STORE OWNERS & THEIR STORES:</h5>
                        <div style={styles.storeOwnersList}>
                            <div style={styles.storeOwnerItem}>
                                <strong>1. Tech Electronics:</strong> owner.tech@techworld.com | Password: Password123!
                                <span style={styles.storeTag}>Tech World Electronics</span>
                            </div>
                            <div style={styles.storeOwnerItem}>
                                <strong>2. Fashion Store:</strong> owner.fashion@fashioncentral.com | Password: Password123!
                                <span style={styles.storeTag}>Fashion Central</span>
                            </div>
                            <div style={styles.storeOwnerItem}>
                                <strong>3. Book Store:</strong> owner.books@bookhaven.com | Password: Password123!
                                <span style={styles.storeTag}>Book Haven</span>
                            </div>
                            <div style={styles.storeOwnerItem}>
                                <strong>4. Food Store:</strong> owner.food@foodparadise.com | Password: Password123!
                                <span style={styles.storeTag}>Food Paradise</span>
                            </div>
                            <div style={styles.storeOwnerItem}>
                                <strong>5. Sports Store:</strong> owner.sports@sportszone.com | Password: Password123!
                                <span style={styles.storeTag}>Sports Zone</span>
                            </div>
                            <div style={styles.storeOwnerItem}>
                                <strong>6. Home Store:</strong> owner.home@homeandgarden.com | Password: Password123!
                                <span style={styles.storeTag}>Home & Garden</span>
                            </div>
                            <div style={styles.storeOwnerItem}>
                                <strong>7. Music Store:</strong> owner.music@musicstore.com | Password: Password123!
                                <span style={styles.storeTag}>Music Store</span>
                            </div>
                            <div style={styles.storeOwnerItem}>
                                <strong>8. Auto Store:</strong> owner.auto@autopartsplus.com | Password: Password123!
                                <span style={styles.storeTag}>Auto Parts Plus</span>
                            </div>
                            <div style={styles.storeOwnerItem}>
                                <strong>9. Pet Store:</strong> owner.pets@petworld.com | Password: Password123!
                                <span style={styles.storeTag}>Pet World</span>
                            </div>
                            <div style={styles.storeOwnerItem}>
                                <strong>10. Beauty Store:</strong> owner.beauty@beautysalon.com | Password: Password123!
                                <span style={styles.storeTag}>Beauty Salon</span>
                            </div>
                            <div style={styles.storeOwnerItem}>
                                <strong>11. Coffee Store:</strong> owner.coffee@coffeecorner.com | Password: Password123!
                                <span style={styles.storeTag}>Coffee Corner</span>
                            </div>
                            <div style={styles.storeOwnerItem}>
                                <strong>12. Pharmacy Store:</strong> owner.pharmacy@pharmacyplus.com | Password: Password123!
                                <span style={styles.storeTag}>Pharmacy Plus</span>
                            </div>
                            <div style={styles.storeOwnerItem}>
                                <strong>13. Original Owner:</strong> owner@demo.com | Password: Password123!
                                <span style={styles.storeTag}>Legacy Account</span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.demoStats}>
                        <strong>💾 Database Summary: 17 Total Users (1 Admin + 3 Users + 13 Store Owners) | 12 Stores | 6 Ratings</strong>
                        <br />
                        <small>Each store now has its own dedicated owner with unique login credentials!</small>
                    </div>
                    <div style={styles.quickLogin}>
                        <h5 style={styles.quickLoginTitle}>🚀 Quick Login Buttons:</h5>
                        <div style={styles.quickLoginButtons}>
                            <button 
                                type="button"
                                style={styles.quickButton}
                                onClick={() => setFormData({email: 'admin@demo.com', password: 'Password123!'})}
                            >
                                Login as Admin
                            </button>
                            <button 
                                type="button"
                                style={styles.quickButton}
                                onClick={() => setFormData({email: 'owner.tech@techworld.com', password: 'Password123!'})}
                            >
                                Tech Store Owner
                            </button>
                            <button 
                                type="button"
                                style={styles.quickButton}
                                onClick={() => setFormData({email: 'owner.fashion@fashioncentral.com', password: 'Password123!'})}
                            >
                                Fashion Store Owner
                            </button>
                            <button 
                                type="button"
                                style={styles.quickButton}
                                onClick={() => setFormData({email: 'owner.books@bookhaven.com', password: 'Password123!'})}
                            >
                                Book Store Owner
                            </button>
                            <button 
                                type="button"
                                style={styles.quickButton}
                                onClick={() => setFormData({email: 'owner.food@foodparadise.com', password: 'Password123!'})}
                            >
                                Food Store Owner
                            </button>
                            <button 
                                type="button"
                                style={styles.quickButton}
                                onClick={() => setFormData({email: 'test@example.com', password: 'Password123!'})}
                            >
                                Login as User
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px'
    },
    formContainer: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
    },
    title: {
        textAlign: 'center',
        marginBottom: '10px',
        color: '#333',
        fontSize: '28px'
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#666',
        fontSize: '16px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    inputGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#333',
        fontSize: '14px',
        fontWeight: '500'
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        transition: 'border-color 0.3s',
        boxSizing: 'border-box'
    },
    inputError: {
        borderColor: '#e74c3c'
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        cursor: 'not-allowed'
    },
    errorText: {
        color: '#e74c3c',
        fontSize: '14px',
        marginTop: '5px',
        display: 'block'
    },
    errorAlert: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb'
    },
    linkText: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#666'
    },
    link: {
        color: '#007bff',
        textDecoration: 'none'
    },
    demoSection: {
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
    },
    demoTitle: {
        margin: '0 0 15px 0',
        color: '#495057',
        fontSize: '16px',
        fontWeight: 'bold'
    },
    demoAccounts: {
        fontSize: '13px',
        lineHeight: '1.6',
        marginBottom: '15px'
    },
    demoAccount: {
        marginBottom: '8px',
        color: '#495057',
        padding: '8px',
        backgroundColor: 'white',
        borderRadius: '4px',
        border: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    roleTag: {
        fontSize: '11px',
        padding: '2px 8px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '12px',
        fontWeight: 'normal'
    },
    demoStats: {
        textAlign: 'center',
        color: '#6c757d',
        marginBottom: '15px',
        padding: '12px',
        backgroundColor: 'white',
        borderRadius: '4px',
        border: '1px solid #dee2e6',
        fontSize: '14px'
    },
    demoSubSection: {
        marginBottom: '20px'
    },
    demoSubTitle: {
        margin: '0 0 10px 0',
        color: '#495057',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    storesList: {
        fontSize: '12px',
        lineHeight: '1.4',
        maxHeight: '200px',
        overflowY: 'auto',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        backgroundColor: 'white',
        padding: '10px'
    },
    storeItem: {
        marginBottom: '4px',
        color: '#495057',
        padding: '4px 8px',
        borderRadius: '3px',
        backgroundColor: '#f8f9fa'
    },
    quickLogin: {
        marginTop: '15px'
    },
    quickLoginTitle: {
        margin: '0 0 10px 0',
        color: '#495057',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    quickLoginButtons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    quickButton: {
        padding: '8px 12px',
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    }
};

export default Login;