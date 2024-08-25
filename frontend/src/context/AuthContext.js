// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context for authentication
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: {
      id: null,
      username: null,
      profilePicture: null,
      email: null,
      // add more fields as needed
    },
  });

  // Fetch the authentication status and user profile
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/auth/check-auth`, {
          withCredentials: true,
        });

        if (authResponse.data.authenticated) {
          const profileResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users/profile`, {
            withCredentials: true,
          });
          // Destructure the user details from the response
          const { id, username, profilePicture, email } = profileResponse.data;

          // Update the auth state with user details
          setAuthState({
            isLoggedIn: true,
            user: {
              id,
              username,
              profilePicture,
              email,
              // add more fields as needed
            },
          });
        } else {
          setAuthState({
            isLoggedIn: false,
            user: {
              id: null,
              username: null,
              profilePicture: null,
              email: null,
              // reset other fields as well
            },
          });
        }
      } catch (error) {
        console.error('Error checking authentication status or fetching user profile', error);
        setAuthState({
          isLoggedIn: false,
          user: {
            id: null,
            username: null,
            profilePicture: null,
            email: null,
            // reset other fields as well
          },
        });
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
