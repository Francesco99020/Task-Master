// routes/tasks.js
const express = require('express');
const router = express.Router();
const { createTask, markTaskComplete, addTaskComment, getTasksByUsername, getTasksByGroupId, getTaskByTaskId } = require('../controllers/tasksController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/:taskId', verifyToken, getTaskByTaskId);
router.post('/createTask', verifyToken, createTask);
router.post('/:taskId/complete', verifyToken, markTaskComplete);
router.post('/:taskId/comment', verifyToken, addTaskComment);
router.get('/:username/tasks', verifyToken, getTasksByUsername);
router.get('/:groupId/tasksByGroupId', verifyToken, getTasksByGroupId);

module.exports = router;
