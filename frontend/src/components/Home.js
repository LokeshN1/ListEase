import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [listId, setListId] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/auth/check-auth`, {
          withCredentials: true,
        });
        if (response.data.authenticated) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking authentication status', error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleSearch = async () => {
    if (listId.trim()) {
      try {
        const response = await axios.get(`http://localhost:5000/api/lists/${listId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log(response.data);
        navigate(`/list/${listId}`);
      } catch (err) {
        setError('List not found or you do not have access');
      }
    } else {
      alert("Please enter a valid list ID.");
    }
  };

  return (
    <div className="bg-gradient-dark min-h-screen flex flex-col items-center text-center py-12 px-4">
      <div className="w-full max-w-4xl bg-primary text-jet-black p-8 rounded-lg shadow-lg mb-12 transition-transform transform hover:scale-105 hover:shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to ListEase</h1>
        <p className="text-lg mb-6">Effortlessly manage your lists with ease and efficiency.</p>
        <div className="flex mb-6 max-w-md mx-auto">
          <input 
            type="text" 
            className="flex-1 p-3 border border-pewter rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
            placeholder="Enter List ID" 
            value={listId} 
            onChange={(e) => setListId(e.target.value)} 
          />
          <button 
            className="bg-accent text-white px-6 rounded-r-lg shadow-lg hover:bg-misty-blue-dark transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent"
            onClick={handleSearch}
          >
            Enter
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isLoggedIn && (
          <div className="w-full max-w-md mx-auto mt-8">
            <NavLink 
              to="/my-lists" 
              className="bg-secondary text-jet-black p-3 rounded-lg shadow-lg hover:bg-misty-blue-dark transition-all duration-300 transform hover:scale-105"
            >
              My Lists
            </NavLink>
          </div>
        )}
      </div>
      
      <div className="w-full max-w-4xl mb-12">
        <h2 className="text-3xl font-bold mb-8 text-white text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative bg-pewter p-6 rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 group">
            <div className="absolute inset-0 bg-gradient-custom opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-8">
              <p className="text-white text-center text-lg font-medium">Create and manage your lists with a simple and intuitive interface.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <svg className="w-16 h-16 text-jet-black mb-4 group-hover:hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-semibold text-jet-black mb-2 group-hover:hidden">Easy to Use</h3>
            </div>
          </div>
          <div className="relative bg-pewter p-6 rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 group">
            <div className="absolute inset-0 bg-gradient-custom opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-8">
              <p className="text-white text-center text-lg font-medium">Your data is safe and secure with our top-notch security measures.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <svg className="w-16 h-16 text-jet-black mb-4 group-hover:hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <h3 className="text-xl font-semibold text-jet-black mb-2 group-hover:hidden">Secure</h3>
            </div>
          </div>
          <div className="relative bg-pewter p-6 rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 group">
            <div className="absolute inset-0 bg-gradient-custom opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-8">
              <p className="text-white text-center text-lg font-medium">Access your lists from any device, anywhere in the world.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <svg className="w-16 h-16 text-jet-black mb-4 group-hover:hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3V3z" />
              </svg>
              <h3 className="text-xl font-semibold text-jet-black mb-2 group-hover:hidden">Accessible Anywhere</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mb-12">
        <h2 className="text-3xl font-bold mb-8 text-white">User Testimonials</h2>
        <div className="flex flex-col space-y-6">
          <div className="relative bg-pewter p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-blue to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
            <p className="relative z-10 text-jet-black text-lg font-medium">
              "ListEase has transformed the way I manage my tasks. Highly recommend!" - User A
            </p>
          </div>
          <div className="relative bg-pewter p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-blue to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
            <p className="relative z-10 text-jet-black text-lg font-medium">
              "A fantastic tool for staying organized. I love it!" - User B
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
