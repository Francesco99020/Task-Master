const Group = require('../MongoSchemas/Group');

// Controller function for creating a group
const createGroup = async (req, res) => {
    const { name, hostUsername, description, users } = req.body;
    try {
        // Validate request body
        if (!name || !hostUsername) {
            return res.status(400).json({ success: false, message: 'Name and hostUsername are required fields' });
        }

        // Validate name (must not be blank and must contain at least one letter)
        const nameRegex = /^[^\s@#$!]/; // Regex to check if name doesn't contain only special characters
        if (!nameRegex.test(name)) {
            return res.status(400).json({ success: false, message: 'Name must not be blank or contain only special characters' });
        }

        // Check if a group with the same name and hostUsername already exists
        const existingGroup = await Group.findOne({ name, hostUsername });
        if (existingGroup) {
            return res.status(400).json({ success: false, message: 'A group with the same name already exists for this host' });
        }

        // Create group
        users.push(hostUsername);
        const groupData = { name, hostUsername, description: description || '', users: users || [] }; // Include description if provided
        const group = new Group(groupData);
        await group.save();

        res.status(201).json({ success: true, message: 'Group created successfully', group });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const deleteGroup = async (req, res) => {
    const groupId = req.params.groupId;
    try {
        await Group.findByIdAndDelete(groupId);

        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Controller function for adding users to a group
const addUserToGroup = async (req, res) => {
    const username = req.params.username;
    const groupId = req.params.groupId;

    try {
        // Find the group by _id
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        // Check if the user is already in the group
        if (group.users.includes(username)) {
            return res.status(400).json({ success: false, message: 'User is already in the group' });
        }

        // Add the user to the group
        group.users.push(username);
        await group.save();

        res.status(200).json({ success: true, message: 'User added to the group successfully', group });
    } catch (error) {
        console.error('Error adding user to group:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Controller function for removing a user from a group
const removeUserFromGroup = async (req, res) => {
    const username = req.params.username;
    const groupId = req.params.groupId;

    try {
        // Find the group by _id
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        // Check if the user to remove is in the group
        if (!group.users.includes(username)) {
            return res.status(404).json({ success: false, message: 'User not found in the group' });
        }

        // Remove the user from the group
        group.users = group.users.filter(user => user !== username);
        await group.save();

        res.status(200).json({ success: true, message: 'User removed from the group successfully', group });
    } catch (error) {
        console.error('Error removing user from group:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getGroupById = async (req, res) => {
    const { groupId } = req.params;

    try {
        // Find the group by _id
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        res.status(200).json({ success: true, group });
    } catch (error) {
        console.error('Error finding group by ID:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Controller function for finding all groups where the user is a host
const getGroupsByHostUsername = async (req, res) => {
    const { hostUsername } = req.params;

    try {
        // Find groups where the hostUsername matches
        const groups = await Group.find({ hostUsername });
        res.status(200).json({ success: true, groups });
    } catch (error) {
        console.error('Error finding groups by host username:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const findUserGroups = async (req, res) => {
    const username = req.params.username;

    try {
        // Find groups where the user is a member but not the host user
        const groups = await Group.find({ users: username, hostUsername: { $ne: username } });

        res.status(200).json({ success: true, groups });
    } catch (error) {
        console.error('Error finding user groups:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getGroupUsers = async (req, res) => {
    try {
        const groupId = req.params.groupId;

        // Find the group by its ID
        const group = await Group.findById(groupId);
    
        if (!group) {
          return res.status(404).json({ success: false, message: 'Group not found' });
        }
    
        // Extract and return the users array from the group document
        const users = group.users;
        res.json({ success: true, users });
      } catch (error) {
        console.error('Error fetching group users:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
  };
module.exports = { createGroup, addUserToGroup, removeUserFromGroup, getGroupById, getGroupsByHostUsername, findUserGroups, getGroupUsers, deleteGroup };