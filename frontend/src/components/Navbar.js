import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/images/logo.svg';

function Navbar() {
  const { authState } = useContext(AuthContext);
  const { isLoggedIn, user } = authState;
 
  return (
    <nav className="flex justify-between items-center p-4 px-12 bg-gradient-sky-blue text-white shadow-md">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="ListEase Logo" className="h-10" />
        </Link>
      </div>
      <div className="flex items-center space-x-10">
        <Link
          to="/"
          className="text-lg font-semibold hover:text-misty-blue transition-transform duration-300 transform hover:scale-105 hover:bg-opacity-50 px-3 py-2 rounded"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-lg font-semibold hover:text-misty-blue transition-transform duration-300 transform hover:scale-105 hover:bg-opacity-50 px-3 py-2 rounded"
        >
          About Us
        </Link>
        {isLoggedIn ? (
          <Link
            to="/account/profile"
            className="flex items-center space-x-2 text-lg font-semibold hover:text-misty-blue transition-transform duration-300 transform hover:scale-105 hover:bg-opacity-50 px-3 py-2 rounded"
          >
            <img
              src={user?.profilePicture
                ? `${process.env.REACT_APP_BASE_URL}/${user.profilePicture}`
                : `${process.env.REACT_APP_BASE_URL}/uploads/profile-pictures/default-profile.png`}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>{user?.username}</span>
          </Link>
        ) : (
          <>
            <Link
              to="/signin"
              className="text-lg font-semibold hover:text-misty-blue transition-transform duration-300 transform hover:scale-105 hover:bg-opacity-50 px-3 py-2 rounded"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-lg font-semibold hover:text-misty-blue transition-transform duration-300 transform hover:scale-105 hover:bg-opacity-50 px-3 py-2 rounded"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
