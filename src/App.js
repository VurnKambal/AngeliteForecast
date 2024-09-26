import React, { lazy, useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { themeChange } from 'theme-change'
import checkAuth from './app/auth';
import initializeApp from './app/init';
import { useSelector } from 'react-redux';

// Create a wrapper component for unauthenticated routes
const UnauthenticatedRoute = ({ children }) => {
  const authStatus = useSelector(state => state.auth.userLoggedIn);
  
  if (authStatus) {
    return <Navigate to="/app/welcome" replace />;
  }
  
  return children;
};

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


function App() {
  useEffect(() => {
    // Set initial theme to mytheme
    localStorage.setItem('theme', 'mytheme');
    // Initialize daisy UI themes
    themeChange(false);
  }, [])


  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={
            <UnauthenticatedRoute>
              <Login />
            </UnauthenticatedRoute>
          } />
          <Route path="/forgot-password" element={
            <UnauthenticatedRoute>
              <ForgotPassword />
            </UnauthenticatedRoute>
          } />
          <Route path="/register" element={
            <UnauthenticatedRoute>
              <Register />
            </UnauthenticatedRoute>
          } />
          
          {/* Place new routes over this */}
          <Route path="/app/*" element={<Layout />} />

          <Route path="*" element={<Navigate to={token ? "/app/welcome" : "/login"} replace />}/>

        </Routes>
      </Router>
    </>
  )
}

export default App
