// client/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // <-- IMPORT THE DECODER

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    user: null, // <-- This will store user info like id and role
  });

  // This effect runs on app startup to check for an existing token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // We get the user payload we created on the server
        setAuth({
          token: token,
          isAuthenticated: true,
          user: decodedUser.user,
        });
      } catch (error) {
        // Handle invalid token case
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Updated login function
  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setAuth({
      token: token,
      isAuthenticated: true,
      user: decodedUser.user,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      token: null,
      isAuthenticated: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };