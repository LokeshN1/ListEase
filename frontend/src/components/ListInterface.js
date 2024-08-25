import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ListInterface() {
  const { listId } = useParams();
  const [listData, setListData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/lists/${listId}`)
      .then(response => {
        setListData(response.data);
        setError('');
      })
      .catch(error => {
        setError('List not found');
      });
  }, [listId]);

  const handleSearch = async () => {
    if (searchQuery.trim() && listData) {
      try {
        const queryColumn = listData.queryColumn; // assuming `queryColumn` is available in listData
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/lists/data/${listId}/query`,
          {
            params: {
              queryColumn: queryColumn,
              queryValue: searchQuery
            }
          }
        );
        setSearchResult(response.data.rows);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setSearchResult([]);
          setError('Data not found');
        } else {
          console.error('Error searching data:', error);
        }
      }
    } else {
      alert('Please enter a valid query.');
    }
  };

  const renderTable = (data) => {
    if (!data || data.length === 0) {
      return <p className="text-center text-gray-500">No data found</p>;
    }

    const headers = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto mt-4 max-h-96">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-6 py-3 text-left text-sm font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100">
                {headers.map((header) => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="pt-20 bg-gray-100 min-h-screen flex flex-col items-center">
      {listData ? (
        <>
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4 text-center text-jet-black">{listData.heading}</h1>
            <p className="text-lg mb-7 text-center text-misty-blue">{listData.about}</p>
            <div className="flex justify-center mb-6">
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-blue transition-all w-1/3 max-w-lg"
                placeholder={`Search by ${listData.queryColumn}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="bg-sky-blue text-white px-6 rounded-r-lg shadow-lg hover:bg-sky-blue-dark transition-transform duration-300"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            <div className="overflow-x-auto mt-4">
              {searchResult.length > 0 ? (
                renderTable(searchResult)
              ) : (
                <p className="text-center text-red-500">{error || 'Enter a query to search for data'}</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600">Loading...</div>
      )}
    </div>
  );
}

export default ListInterface;
