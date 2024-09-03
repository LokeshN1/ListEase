import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateList() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [heading, setHeading] = useState('');
  const [about, setAbout] = useState('');
  const [columns, setColumns] = useState([]);
  const [columnName, setColumnName] = useState('');
  const [queryColumn, setQueryColumn] = useState('');
  const [file, setFile] = useState(null);
  const [excelColumns, setExcelColumns] = useState([]);
  const [uploadOption, setUploadOption] = useState('');
  const [fileUrl, setFileUrl] = useState(''); // State to store the file URL
  const [filePublicId, setFilePublicId] = useState(''); // State to store the file URL

  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const navigate = useNavigate();

  const validateStep1 = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Title is required';
    if (!heading) newErrors.heading = 'Heading is required';
    if (!about) newErrors.about = 'About is required';
    if (!uploadOption) newErrors.uploadOption = 'Please select an option';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!queryColumn) newErrors.queryColumn = 'Query Column is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addColumn = () => {
    if (columnName) {
      const newColumns = [...columns];
      if (editingIndex !== null) {
        newColumns[editingIndex] = { name: columnName, type: 'String' };
        setEditingIndex(null);
      } else {
        newColumns.push({ name: columnName, type: 'String' });
      }
      setColumns(newColumns);
      setColumnName('');
    } else {
      setErrors({ ...errors, column: 'Please provide a column name' });
    }
  };

  const editColumn = (index) => {
    setColumnName(columns[index].name);
    setEditingIndex(index);
  };

  const removeColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setErrors({ file: 'Please upload an Excel file' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/lists/excel-extract-column`, formData, {
        withCredentials: true,
      });

      setExcelColumns(response.data.columns); // Save the extracted columns
      setFileUrl(response.data.fileUrl); // Save the file URL for later use
      setFilePublicId(response.data.public_id); // Save the file public id so we can delete it after use
      
      setStep(2); // Move to the next step to select the query column
    } catch (error) {
      setErrors({ file: 'Error uploading and processing the file' });
    }
  };
    // Function to handle the final submission of the list creation form
    const handleSubmitExcel = async (e) => {
      e.preventDefault();
      if (!validateStep2()) return;
  
      try {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/lists/create-list-excel`,
          {
            title,
            heading,
            about,
            queryColumn,
            columns: excelColumns,
            fileUrl, // Include the file URL here
            filePublicId
          },
          {
            withCredentials: true,
          }
        );
        navigate(`/my-lists`);
      } catch (error) {
        setErrors({ submit: 'Error creating list' });
      }
  };

  const handleSubmitManual = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/lists/manual`,
        {
          title,
          heading,
          about,
          columns,
          queryColumn,
        },
        {
          withCredentials: true,
        }
      );
      navigate(`/my-lists`);
    } catch (error) {
      setErrors({ submit: 'Error creating list' });
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-misty-blue to-pewter min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white p-10 rounded-xl shadow-xl">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-sea-blue italic">
          Create Your List
        </h2>
        <form className="space-y-8">
          {step === 1 && (
            <>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Title / Organization Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Heading (provide a name for your list)
                </label>
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
                />
                {errors.heading && <p className="text-red-500 text-sm mt-1">{errors.heading}</p>}
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">About</label>
                <input
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
                />
                {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 mt-4">Select an Option</h3>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setUploadOption('excel')}
                    className={`w-1/2 py-2 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
                      uploadOption === 'excel' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Upload Excel File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadOption('manual')}
                    className={`w-1/2 py-2 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
                      uploadOption === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Add Columns Manually
                  </button>
                </div>
                {errors.uploadOption && <p className="text-red-500 text-sm mt-1">{errors.uploadOption}</p>}
              </div>
              {uploadOption === 'excel' && (
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Upload Excel File</label>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out mt-4"
                  >
                    Load
                  </button>
                  {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                </div>
              )}
              {uploadOption === 'manual' && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 mt-4">Add Columns</h3>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block mb-2 text-sm font-medium text-gray-700">Column Name</label>
                      <input
                        type="text"
                        value={columnName}
                        onChange={(e) => setColumnName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={addColumn}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out"
                      >
                        {editingIndex !== null ? 'Edit Column' : 'Add Column'}
                      </button>
                    </div>
                  </div>
                  {errors.column && <p className="text-red-500 text-sm mt-1">{errors.column}</p>}
                  <ul className="mt-4">
                    {columns.map((col, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-100 rounded-lg shadow-sm mb-2"
                      >
                        <span>{col.name}</span>
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => editColumn(index)}
                            className="text-blue-500 font-semibold hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeColumn(index)}
                            className="text-red-500 font-semibold hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {columns.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep1()) setStep(2);
                      }}
                      className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out mt-4"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Query Column</label>
                <select
                  value={queryColumn}
                  onChange={(e) => setQueryColumn(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
                >
                  <option value="">Select a column</option>
                  {uploadOption === 'excel' && excelColumns.map((col, index) => (
                    <option key={index} value={col}>{col}</option>
                  ))}
                  {uploadOption === 'manual' && columns.map((col, index) => (
                    <option key={index} value={col.name}>{col.name}</option>
                  ))}
                </select>
                {errors.queryColumn && <p className="text-red-500 text-sm mt-1">{errors.queryColumn}</p>}
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1) }
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-lg hover:bg-gray-400 transition-all duration-300 ease-in-out"
                >
                  Back
                </button>
                <button
                  type="submit"
                  onClick={uploadOption === 'excel' ? handleSubmitExcel : handleSubmitManual}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out"
                >
                  Create List
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateList;