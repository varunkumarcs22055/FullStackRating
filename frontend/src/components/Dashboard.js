import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../services/authService';
import AdminDashboard from './dashboards/AdminDashboard';
import UserDashboard from './dashboards/UserDashboard';
import StoreOwnerDashboard from './dashboards/StoreOwnerDashboard';

const Dashboard = () => {
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
            history.push('/login');
            return;
        }

        const role = authService.getUserRole();
        setUserRole(role);
        setLoading(false);
    }, [history]);

    const handleLogout = () => {
        authService.logout();
        history.push('/login');
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    const renderRoleSpecificContent = () => {
        console.log('Rendering dashboard for role:', userRole);
        switch (userRole) {
            case 'admin':
                return (
                    <AdminDashboard onLogout={handleLogout} />
                );
            case 'store_owner':
                return (
                    <StoreOwnerDashboard onLogout={handleLogout} />
                );
            case 'user':
            default:
                return (
                    <UserDashboard onLogout={handleLogout} />
                );
        }
    };

    return (
        <div style={styles.container}>
            {renderRoleSpecificContent()}
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
    }
};

export default Dashboard;