import React, { useState } from 'react';
import axios from 'axios';
import './AddUserToGroup.css';

const AddUserToGroup = ({ groupId, fetchUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (term) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token is missing');
        return;
      }
      const response = await axios.get(`http://localhost:3000/api/users/search?query=${term}`, {
        headers: {
          authorization: `${token}`
        }
      });
      setSearchResults(response.data.users);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleAddUser = async (username) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token is missing');
        return;
      }

      await axios.post(`http://localhost:3000/api/groups/${groupId}/${username}/addUser`, {}, {
        headers: {
          authorization: `${token}`
        }
      });

      // Clear the search bar
      setSearchTerm('');
      setSearchResults([]);

      // Refresh the list of users in the group
      await fetchUsers();
    } catch (error) {
        if (error.response && error.response.status === 400) {
            alert('This user is already in the group.');
          } else {
            console.error('Error adding user to group:', error);
          }
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for users"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <ul>
        {searchResults.map(user => (
          <li key={user._id}>
            {/* Add user button */}
            <button className='add-user-to-group-btn' onClick={() => handleAddUser(user.username)}>Add {user.username}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddUserToGroup;