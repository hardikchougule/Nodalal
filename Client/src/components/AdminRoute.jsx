// client/src/components/AdminRoute.jsx

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const AdminRoute = () => {
  const { auth } = useContext(AuthContext);

  // Check if the user is authenticated and is an admin
  const isAdmin = auth.isAuthenticated && auth.user?.role === 'admin';

  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;