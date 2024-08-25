import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <Element {...rest} />;
};

export default ProtectedRoute;
