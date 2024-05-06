import React, { useState } from 'react';
import axios from 'axios';
import './Modal.css';

const Modal = ({ handleClose, show }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

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
      // Filter out the current user from search results
      setSearchResults(response.data.users.filter(user => user.username !== localStorage.getItem('username')));
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleAddUser = (username) => {
    setSelectedUsers([...selectedUsers, username]);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveUser = (username) => {
    setSelectedUsers(selectedUsers.filter(user => user !== username));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('JWT token is missing');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/groups/create', {
        name: e.target.groupName.value,
        hostUsername: localStorage.getItem('username'),
        description: e.target.description.value,
        users: selectedUsers
      }, {
        headers: {
          authorization: `${token}`
        }
      });
      console.log('Group created:', response.data);
      handleClose();
      // Reload the window to update with the newly created group
      window.location.reload();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <button className='close-btn' onClick={handleClose}>Close</button>
        <h2>Create New Group</h2>
        <form onSubmit={handleSubmit}>
          <label>Group Name:</label>
          <input type="text" name="groupName" required /><br/>
          <label>Description:</label><br/>
          <textarea name="description"></textarea><br />

          <label>List of Users:</label>
          <input type="text" name="userList" value={searchTerm} onChange={handleInputChange} />
          <ul>
            {searchResults.map(user => (
              <li key={user._id}>
                <button onClick={() => handleAddUser(user.username)}>Add {user.username}</button>
              </li>
            ))}
          </ul>

          <div className="selected-users">
            {selectedUsers.map((username, index) => (
              <div key={index} className="tag">
                <span>{username}</span>
                <button onClick={() => handleRemoveUser(username)}>x</button>
              </div>
            ))}
          </div>

          <button className='submit-btn' type="submit">Create Group</button>
        </form>
      </section>
    </div>
  );
};

export default Modal;