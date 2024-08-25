import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaExclamationCircle } from 'react-icons/fa';

function ViewList() {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/lists/${id}`, {
          withCredentials: true,
        });
        setList(response.data);
      } catch (error) {
        setError('Failed to fetch list details');
      }
    };

    const fetchListData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/lists/data/${id}`, {
          withCredentials: true,
        });
        setRows(response.data.data || []);
      } catch (error) {
        setError('Failed to fetch list data');
      } finally {
        setLoading(false);
      }
    };

    fetchListDetails();
    fetchListData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        <FaSpinner className="animate-spin mr-2" /> Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <FaExclamationCircle className="mr-2" /> {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 via-white to-gray-100 min-h-screen text-gray-800">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-sea-blue">{list.title}</h1>
        <p className="text-lg mb-10 text-center">{list.about}</p>
        <div className="overflow-x-auto">
          <table className="hidden md:table min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {list.columns.map((column) => (
                  <th
                    key={column.name}
                    className="py-3 px-4 border-b border-gray-300 text-left text-gray-700 uppercase tracking-wider"
                  >
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  {list.columns.map((column) => (
                    <td
                      key={column.name}
                      className="py-3 px-4 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      {row[column.name]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="md:hidden">
            {rows.map((row, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm">
                {list.columns.map((column) => (
                  <div key={column.name} className="flex justify-between py-2">
                    <span className="font-bold text-gray-700">{column.name}:</span>
                    <span className="text-gray-600">{row[column.name]}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewList;
