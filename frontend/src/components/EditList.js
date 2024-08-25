import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({});

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/lists/${id}`, {
          withCredentials: true,
        });
        setList(response.data);
      } catch (error) {
        console.error('Failed to fetch list details', error);
      }
    };

    const fetchListData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/lists/data/${id}`, {
          withCredentials: true,
        });
        setRows(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch list data', error);
      }
    };

    fetchListDetails();
    fetchListData();
  }, [id]);

  const handleRowChange = (index, key, value) => {
    const updatedRows = [...rows];
    updatedRows[index][key] = value;
    setRows(updatedRows);
  };

  const handleAddRow = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/lists/add-data/${id}`, {
        data: [newRow],
      }, {
        withCredentials: true,
      });
      setRows(response.data.listItem.data);
      setNewRow({});
      toast.success('Row added successfully', {
        position: "bottom-right",
      });
    } catch (error) {
      console.error('Failed to add row', error);
      toast.error('Failed to add row', {
        position: "bottom-right",
      });
    }
  };

  const handleDeleteRow = async (rowIndex) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/lists/delete-row/${id}/${rowIndex}`, {
        withCredentials: true,
      });
      const updatedRows = rows.filter((_, i) => i !== rowIndex);
      setRows(updatedRows);
      toast.success('Row deleted successfully', {
        position: "bottom-right",
      });
    } catch (error) {
      console.error('Failed to delete row', error);
      toast.error('Failed to delete row', {
        position: "bottom-right",
      });
    }
  };

  const handleSaveRow = async (rowIndex) => {
    try {
      const updatedRow = rows[rowIndex];
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/lists/update-row/${id}/${rowIndex}`, {
        updatedRow,
      }, {
        withCredentials: true,
      });
      toast.success('Row updated successfully', {
        position: "bottom-right",
      });
    } catch (error) {
      console.error('Failed to update row', error);
      toast.error('Failed to update row', {
        position: "bottom-right",
      });
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/lists/${id}`, {
        ...list,
        data: rows,
      }, {
        withCredentials: true,
      });
      toast.success('List updated successfully', {
        position: "bottom-right",
      });
    } catch (error) {
      console.error('Failed to update list', error);
      toast.error('Failed to update list', {
        position: "bottom-right",
      });
    }
  };

  if (!list) {
    return <div className="text-center p-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-jet-black bg-misty-blue p-4 rounded-lg shadow-md">Edit List: {list.title}</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-jet-black">List Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Title:</label>
              <input
                type="text"
                value={list.title}
                onChange={(e) => setList({ ...list, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-sky-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Heading:</label>
              <input
                type="text"
                value={list.heading}
                onChange={(e) => setList({ ...list, heading: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-sky-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">About:</label>
              <input
                type="text"
                value={list.about}
                onChange={(e) => setList({ ...list, about: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-sky-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Query Column:</label>
              <select
                value={list.queryColumn}
                onChange={(e) => setList({ ...list, queryColumn: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-sky-blue focus:outline-none"
              >
                {list.columns.map((column) => (
                  <option key={column.name} value={column.name}>
                    {column.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={handleSave} className="px-4 py-2 bg-dodger-blue text-white rounded-lg hover:bg-sea-blue transition duration-300">Save Changes</button>
            <button onClick={() => navigate('/my-lists')} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300">Back to My Lists</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-jet-black">Add New Row</h2>
        <table className="w-full mb-6 border bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {list.columns.map((column) => (
                <th key={column.name} className="border px-4 py-2 text-left text-jet-black">{column.name}</th>
              ))}
              <th className="border px-4 py-2 text-left text-jet-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {list.columns.map((column) => (
                <td key={column.name} className="border px-4 py-2">
                  <input
                    type="text"
                    value={newRow[column.name] || ''}
                    onChange={(e) => setNewRow({ ...newRow, [column.name]: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-sky-blue focus:outline-none"
                  />
                </td>
              ))}
              <td className="border px-4 py-2 text-center">
                <button onClick={handleAddRow} className="px-4 py-2 bg-dodger-blue text-white rounded-lg hover:bg-sea-blue transition duration-300">Add Row</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {list.columns && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-jet-black">List Data</h2>
          <table className="w-full border bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                {list.columns.map((column) => (
                  <th key={column.name} className="border px-4 py-2 text-left text-jet-black">{column.name}</th>
                ))}
                <th className="border px-4 py-2 text-left text-jet-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {list.columns.map((column) => (
                    <td key={column.name} className="border px-4 py-2">
                      <input
                        type="text"
                        value={row[column.name] || ''}
                        onChange={(e) => handleRowChange(rowIndex, column.name, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-sky-blue focus:outline-none"
                      />
                    </td>
                  ))}
                  <td className="border px-4 py-2 text-center">
                    <button onClick={() => handleSaveRow(rowIndex)} className="px-4 py-2 bg-dodger-blue text-white rounded-lg hover:bg-sea-blue transition duration-300 mr-2">Save Row</button>
                    <button onClick={() => handleDeleteRow(rowIndex)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300">Delete Row</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default EditList;
