import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const AdminDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0
    });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filterRole, setFilterRole] = useState('');
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showAddStoreModal, setShowAddStoreModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        address: ''
    });
    const [newStore, setNewStore] = useState({
        name: '',
        email: '',
        address: '',
        owner_id: ''
    });
    const [storeOwners, setStoreOwners] = useState([]);
    const [refreshInterval, setRefreshInterval] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const history = useHistory();

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchStores();
        fetchStoreOwners();
        
        // Set up auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchStats();
            fetchUsers();
            fetchStores();
            setLastRefresh(new Date());
        }, 30000);
        
        setRefreshInterval(interval);
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, []);

    // Manual refresh function
    const handleRefresh = async () => {
        setLoading(true);
        await Promise.all([
            fetchStats(),
            fetchUsers(),
            fetchStores(),
            fetchStoreOwners()
        ]);
        setLastRefresh(new Date());
        setLoading(false);
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Fetch user stats
            const userResponse = await fetch('http://localhost:5000/api/users/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const userData = await userResponse.json();
            
            // Fetch rating stats
            const ratingResponse = await fetch('http://localhost:5000/api/ratings/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const ratingData = await ratingResponse.json();
            
            // Fetch stores to count
            const storeResponse = await fetch('http://localhost:5000/api/stores', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const storeData = await storeResponse.json();

            setStats({
                totalUsers: userData.stats?.total_users || 0,
                totalStores: storeData.stores?.length || 0,
                totalRatings: ratingData.stats?.total_ratings || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStores = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/stores', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (data.success) {
                setStores(data.stores);
            }
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    const fetchStoreOwners = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (data.success) {
                const owners = data.users.filter(user => 
                    user.role === 'store_owner' || user.role === 'admin'
                );
                setStoreOwners(owners);
            }
        } catch (error) {
            console.error('Error fetching store owners:', error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newUser)
            });
            
            const data = await response.json();
            
            if (data.success) {
                setShowAddUserModal(false);
                setNewUser({ name: '', email: '', password: '', role: 'user', address: '' });
                fetchUsers();
                fetchStats();
                alert('User created successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating user');
        }
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/stores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newStore)
            });
            
            const data = await response.json();
            
            if (data.success) {
                setShowAddStoreModal(false);
                setNewStore({ name: '', email: '', address: '', owner_id: '' });
                fetchStores();
                fetchStats();
                alert('Store created successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error creating store:', error);
            alert('Error creating store');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await response.json();
            
            if (data.success) {
                fetchUsers();
                fetchStats();
                alert('User deleted successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = filterRole === '' || user.role === filterRole;
        
        return matchesSearch && matchesRole;
    });

    const filteredStores = stores.filter(store =>
        store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting function
    const sortData = (data, key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });

        return [...data].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];

            // Handle special cases
            if (key === 'average_rating' || key === 'store_average_rating') {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            } else if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return ' ↕️';
        return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    const sortedUsers = sortConfig.key && filteredUsers.length > 0 ? 
        sortData(filteredUsers, sortConfig.key) : filteredUsers;

    const sortedStores = sortConfig.key && filteredStores.length > 0 ? 
        sortData(filteredStores, sortConfig.key) : filteredStores;

    const renderOverview = () => {
        const usersByRole = users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {});

        const storesWithRatings = stores.filter(store => store.average_rating > 0).length;
        const avgStoreRating = stores.length > 0 ? 
            stores.reduce((sum, store) => sum + (parseFloat(store.average_rating) || 0), 0) / stores.length : 0;

        return (
            <div style={styles.overview}>
                <h2>System Overview</h2>
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                        <div style={styles.statBreakdown}>
                            <small>👤 Users: {usersByRole.user || 0}</small>
                            <small>🏪 Store Owners: {usersByRole.store_owner || 0}</small>
                            <small>👨‍💼 Admins: {usersByRole.admin || 0}</small>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <h3>{stats.totalStores}</h3>
                        <p>Total Stores</p>
                        <div style={styles.statBreakdown}>
                            <small>⭐ With Ratings: {storesWithRatings}</small>
                            <small>📊 Avg Rating: {avgStoreRating.toFixed(1)}</small>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <h3>{stats.totalRatings}</h3>
                        <p>Total Ratings</p>
                        <div style={styles.statBreakdown}>
                            <small>📈 Per Store: {stats.totalStores > 0 ? (stats.totalRatings / stats.totalStores).toFixed(1) : '0'}</small>
                            <small>📅 Today: 0</small>
                        </div>
                    </div>
                </div>

                <div style={styles.quickActions}>
                    <h3>Quick Actions</h3>
                    <div style={styles.quickActionButtons}>
                        <button 
                            style={styles.quickActionButton}
                            onClick={() => setActiveTab('users')}
                        >
                            👥 Manage Users ({stats.totalUsers})
                        </button>
                        <button 
                            style={styles.quickActionButton}
                            onClick={() => setActiveTab('stores')}
                        >
                            🏪 Manage Stores ({stats.totalStores})
                        </button>
                        <button 
                            style={styles.quickActionButton}
                            onClick={() => setShowAddUserModal(true)}
                        >
                            ➕ Add New User
                        </button>
                        <button 
                            style={styles.quickActionButton}
                            onClick={() => setShowAddStoreModal(true)}
                        >
                            ➕ Add New Store
                        </button>
                    </div>
                </div>

                <div style={styles.recentActivity}>
                    <h3>System Health</h3>
                    <div style={styles.healthIndicators}>
                        <div style={styles.healthItem}>
                            <span style={styles.healthStatus}>🟢</span>
                            <span>Database Connection: Active</span>
                        </div>
                        <div style={styles.healthItem}>
                            <span style={styles.healthStatus}>🟢</span>
                            <span>User Registration: Enabled</span>
                        </div>
                        <div style={styles.healthItem}>
                            <span style={styles.healthStatus}>🟢</span>
                            <span>Rating System: Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderUsers = () => (
        <div style={styles.section}>
            <div style={styles.sectionHeader}>
                <h2>User Management ({users.length} total)</h2>
                <button 
                    style={styles.addButton}
                    onClick={() => setShowAddUserModal(true)}
                >
                    Add New User
                </button>
            </div>
            
            <div style={styles.filtersContainer}>
                <div style={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Search users by name, email, address, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                <div style={styles.filterBox}>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="">All Roles</option>
                        <option value="user">User</option>
                        <option value="store_owner">Store Owner</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <div style={styles.tableContainer}>
                <div style={styles.tableInfo}>
                    Showing {sortedUsers.length} of {users.length} users
                    {loading && <span style={styles.loadingIndicator}> (Updating...)</span>}
                </div>
                <table style={styles.table} className="admin-table">
                    <thead>
                        <tr>
                            <th style={styles.sortableHeader} onClick={() => setSortConfig(sortData(sortedUsers, 'name'))}>
                                Name{getSortIcon('name')}
                            </th>
                            <th style={styles.sortableHeader} onClick={() => setSortConfig(sortData(sortedUsers, 'email'))}>
                                Email{getSortIcon('email')}
                            </th>
                            <th style={styles.sortableHeader} onClick={() => setSortConfig(sortData(sortedUsers, 'role'))}>
                                Role{getSortIcon('role')}
                            </th>
                            <th style={styles.sortableHeader} onClick={() => setSortConfig(sortData(sortedUsers, 'address'))}>
                                Address{getSortIcon('address')}
                            </th>
                            <th style={styles.sortableHeader} onClick={() => setSortConfig(sortData(sortedUsers, 'store_average_rating'))}>
                                Store Rating{getSortIcon('store_average_rating')}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div style={styles.userInfo}>
                                        <strong>{user.name}</strong>
                                        <small style={styles.userId}>ID: {user.id}</small>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span style={{
                                        ...styles.roleBadge,
                                        backgroundColor: user.role === 'admin' ? '#dc3545' : 
                                                       user.role === 'store_owner' ? '#007bff' : '#28a745'
                                    }}>
                                        {user.role.replace('_', ' ').toUpperCase()}
                                    </span>
                                </td>
                                <td title={user.address}>{user.address || 'N/A'}</td>
                                <td>
                                    {user.role === 'store_owner' && user.store_average_rating ? 
                                        <span style={styles.ratingDisplay}>
                                            ⭐ {parseFloat(user.store_average_rating).toFixed(1)}
                                        </span> : 
                                        <span style={styles.noRating}>N/A</span>
                                    }
                                </td>
                                <td>
                                    <div style={styles.actionButtons}>
                                        <button 
                                            style={styles.viewButton}
                                            onClick={() => window.alert(`User Details:\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nAddress: ${user.address || 'N/A'}\nCreated: ${new Date(user.created_at).toLocaleDateString()}`)}
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button 
                                            style={styles.deleteButton}
                                            onClick={() => handleDeleteUser(user.id)}
                                            title="Delete User"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {sortedUsers.length === 0 && (
                    <div style={styles.noResults}>
                        No users found matching your filters.
                    </div>
                )}
            </div>
        </div>
    );

    const renderStores = () => (
        <div style={styles.section}>
            <div style={styles.sectionHeader}>
                <h2>Store Management ({stores.length} total)</h2>
                <button 
                    style={styles.addButton}
                    onClick={() => setShowAddStoreModal(true)}
                >
                    Add New Store
                </button>
            </div>
            
            <div style={styles.searchBox}>
                <input
                    type="text"
                    placeholder="Search stores by name, email, address, or owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            <div style={styles.tableContainer}>
                <div style={styles.tableInfo}>
                    Showing {sortedStores.length} of {stores.length} stores
                    {loading && <span style={styles.loadingIndicator}> (Updating...)</span>}
                </div>
                <table style={styles.table} className="admin-table">
                    <thead>
                        <tr>
                            <th style={styles.sortableHeader} onClick={() => setSortConfig(sortData(sortedStores, 'name'))}>
                                Store Name{getSortIcon('name')}
                            </th>
                            <th style={styles.sortableHeader} onClick={() => setSortConfig(sortData(sortedStores, 'email'))}>
                                Email{getSortIcon('email')}
                            </th>
                            <th style={styles.sortableHeader} onClick={() => setSortConfig(sortData(sortedStores, 'address'))}>
                                Address{getSortIcon('address')}
                            </th>
                            <th style={styles.sortableHeader} onClick={() => setSortConfig(sortData(sortedStores, 'owner_name'))}>
                                Owner{getSortIcon('owner_name')}
                            </th>
                            <th style={styles.sortableHeader} onClick={() => setSortConfig(sortData(sortedStores, 'average_rating'))}>
                                Average Rating{getSortIcon('average_rating')}
                            </th>
                            <th style={styles.sortableHeader} onClick={() => setSortConfig(sortData(sortedStores, 'total_ratings'))}>
                                Total Ratings{getSortIcon('total_ratings')}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStores.map(store => (
                            <tr key={store.id}>
                                <td>
                                    <div style={styles.storeInfo}>
                                        <strong>{store.name}</strong>
                                        <small style={styles.storeId}>ID: {store.id}</small>
                                    </div>
                                </td>
                                <td>{store.email}</td>
                                <td title={store.address}>{store.address}</td>
                                <td>
                                    <div style={styles.ownerInfo}>
                                        <span>{store.owner_name}</span>
                                        {store.owner_email && (
                                            <small style={styles.ownerEmail}>{store.owner_email}</small>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {store.average_rating > 0 ? (
                                        <span style={styles.ratingDisplay}>
                                            ⭐ {parseFloat(store.average_rating).toFixed(1)}
                                        </span>
                                    ) : (
                                        <span style={styles.noRating}>No ratings</span>
                                    )}
                                </td>
                                <td>
                                    <span style={styles.ratingCount}>{store.total_ratings || 0}</span>
                                </td>
                                <td>
                                    <div style={styles.actionButtons}>
                                        <button 
                                            style={styles.viewButton}
                                            onClick={() => window.alert(`Store Details:\nName: ${store.name}\nEmail: ${store.email}\nAddress: ${store.address}\nOwner: ${store.owner_name}\nRating: ${store.average_rating > 0 ? store.average_rating + '/5' : 'No ratings'}\nTotal Ratings: ${store.total_ratings || 0}\nCreated: ${new Date(store.created_at).toLocaleDateString()}`)}
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button 
                                            style={styles.editButton}
                                            onClick={() => window.alert('Edit functionality coming soon!')}
                                            title="Edit Store"
                                        >
                                            ✏️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {sortedStores.length === 0 && (
                    <div style={styles.noResults}>
                        No stores found matching your search.
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1>System Administrator Dashboard</h1>
                    <small style={styles.lastUpdate}>
                        Last updated: {lastRefresh.toLocaleTimeString()} 
                        {loading && <span style={styles.loadingDot}>●</span>}
                    </small>
                </div>
                <div style={styles.headerActions}>
                    <button 
                        style={styles.refreshButton} 
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
                    </button>
                    <button style={styles.logoutButton} onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.tabs}>
                <button 
                    style={{...styles.tab, ...(activeTab === 'overview' ? styles.activeTab : {})}}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    style={{...styles.tab, ...(activeTab === 'users' ? styles.activeTab : {})}}
                    onClick={() => setActiveTab('users')}
                >
                    Manage Users
                </button>
                <button 
                    style={{...styles.tab, ...(activeTab === 'stores' ? styles.activeTab : {})}}
                    onClick={() => setActiveTab('stores')}
                >
                    Manage Stores
                </button>
            </div>

            <div style={styles.content}>
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'stores' && renderStores()}
            </div>

            {/* Add User Modal */}
            {showAddUserModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Add New User</h3>
                        <form onSubmit={handleCreateUser}>
                            <input
                                type="text"
                                placeholder="Name"
                                value={newUser.name}
                                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                style={styles.modalInput}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                style={styles.modalInput}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                style={styles.modalInput}
                                required
                            />
                            <select
                                value={newUser.role}
                                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                style={styles.modalInput}
                                required
                            >
                                <option value="user">User</option>
                                <option value="store_owner">Store Owner</option>
                                <option value="admin">Admin</option>
                            </select>
                            <textarea
                                placeholder="Address"
                                value={newUser.address}
                                onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                                style={styles.modalTextarea}
                            />
                            <div style={styles.modalButtons}>
                                <button type="submit" style={styles.submitButton}>Create User</button>
                                <button 
                                    type="button" 
                                    style={styles.cancelButton}
                                    onClick={() => setShowAddUserModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Store Modal */}
            {showAddStoreModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Add New Store</h3>
                        <form onSubmit={handleCreateStore}>
                            <input
                                type="text"
                                placeholder="Store Name"
                                value={newStore.name}
                                onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                                style={styles.modalInput}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Store Email"
                                value={newStore.email}
                                onChange={(e) => setNewStore({...newStore, email: e.target.value})}
                                style={styles.modalInput}
                                required
                            />
                            <textarea
                                placeholder="Store Address"
                                value={newStore.address}
                                onChange={(e) => setNewStore({...newStore, address: e.target.value})}
                                style={styles.modalTextarea}
                                required
                            />
                            <select
                                value={newStore.owner_id}
                                onChange={(e) => setNewStore({...newStore, owner_id: e.target.value})}
                                style={styles.modalInput}
                                required
                            >
                                <option value="">Select Store Owner</option>
                                {storeOwners.map(owner => (
                                    <option key={owner.id} value={owner.id}>
                                        {owner.name} ({owner.email})
                                    </option>
                                ))}
                            </select>
                            <div style={styles.modalButtons}>
                                <button type="submit" style={styles.submitButton}>Create Store</button>
                                <button 
                                    type="button" 
                                    style={styles.cancelButton}
                                    onClick={() => setShowAddStoreModal(false)}
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
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f9fa'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #eee',
        paddingBottom: '20px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    headerActions: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
    },
    lastUpdate: {
        color: '#666',
        fontSize: '12px',
        marginTop: '4px',
        display: 'block'
    },
    loadingDot: {
        color: '#007bff',
        marginLeft: '8px',
        animation: 'pulse 1s infinite'
    },
    refreshButton: {
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'bold',
        transition: 'background-color 0.2s'
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'background-color 0.2s'
    },
    tabs: {
        display: 'flex',
        borderBottom: '1px solid #ddd',
        marginBottom: '20px',
        backgroundColor: 'white',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    tab: {
        padding: '16px 32px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        borderBottom: '3px solid transparent',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'all 0.2s'
    },
    activeTab: {
        borderBottom: '3px solid #007bff',
        color: '#007bff',
        backgroundColor: '#f8f9fa'
    },
    content: {
        minHeight: '500px',
        backgroundColor: 'white',
        borderRadius: '0 0 8px 8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    overview: {
        padding: '20px 0'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
    },
    statCard: {
        backgroundColor: '#f8f9fa',
        padding: '24px',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    statBreakdown: {
        marginTop: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    quickActions: {
        marginBottom: '30px'
    },
    quickActionButtons: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginTop: '16px'
    },
    quickActionButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '12px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background-color 0.2s'
    },
    recentActivity: {
        marginTop: '20px'
    },
    healthIndicators: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginTop: '16px'
    },
    healthItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px'
    },
    healthStatus: {
        fontSize: '12px'
    },
    section: {
        padding: '20px 0'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '12px',
        borderBottom: '1px solid #eee'
    },
    addButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'background-color 0.2s'
    },
    filtersContainer: {
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap'
    },
    searchBox: {
        flex: 1,
        minWidth: '300px'
    },
    filterBox: {
        minWidth: '150px'
    },
    searchInput: {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box'
    },
    filterSelect: {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        backgroundColor: 'white',
        cursor: 'pointer'
    },
    loadingIndicator: {
        color: '#007bff',
        fontSize: '12px',
        fontStyle: 'italic'
    },
    tableContainer: {
        overflowX: 'auto',
        borderRadius: '8px',
        border: '1px solid #ddd'
    },
    tableInfo: {
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #ddd',
        fontSize: '14px',
        color: '#666',
        fontWeight: '500'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        fontSize: '14px'
    },
    sortableHeader: {
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'background-color 0.2s',
        padding: '12px',
        fontWeight: 'bold',
        backgroundColor: '#f8f9fa',
        borderBottom: '2px solid #dee2e6'
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    userId: {
        color: '#666',
        fontSize: '12px'
    },
    storeInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    storeId: {
        color: '#666',
        fontSize: '12px'
    },
    ownerInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    ownerEmail: {
        color: '#666',
        fontSize: '12px'
    },
    ratingDisplay: {
        color: '#ffc107',
        fontWeight: 'bold'
    },
    ratingCount: {
        backgroundColor: '#e9ecef',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    noRating: {
        color: '#999',
        fontStyle: 'italic'
    },
    actionButtons: {
        display: 'flex',
        gap: '8px'
    },
    viewButton: {
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        padding: '6px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    editButton: {
        backgroundColor: '#ffc107',
        color: 'white',
        border: 'none',
        padding: '6px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    roleBadge: {
        padding: '4px 12px',
        borderRadius: '12px',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '6px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    noResults: {
        textAlign: 'center',
        padding: '40px',
        color: '#666',
        fontSize: '16px',
        backgroundColor: '#f8f9fa'
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        width: '500px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    },
    modalInput: {
        width: '100%',
        padding: '12px 16px',
        margin: '8px 0',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box'
    },
    modalTextarea: {
        width: '100%',
        padding: '12px 16px',
        margin: '8px 0',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        minHeight: '80px',
        resize: 'vertical',
        boxSizing: 'border-box'
    },
    modalButtons: {
        display: 'flex',
        gap: '12px',
        marginTop: '24px'
    },
    submitButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        cursor: 'pointer',
        flex: 1,
        fontSize: '14px',
        fontWeight: 'bold'
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        cursor: 'pointer',
        flex: 1,
        fontSize: '14px',
        fontWeight: 'bold'
    }
};

// Add CSS for table styling
const tableStyles = `
    .admin-table th,
    .admin-table td {
        padding: 12px 16px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        vertical-align: top;
    }
    .admin-table th {
        background-color: #f8f9fa;
        font-weight: bold;
        color: #495057;
        border-bottom: 2px solid #dee2e6;
        position: sticky;
        top: 0;
        z-index: 10;
    }
    .admin-table th:hover {
        background-color: #e9ecef;
    }
    .admin-table tr:hover {
        background-color: #f5f5f5;
    }
    .admin-table tr:nth-child(even) {
        background-color: #f8f9fa;
    }
    .admin-table tr:nth-child(even):hover {
        background-color: #e9ecef;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .admin-table {
            font-size: 12px;
        }
        .admin-table th,
        .admin-table td {
            padding: 8px;
        }
    }
    
    /* Scrollbar styling */
    .admin-table-container::-webkit-scrollbar {
        height: 8px;
    }
    .admin-table-container::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    .admin-table-container::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
    }
    .admin-table-container::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = tableStyles;
    document.head.appendChild(styleSheet);
}

export default AdminDashboard;