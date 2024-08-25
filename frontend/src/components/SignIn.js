// src/components/SignIn.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import logo from '../assets/images/logo.svg'; // Import your logo if needed

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAuthState } = useContext(AuthContext); // Access setAuthState to update context
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/signin`,
        { username, password },
        { withCredentials: true }
      );

      // Update the context with the logged-in user data
      setAuthState({
        isLoggedIn: true,
        user: response.data.user, // Assuming the response contains user data
      });
      // Navigate to the homepage
      navigate('/');
    } catch (err) {
      // Update the error state with the error message from the server
      setError(err.response?.data?.message || 'Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-300"
        />
        <button
          onClick={handleSignIn}
          className="w-full bg-gray-800 text-white p-3 rounded-lg shadow-lg hover:bg-gray-700 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          Sign In
        </button>
        <p className="text-gray-600 mt-4 text-center">
          Don't have an account?{' '}
          <Link to='/signup' className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
