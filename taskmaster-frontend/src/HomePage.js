import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import HostedGroupsCard from './HostedGroupsCard';
import MemberGroupsCard from './MemberGroupsCard';
import Modal from './Modal';
import './HomePage.css';

const HomePage = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [groupsYouHost, setGroupsYouHost] = useState([]);
  const [groupsYouAreIn, setGroupsYouAreIn] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('JWT token is missing');
      return;
    }

    const username = localStorage.getItem('username');
    if (username) {
      axios.get(`http://localhost:3000/api/user/profile/${username}`, {
        headers: {
          authorization: `${token}`
        }
      })
        .then(response => setUser(response.data.user))
        .catch(error => console.error('Error fetching user profile:', error));
    }

    axios.get(`http://localhost:3000/api/groups/host/${username}`, {
      headers: {
        authorization: `${token}`
      }
    })
      .then(response => { setGroupsYouHost(response.data.groups) })
      .catch(error => console.error('Error fetching hosted groups:', error));

    axios.get(`http://localhost:3000/api/groups/member/${username}`, {
      headers: {
        authorization: `${token}`
      }
    })
      .then(response => setGroupsYouAreIn(response.data.groups))
      .catch(error => console.error('Error fetching groups user is in:', error));

    axios.get(`http://localhost:3000/api/tasks/${username}/tasks`, {
      headers: {
        authorization: `${token}`
      }
    })
      .then(response => setUpcomingTasks(response.data))
      .catch(error => console.error('Error fetching upcoming tasks:', error));
  }, []);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleTaskClick = (taskId, groupId) => {
    const group = groupsYouHost.find(group => group._id === groupId);
    if (group) {
      history.push(`/host-dashboard/${groupId}`);
    } else {
      history.push(`/member-dashboard/${groupId}`);
    }
    history.push({
      pathname: history.location.pathname
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    history.push('/login');
  };

  return (
    <div className="homepage">
      <h1 className='user-info-title'>User Info</h1>
      <div className="user-info">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        {user && (
          <div className='user-details'>
            <p>Username: {user.username}</p>
            <p> Email: {user.email}</p>
          </div>
        )}
      </div>

      <div className="groups-section">
        <div className="groups-wrapper">
          <div className="groups-you-host">
            <h2 className='groups-you-host-header'>Current Groups You Host</h2>
            {groupsYouHost.length > 0 ? (
              <div className="hosted-groups-container">
                {groupsYouHost.map(group => (
                  <HostedGroupsCard key={group._id} group={group} />
                ))}
              </div>
            ) : (
              <p>You are not currently hosting any groups.</p>
            )}
            <button className='new-group-btn' onClick={handleShowModal}>Create New Group</button>
          </div>

          <div className="groups-you-are-in">
            <h2 className='groups-you-are-in-header'>Current Groups You're a Member Of</h2>
            {groupsYouAreIn.length > 0 ? (
              <div className="member-groups-container">
                {groupsYouAreIn.map(group => (
                  <MemberGroupsCard key={group._id} group={group} />
                ))}
              </div>
            ) : (
              <p>You are not currently a member of any groups.</p>
            )}
          </div>
        </div>

        <div className="upcoming-tasks-section">
          <h2 className='upcoming-tasks-section-header'>Upcoming Tasks</h2>
          {upcomingTasks.length > 0 ? (
          <ul>
            {upcomingTasks.map(task => (
              <li key={task._id} onClick={() => handleTaskClick(task._id, task.groupId)} className="upcomming-task-card">
                {task.name} - Due: {task.dueDate}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming tasks.</p>
        )}
        </div>
      </div>

      <Modal handleClose={handleCloseModal} show={showModal} />
    </div>
  );
};

export default HomePage;
