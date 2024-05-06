import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, handleSelectTask }) => {
  const handleClick = () =>{
    handleSelectTask(task);
  }
  return (
    <div className="task-card" onClick={handleClick}>
      <h3>{task.name}</h3>
      <p>Due Date: {task.dueDate}</p>
      <p>Assigner: {task.createdBy}</p>
      <p>Assignee: {task.assignedTo}</p>
    </div>
  );
};

export default TaskCard;