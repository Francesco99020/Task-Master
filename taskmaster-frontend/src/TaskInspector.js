import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskInspector.css';

const TaskInspector = ({ task: initialTask, markTaskAsComplete }) => {
  const [task, setTask] = useState(initialTask);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  const handleMarkComplete = () => {
    markTaskAsComplete(task._id);
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleSendComment = async () => {
    try {
      const commenter = localStorage.getItem('username');
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:3000/api/tasks/${task._id}/comment`, {
        body: newComment,
        commenter: commenter
      }, {
        headers: {
          authorization: `${token}`
        }
      });
      const updatedTaskWithComment = response.data.task;
      setTask(updatedTaskWithComment);
      setNewComment('');
    } catch (error) {
      console.error('Error sending comment:', error);
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const options = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };
  
  

  return (
    <div className="task-inspector">
        <p>Name: {task.name}</p>
        <p>Description: {task.description}</p>
        <p>Assigner: {task.createdBy}</p>
        <p>Assignee: {task.assignedTo}</p>
        <p>Due Date: {task.dueDate}</p>
        {task.isComplete && (
            <p>Completion Date: {task.completionDate}</p>
        )}
        {!task.isComplete && (
            <button className='is-complete-btn' onClick={handleMarkComplete}>Mark Complete</button>
        )}
        <h3>Comments</h3>
        <ul className="comments">
        {task.comments.map(comment => (
          <li key={comment.time} className={comment.commenter === localStorage.getItem('username') ? 'comment right' : 'comment left'}>
            <div className="comment-details">
              <p><b>{comment.commenter}</b></p>
              <p>{formatTime(comment.time)}</p> 
            </div>
            <p className="comment-bubble">{comment.body}</p>
          </li>
        ))}
        </ul>
        <div className="comment-input-container">
            <input
                type="text"
                className="comment-input"
                placeholder="Add a comment"
                value={newComment}
                onChange={handleCommentChange}
            />
            <button className="send-button" onClick={handleSendComment}>Send</button>
        </div>
    </div>
);

};

export default TaskInspector;