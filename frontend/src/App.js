import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import authService from './services/authService';

// Protected Route Component
const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (!authService.isAuthenticated()) {
        return <Redirect to="/login" />;
      }

      if (allowedRoles && allowedRoles.length > 0) {
        const userRole = authService.getUserRole();
        if (!allowedRoles.includes(userRole)) {
          return <Redirect to="/dashboard" />;
        }
      }

      return <Component {...props} />;
    }}
  />
);

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      !authService.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/dashboard" />
      )
    }
  />
);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple loading simulation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <ErrorBoundary>
          <Switch>
            <PublicRoute path="/login" component={Login} />
            <PublicRoute path="/signup" component={Signup} />
            <ProtectedRoute path="/dashboard" component={Dashboard} />
            <ProtectedRoute path="/admin/dashboard" component={Dashboard} allowedRoles={['admin']} />
            <ProtectedRoute path="/store/dashboard" component={Dashboard} allowedRoles={['store_owner']} />
            <Route exact path="/">
              {authService.isAuthenticated() ? (
                <Redirect to="/dashboard" />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="*">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px' 
              }}>
                Page Not Found
              </div>
            </Route>
          </Switch>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;