import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/auth/check-auth`, {
          withCredentials: true,
        });
        if (authResponse.data.authenticated) {
          setIsLoggedIn(true);
          const profileResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users/profile`, {
            withCredentials: true,
          });
          setUserData(profileResponse.data);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching user data', error);
        setError('Failed to fetch user data');
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, isLoggedIn, loading, error, setUserData, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
