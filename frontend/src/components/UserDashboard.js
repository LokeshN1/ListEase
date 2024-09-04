import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaBook, FaMobileAlt, FaLinkedin, FaGlobe, FaInfoCircle, FaSignOutAlt, FaEdit } from 'react-icons/fa';

function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
          withCredentials: true,
        });
        setUserData(response.data);
      } catch (error) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSignout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/signout`, {}, {
        withCredentials: true,
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  const handleEditToggle = () => {
    navigate('/edit-profile');
  };

  const toggleBioModal = () => {
    setIsBioModalOpen(!isBioModalOpen);
  };

  const handleModalClose = (e) => {
    if (e.target.id === 'modal-overlay') {
      setIsBioModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-lg font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white min-h-screen">
      <div className="w-full max-w-4xl bg-gray-100 shadow-lg rounded-xl p-8 border border-gray-300">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <img
              src={userData.profilePicture ? 
                userData.profilePicture : 
                `${process.env.REACT_APP_BACKEND_URL}/uploads/profile-pictures/default-profile.png`}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="ml-4">
              <h2 className="text-2xl font-semibold text-gray-800">{`${userData.firstName} ${userData.lastName}`}</h2>
              <p className="text-gray-600">{userData.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleEditToggle}
              className="flex items-center space-x-2 text-green-600 hover:text-green-800"
            >
              <FaEdit className="w-6 h-6" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={handleSignout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-800"
            >
              <FaSignOutAlt className="w-6 h-6" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow">
            <FaUser className="text-blue-600 w-8 h-8 mr-4" />
            <div>
              <span className="block text-gray-700 font-medium">Full Name:</span>
              <span className="block text-gray-900">{`${userData.firstName} ${userData.lastName}`}</span>
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow">
            <FaEnvelope className="text-blue-600 w-8 h-8 mr-4" />
            <div>
              <span className="block text-gray-700 font-medium">Email:</span>
              <span className="block text-gray-900">{userData.email}</span>
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow">
            <FaMapMarkerAlt className="text-blue-600 w-8 h-8 mr-4" />
            <div>
              <span className="block text-gray-700 font-medium">Location:</span>
              <span className="block text-gray-900">{userData.location}</span>
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow">
            <FaInfoCircle className="text-blue-600 w-8 h-8 mr-4" />
            <div>
              <span className="block text-gray-700 font-medium">Bio:</span>
              <span className="block text-gray-900">
                {userData.bio.length > 100 ? (
                  <>
                    {`${userData.bio.slice(0, 100)}...`}
                    <button
                      onClick={toggleBioModal}
                      className="text-blue-600 hover:underline ml-2"
                    >
                      Read more
                    </button>
                  </>
                ) : (
                  userData.bio
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow">
            <FaBook className="text-blue-600 w-8 h-8 mr-4" />
            <div>
              <span className="block text-gray-700 font-medium">Education:</span>
              <span className="block text-gray-900">{userData.education}</span>
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow">
            <FaMobileAlt className="text-blue-600 w-8 h-8 mr-4" />
            <div>
              <span className="block text-gray-700 font-medium">Mobile:</span>
              <span className="block text-gray-900">{userData.mobile}</span>
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow">
            <FaLinkedin className="text-blue-600 w-8 h-8 mr-4" />
            <div>
              <span className="block text-gray-700 font-medium">LinkedIn Profile:</span>
              <a
                href={userData.linkedInProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline"
              >
                {userData.linkedInProfile}
              </a>
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow">
            <FaGlobe className="text-blue-600 w-8 h-8 mr-4" />
            <div>
              <span className="block text-gray-700 font-medium">Website:</span>
              <a
                href={userData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline"
              >
                {userData.website}
              </a>
            </div>
          </div>
        </div>
      </div>

      {isBioModalOpen && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleModalClose}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4">Bio</h2>
            <p className="text-gray-700 mb-4">{userData.bio}</p>
            <button
              onClick={toggleBioModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &#10006;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
