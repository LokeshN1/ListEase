import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    profilePicture: '',
    bio: '',
    location: '',
    education: '',
    mobile: '',
    linkedInProfile: '',
    website: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
          withCredentials: true,
        });
        setUserData(response.data);
        setFormData({
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          profilePicture: response.data.profilePicture,
          bio: response.data.bio,
          location: response.data.location,
          education: response.data.education,
          mobile: response.data.mobile,
          linkedInProfile: response.data.linkedInProfile,
          website: response.data.website,
        });
        setProfileImage(response.data.profilePicture);
      } catch (error) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'profilePicture') {
      const file = e.target.files[0];
      setProfileImage(URL.createObjectURL(file));
      setFormData({
        ...formData,
        profilePicture: file,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleRemovePicture = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/account/profile/removeProfilePicture`, {
        removeProfilePicture: 'true',
      }, {
        withCredentials: true,
      });
      setProfileImage(null);
      setFormData({
        ...formData,
        profilePicture: '',
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error removing profile picture:', error);
      setError('Failed to remove profile picture');
    }
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append('email', formData.email);
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('bio', formData.bio);
    data.append('location', formData.location);
    data.append('education', formData.education);
    data.append('mobile', formData.mobile);
    data.append('linkedInProfile', formData.linkedInProfile);
    data.append('website', formData.website);
    if (formData.profilePicture instanceof File) {
      data.append('profilePicture', formData.profilePicture);
    }

    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/account/profile`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUserData({ ...userData, ...formData });
      setShowModal(false);
      navigate('/account/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleSaveProfilePicture = async () => {
    const data = new FormData();
    if (formData.profilePicture instanceof File) {
      data.append('profilePicture', formData.profilePicture);
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/account/profile/updateProfilePicture`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      // Handle success
      console.log('Profile picture updated successfully:', response.data);
      setUserData({ ...userData, profilePicture: response.data.profilePicture });
      setProfileImage(response.data.profilePicture);
      setShowModal(false);
    } catch (error) {
      // Handle error
      console.error('Error updating profile picture:', error);
      setError('Failed to update profile picture');
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Edit Profile</h1>
        {userData && (
          <div className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <img
                  src={profileImage ? profileImage : `${process.env.REACT_APP_BACKEND_URL}/uploads/profile-pictures/default-profile.png`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="bg-transparent text-white text-2xl font-bold p-2 rounded-lg"
                    onClick={() => setShowModal(true)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Other Form Fields */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700">First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700">Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700">Location:</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-gray-700">Bio:</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700">Education:</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700">Mobile:</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-gray-700">LinkedIn Profile:</label>
                <input
                  type="url"
                  name="linkedInProfile"
                  value={formData.linkedInProfile}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-gray-700">Website:</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Modal for Editing Profile Picture */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Edit Profile Picture</h2>
              <div className="flex items-center justify-center mb-4">
                <img
                  src={profileImage ? profileImage : `${process.env.REACT_APP_BACKEND_URL}/uploads/profile-pictures/default-profile.png`}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                name="profilePicture"
                onChange={handleChange}
                className="mb-4"
              />
              <div className="flex justify-end">
                <button
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={handleRemovePicture}
                >
                  Remove
                </button>
                <button
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg"
                  onClick={handleSaveProfilePicture}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditProfile;
