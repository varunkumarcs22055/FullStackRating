import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import authService from '../services/authService';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
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

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

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
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
            const { confirmPassword, ...signupData } = formData;
            const response = await authService.signup(signupData);
            
            // Redirect based on role
            if (response.role === 'user') {
                history.push('/dashboard');
            } else if (response.role === 'store_owner') {
                history.push('/dashboard');
            } else {
                history.push('/dashboard');
            }
        } catch (err) {
            setErrors({ 
                submit: err.error || 'Signup failed. Please try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Join our platform today</p>
                
                {errors.submit && (
                    <div style={styles.errorAlert}>
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                ...(errors.name ? styles.inputError : {})
                            }}
                            placeholder="Enter your full name"
                        />
                        {errors.name && (
                            <span style={styles.errorText}>{errors.name}</span>
                        )}
                    </div>

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
                            placeholder="Create a strong password"
                        />
                        {errors.password && (
                            <span style={styles.errorText}>{errors.password}</span>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                ...(errors.confirmPassword ? styles.inputError : {})
                            }}
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && (
                            <span style={styles.errorText}>{errors.confirmPassword}</span>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Account Type</label>
                        <select 
                            name="role" 
                            value={formData.role} 
                            onChange={handleChange}
                            style={styles.select}
                        >
                            <option value="user">User</option>
                            <option value="store_owner">Store Owner</option>
                        </select>
                    </div>                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {})
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={styles.linkText}>
                    Already have an account? 
                    <Link to="/login" style={styles.link}> Sign In</Link>
                </p>
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
    select: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        backgroundColor: 'white',
        boxSizing: 'border-box'
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
    }
};

export default Signup;