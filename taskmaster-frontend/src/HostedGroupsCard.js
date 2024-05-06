import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HostedGroupsCard.css';

const HostedGroupsCard = ({ group }) => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [uncompletedTasks, setUncompletedTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('JWT token is missing');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/api/groups/${group._id}/users`, {
        headers: {
          authorization: `${token}`
        }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    // Fetch tasks by group ID
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token is missing');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3000/api/tasks/${group._id}/tasksByGroupId`, {
          headers: {
            authorization: `${token}`
          }
        });
        const tasks = response.data;
        
        // Split tasks into completed and uncompleted
        const completed = tasks.filter(task => task.isComplete);
        const uncompleted = tasks.filter(task => !task.isComplete);

        setCompletedTasks(completed);
        setUncompletedTasks(uncompleted);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
    fetchUsers();
  }, [group._id]);

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (confirmDelete) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token is missing');
        return;
      }

      axios.delete(`http://localhost:3000/api/groups/${group._id}/delete`, {
        headers: {
          authorization: `${token}`
        }
      })
        .then(response => {
          console.log('Group deleted:', response.data);
          // Reload the page after successful deletion
          window.location.reload();
        })
        .catch(error => console.error('Error deleting group:', error));
    }
  };

  return (
    <div className="group-card">
      <Link to={`/host-dashboard/${group._id}`} className="group-info">
        <h3>{group.name}</h3>
        <p>Users: {users.length}</p>
        <p>Uncompleted Tasks: {uncompletedTasks.length}</p>
        <p>Completed Tasks: {completedTasks.length}</p>
      </Link>
      <button className="delete-button" onClick={handleDelete}>×</button>
    </div>
  );
};

export default HostedGroupsCard;