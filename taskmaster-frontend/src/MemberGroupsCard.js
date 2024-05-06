import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HostedGroupsCard.css';

const MemberGroupsCard = ({ group }) => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [uncompletedTasks, setUncompletedTasks] = useState([]);

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
  }, [group._id]);

  return (
    <Link to={`/member-dashboard/${group._id}`} className="group-card">
      <div className="group-info">
        <h3>{group.name}</h3>
        <p>Uncompleted Tasks: {uncompletedTasks.length}</p>
        <p>Completed Tasks: {completedTasks.length}</p>
      </div>
    </Link>
  );
};

export default MemberGroupsCard;