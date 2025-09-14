import React from 'react';

const TestUserDashboard = ({ onLogout }) => {
    console.log('TestUserDashboard is rendering');
    
    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
            }}>
                <h1>Test User Dashboard</h1>
                <p>This is a simplified dashboard to test if the component is rendering properly.</p>
                <button 
                    onClick={onLogout}
                    style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default TestUserDashboard;