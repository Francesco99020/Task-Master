const Task = require('../MongoSchemas/Task');
const Group = require('../MongoSchemas/Group');

// Controller function for creating a task
const createTask = async (req, res) => {
    const { name, description, dueDate, createdBy, assignedTo, groupId } = req.body;

    try {
        // Validate request body
        if (!name || !createdBy || !assignedTo || !groupId) {
            return res.status(400).json({ success: false, message: 'Name, createdBy, assignedTo, and groupId are required fields' });
        }

        // Ensure description and comments are provided or set them to empty string and array respectively if not provided
        const taskDescription = description || '';
         const comments = [];

        // Check if assignedTo is a member of the group
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }
        if (!group.users.includes(assignedTo)) {
            return res.status(400).json({ success: false, message: 'The user assigned to the task must be a member of the group' });
        }

        // Check if dueDate is not before createdAt
        if (dueDate && new Date(dueDate) < new Date()) {
            return res.status(400).json({ success: false, message: 'The due date cannot be before the creation date' });
        }

        // Check if task name is unique within the group
        const existingTask = await Task.findOne({ name, groupId, isComplete: false });
        if (existingTask) {
            return res.status(400).json({ success: false, message: 'A task with the same name already exists in the group' });
        }

        // Create task
        const taskData = { name, description: taskDescription, dueDate, createdBy, assignedTo, groupId, comments };
        const task = new Task(taskData);
        await task.save();

        res.status(201).json({ success: true, message: 'Task created successfully', task });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const markTaskComplete = async (req, res) => {
    const taskId = req.params.taskId;

    try {
        // Find the task by ID
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Check if the task is already marked as complete
        if (task.isComplete) {
            return res.status(400).json({ success: false, message: 'Task is already marked as complete' });
        }

        // Mark the task as complete and set completion date
        task.isComplete = true;
        task.completionDate = new Date(); // Set completion date to current date and time
        await task.save();

        res.status(200).json({ success: true, message: 'Task marked as complete', task });
    } catch (error) {
        console.error('Error marking task as complete:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const addTaskComment = async (req, res) => {
    const taskId = req.params.taskId;
    const { body, commenter } = req.body;
    const comment = {
        body,
        time: new Date(),
        commenter
    };

    try {
        // Find the task by ID
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Add the comment to the task and save
        task.comments.push(comment);
        await task.save();

        res.status(200).json({ success: true, message: 'Comment added to task', task });
    } catch (error) {
        console.error('Error adding comment to task:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getTasksByUsername = async (req, res) => {
    const username = req.params.username;

    try {
        const tasks = await Task.find({ assignedTo: username, isComplete: false });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getTasksByGroupId = async (req, res) => {
    const groupId = req.params.groupId;
    try {
        const tasks = await Task.find({ groupId: groupId });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks by group ID:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getTaskByTaskId = async (req, res) => {
    const taskId = req.params.taskId;

    try {
        // Find the task by ID
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({ success: true, task });
    } catch (error) {
        console.error('Error marking task as complete:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = { createTask, markTaskComplete, addTaskComment, getTasksByUsername, getTasksByGroupId, getTaskByTaskId };
