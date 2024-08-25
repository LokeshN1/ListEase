import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ListDetails() {
  const { id } = useParams();
  const [list, setList] = useState(null);

  useEffect(() => {
    const fetchList = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/lists/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setList(response.data);
    };

    fetchList();
  }, [id]);

  if (!list) return <div>Loading...</div>;

  return (
    <div>
      <h2>{list.mainHeading}</h2>
      <p>{list.about}</p>
      <div>
        {list.columns.map((col, index) => (
          <span key={index}>{col} </span>
        ))}
      </div>
      <div>
        {list.data.map((item, index) => (
          <div key={index}>
            {Object.entries(item).map(([key, value]) => (
              <p key={key}>{key}: {value}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListDetails;
