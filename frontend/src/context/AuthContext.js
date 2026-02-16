import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Check if user is logged in on mount
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('https://my-portfolio-hxer.onrender.com/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, name) => {
    const response = await axios.post('https://my-portfolio-hxer.onrender.com/api/auth/register', {
      email,
      password,
      name,
    });
    
    if (response.data.success) {
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
    }
    
    return response.data;
  };

  const signIn = async (email, password) => {
    const response = await axios.post('https://my-portfolio-hxer.onrender.com/api/auth/login', {
      email,
      password,
    });
    
    if (response.data.success) {
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
    }
    
    return response.data;
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email) => {
    const response = await axios.post('https://my-portfolio-hxer.onrender.com/api/auth/forgot-password', {
      email,
    });
    return response.data;
  };

  const verifyOTP = async (email, otp) => {
    const response = await axios.post('https://my-portfolio-hxer.onrender.com/api/auth/verify-otp', {
      email,
      otp,
    });
    return response.data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const response = await axios.post('https://my-portfolio-hxer.onrender.com/api/auth/reset-password', {
      email,
      otp,
      newPassword,
    });
    return response.data;
  };

  const value = {
    user,
    token,
    loading,
    signUp,
    signIn,
    signOut,
    forgotPassword,
    verifyOTP,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
