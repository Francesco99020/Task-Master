import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import TaskCard from './TaskCard';
import TaskInspector from './TaskInspector';
import './HostDashboard.css';

const MemberDashboard = () => {
  const history = useHistory();
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [users, setUsers] = useState([]);
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [yourTasks, setYourTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  const [creatingTask, setCreatingTask] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  const formattedNextDay = nextDay.toISOString().split('T')[0];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('JWT token is missing');
      return;
    }

    axios.get(`http://localhost:3000/api/groups/${groupId}`, {
      headers: {
        authorization: `${token}`
      }
    })
      .then(response => {
        const fetchedGroup = response.data.group;
        setGroup(fetchedGroup);

        if (fetchedGroup) {
          axios.get(`http://localhost:3000/api/tasks/${fetchedGroup._id}/tasksByGroupId`, {
            headers: {
              authorization: `${token}`
            }
          })
            .then(response => {
              const tasks = response.data;
              const completed = tasks.filter(task => task.isComplete);
              const uncompleted = tasks.filter(task => !task.isComplete);
              setCompletedTasks(completed);
              setIncompleteTasks(uncompleted);
            })
            .catch(error => console.error('Error fetching tasks:', error));
        }
      })
      .catch(error => console.error('Error fetching group details:', error));
    const userTasks = incompleteTasks.filter(task => task.assignedTo === localStorage.getItem('username'));
    setYourTasks(userTasks);

    axios.get(`http://localhost:3000/api/groups/${groupId}/users`, {
      headers: {
        authorization: `${token}`
      }
    })
      .then(response => setUsers(response.data.users))
      .catch(error => console.error('Error fetching users:', error));
  }, [groupId, incompleteTasks]); // Only re-run the effect if groupId or incompleteTasks change

  const markTaskAsComplete = (taskId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('JWT token is missing');
      return;
    }

    axios.post(`http://localhost:3000/api/tasks/${taskId}/complete`, {}, {
      headers: {
        authorization: `${token}`
      }
    })
      .then(response => {
        const updatedIncompleteTasks = incompleteTasks.filter(task => task._id !== taskId);
        setIncompleteTasks(updatedIncompleteTasks);
        const completedTask = response.data.task;
        setCompletedTasks([...completedTasks, completedTask]);
        setSelectedTask(completedTask);
      })
      .catch(error => console.error('Error marking task as complete:', error));
  };

  const handleTaskClick = (task) => {
    const taskInspectorSection = document.getElementById('task-inspector-section');
    taskInspectorSection.scrollIntoView({ behavior: 'smooth' });
    // Check if the clicked task is already the selected task
    if (task !== selectedTask) {
      setSelectedTask(task);
    }
  };

  const toggleTaskCreationForm = () => {
    setCreatingTask(!creatingTask);
  };

  const handleCreateTask = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token is missing');
        return;
      }

      const userExists = users.includes(query);
      if (!userExists) {
        setErrorMessage('AssignedTo value must be a user from the user list.');
        return;
      }

      const newTaskData = {
        name: newTaskName,
        description: newTaskDescription,
        dueDate: newTaskDueDate,
        createdBy: localStorage.getItem('username'),
        assignedTo: query,
        groupId: groupId
      };

      const response = await axios.post(`http://localhost:3000/api/tasks/createTask`, newTaskData, {
        headers: {
          authorization: `${token}`
        }
      });

      const createdTask = response.data.task;
      setIncompleteTasks(prevTasks => [...prevTasks, createdTask]);
      setCreatingTask(false);
      setNewTaskName('');
      setNewTaskDescription('');
      setNewTaskDueDate('');
      setNewTaskAssignedTo('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    const filtered = users.filter(user =>
      user.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserSelect = (username) => {
    console.log(username)
    setQuery(username);
    setFilteredUsers([]);
  };

  const handleBackButtonClick = () => {
    history.goBack();
  };

  return (
    <div className="host-dashboard">
      {group && (
        <div className="group-header">
          <div className="back-arrow">
            <button onClick={handleBackButtonClick}>&#8592;</button>
          </div>
          <div className="group-name">
            <h1>{group.name}</h1>
            <p>Description: {group.description}</p>
          </div>
          <div className="group-details">
            <h2>Group Details</h2>
            <p>Host Username: {group.hostUsername}</p>
          </div>
        </div>
      )}
      <div className="group-divider"></div>

      <div className="tasks-section section" style={{ flex: '70%' }}>
        <h1>Tasks</h1>
        {/* Tasks Section Content */}
        <div className='create-new-task-form'>
          {creatingTask ? (
            <div>
              <input
                type="text"
                placeholder="Task Name"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Task Description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              />
              <input
                type="date"
                min={formattedNextDay}
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />
              <input
                type="text"
                placeholder="Assign To"
                value={query}
                onChange={handleQueryChange}
                onBlur={() => setNewTaskAssignedTo(query)}
              />
              {query && (
                <ul>
                  {filteredUsers.map((user, index) => (
                    <button className='assign-user-btn' key={index} onClick={() => handleUserSelect(user)}>
                      {user}
                    </button>
                  ))}
                </ul>
              )}
              {errorMessage && <p>{errorMessage}</p>}
              <button className='create-task-form-btn' onClick={handleCreateTask}>Create Task</button>
              <button className='create-task-cancel-btn' onClick={toggleTaskCreationForm}>Cancel</button>
            </div>
          ) : (
            <button className='create-task-btn' onClick={() => setCreatingTask(true)}>Create New Task</button>
          )}
        </div>
        <div>
          <h2>Your Tasks</h2>
          {yourTasks.map(task => (
            <TaskCard key={task._id} task={task} handleSelectTask={handleTaskClick} />
          ))}
        </div>
        <div>
          <h2>Incomplete Tasks</h2>
          {incompleteTasks.map(task => (
            <TaskCard key={task._id} task={task} handleSelectTask={handleTaskClick} />
          ))}
        </div>
        <div>
          <h2>Completed Tasks</h2>
          {completedTasks.map(task => (
            <TaskCard key={task._id} task={task} handleSelectTask={handleTaskClick} />
          ))}
        </div>
      </div>

      <div className="users-section section">
        <h2>Users</h2>
        {users.map(user => (
          <p key={user._id}>{user}</p>
        ))}
      </div>

      <div id="task-inspector-section" className="task-inspector section" style={{ width: '100%' }}>
        <h2>Task Inspector</h2>
        {selectedTask ? (
          <TaskInspector task={selectedTask} markTaskAsComplete={markTaskAsComplete} />
        ) : (
          <p>No Task Selected</p>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
