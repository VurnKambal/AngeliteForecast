import React, { lazy, useEffect, useState } from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { themeChange } from 'theme-change'
import checkAuth, { checkAdminStatus } from './app/auth';
import initializeApp from './app/init';
import { useSelector } from 'react-redux';
import routes from './routes';
import PageContent from './containers/PageContent';

// Importing pages
const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Register = lazy(() => import('./pages/Register'))
const Documentation = lazy(() => import('./pages/Documentation'))


// Initializing different libraries
initializeApp()


// Check for login and initialize axios
const token = checkAuth()

// Create a wrapper component for unauthenticated routes
const UnauthenticatedRoute = ({ children }) => {
  const authStatus = useSelector(state => token);
  
  if (authStatus) {
    return <Navigate to="/app/welcome" replace />;
  }
  
  return children;
};

function App() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    localStorage.setItem('theme', 'mytheme');
    themeChange(false)
    initializeApp()

    const initializeAuth = async () => {
      const token = await checkAuth()
      if (token) {
        setIsAuthenticated(true)
        const adminStatus = await checkAdminStatus()
        setIsAdmin(adminStatus)
      } else {
        setIsAuthenticated(false)
        setIsAdmin(false)
      }
      setLoading(false)
    }
    initializeAuth()

    // Set up an interval to check auth status periodically
    const authCheckInterval = setInterval(initializeAuth, 60000); // Check every minute

    return () => clearInterval(authCheckInterval);
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/app/welcome" replace />
            ) : (
              <Login />
            )
          } 
        />
        
        {/* Protected routes */}
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              isAuthenticated ? (
                route.adminOnly && !isAdmin ? (
                  <Navigate to="/app/welcome" replace />
                ) : (
                  <route.component />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        ))}
        
        {/* Place new routes over this */}
        <Route path="/app/*" element={isAuthenticated ? <Layout isAdmin={isAdmin} /> : <Navigate to="/login" replace />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/app/welcome" : "/login"} replace />}/>
      </Routes>
    </Router>
  )
}

export default App
