import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Lists() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/lists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLists(response.data);
    };

    fetchLists();
  }, []);

  return (
    <div>
      <h2>Your Lists</h2>
      {lists.map(list => (
        <div key={list._id}>
          <h3>{list.mainHeading}</h3>
          <p>{list.about}</p>
        </div>
      ))}
    </div>
  );
}

export default Lists;
