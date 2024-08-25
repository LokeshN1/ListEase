import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';  // Import React Modal
import { ToastContainer, toast } from 'react-toastify';  // Import React Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import React Toastify CSS


function MyLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/lists`, {
          withCredentials: true,
        });
        setLists(response.data);
      } catch (error) {
        setError('Failed to fetch lists');
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  const handleCreateNewList = () => {
    navigate('/create-list');
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    toast.success('List ID copied to clipboard!', {
      position: "bottom-right", // Use the string directly
    });
  };

  const handleEdit = (id) => {
    navigate(`/edit-list/${id}`);
  };

  const openModal = (id) => {
    setListToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setListToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/lists/${listToDelete}`, {
        withCredentials: true,
      });
      setLists(lists.filter((list) => list._id !== listToDelete));
      toast.success('List deleted successfully!', {
        position: "bottom-right", // Use the string directly
      });
    } catch (error) {
      toast.error('Failed to delete list', {
        position: "bottom-right", // Use the string directly
      });
    } finally {
      closeModal();
    }
  };

  const handleView = (id) => {
    navigate(`/view/list/${id}`);
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg transition-all duration-500 ease-in-out transform hover:shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-sea-blue italic transition-transform duration-300 ease-in-out transform hover:scale-105">My Lists</h1>
        <button
          className="w-full bg-sky-blue text-jet-black font-bold text-xl py-3 px-4 rounded-lg shadow-lg hover:bg-sky-blue-dark transition-all duration-300 ease-in-out transform hover:scale-105 mb-8"
          onClick={handleCreateNewList}
        >
          Create New List
        </button>
        {lists.length > 0 ? (
          <ul className="space-y-6">
            {lists.map((list) => (
              <li key={list._id} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-105">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <Link to={`/list/${list._id}`} className="text-2xl font-semibold text-dodger-blue hover:underline transition-colors duration-300 ease-in-out">
                    {list.heading}
                  </Link>
                  <div className="flex flex-wrap space-y-2 md:space-y-0 md:space-x-3">
                    <button
                      className="text-sm bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all duration-200 ease-in-out transform hover:scale-105"
                      onClick={() => handleCopy(list._id)}
                    >
                      Copy ID
                    </button>
                    <button
                      className="text-sm bg-yellow-400 text-white py-2 px-4 rounded-lg hover:bg-yellow-500 transition-all duration-200 ease-in-out transform hover:scale-105"
                      onClick={() => handleEdit(list._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200 ease-in-out transform hover:scale-105"
                      onClick={() => openModal(list._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="text-sm bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105"
                      onClick={() => handleView(list._id)}
                    >
                      View
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{list.about}</p>
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Created: {new Date(list.createdAt).toLocaleDateString()}</p>
                  <p>Last Updated: {new Date(list.updatedAt).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">You have not created any lists yet.</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Delete Confirmation"
        className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-20"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this list?</h2>
        <div className="flex justify-end space-x-4">
          <button onClick={closeModal} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
            Delete
          </button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default MyLists;
