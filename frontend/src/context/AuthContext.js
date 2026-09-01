import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Helper to set default headers for Axios
  const setAuthHeader = (authToken) => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Initialize: Load user details if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        setAuthHeader(storedToken);
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error('Session expired or token invalid.', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Theme switcher state and storage
  const [theme, setTheme] = useState(localStorage.getItem('reloop-theme') || 'theme-light');

  // Update theme class dynamically on document.body
  useEffect(() => {
    const themeClasses = ['theme-light', 'theme-dark-cyber', 'theme-sunset', 'theme-forest', 'theme-synthwave', 'theme-ocean'];
    themeClasses.forEach(cls => document.body.classList.remove(cls));
    document.body.classList.add(theme);
    localStorage.setItem('reloop-theme', theme);
  }, [theme]);

  // Update body theme class dynamically based on activeMode
  useEffect(() => {
    if (user && user.activeMode === 'PROVIDER') {
      document.body.classList.add('provider-mode-theme');
    } else {
      document.body.classList.remove('provider-mode-theme');
    }
  }, [user]);

  // Toast notifications state
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const showToast = (message, variant = 'success') => {
    setToast({ show: true, message, variant });
  };
  const hideToast = () => setToast(prev => ({ ...prev, show: false }));

  // Login handler
  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    const { token: returnedToken, user: returnedUser } = res.data;
    
    localStorage.setItem('token', returnedToken);
    setToken(returnedToken);
    setUser(returnedUser);
    setAuthHeader(returnedToken);
    
    showToast(`Welcome back, ${returnedUser.name}!`, 'success');
    return returnedUser;
  };

  // Register handler (accepts FormData for avatar uploads)
  const register = async (formData) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const { token: returnedToken, user: returnedUser } = res.data;

    localStorage.setItem('token', returnedToken);
    setToken(returnedToken);
    setUser(returnedUser);
    setAuthHeader(returnedToken);

    showToast('Registration successful! Welcome to ReLoop.', 'success');
    return returnedUser;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setAuthHeader(null);
    showToast('Logged out successfully.', 'info');
  };

  // Switch between EXPLORER and PROVIDER modes
  const switchMode = async () => {
    if (!token) return;
    try {
      const res = await axios.put('http://localhost:5000/api/auth/switch-mode');
      const updatedUser = res.data.user;
      
      setUser(prev => ({
        ...prev,
        activeMode: updatedUser.activeMode
      }));
      
      showToast(`Switched to ${updatedUser.activeMode === 'PROVIDER' ? 'Provider Mode 🛠️' : 'Explorer Mode 🔍'}`, 'success');
      return updatedUser.activeMode;
    } catch (err) {
      console.error('Error toggling profile mode:', err);
      showToast('Error switching active mode.', 'danger');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      switchMode,
      toast,
      showToast,
      hideToast,
      theme,
      setTheme
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
