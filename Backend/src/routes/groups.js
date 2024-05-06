const express = require('express');
const router = express.Router();
const { createGroup, addUserToGroup, removeUserFromGroup, getGroupById, getGroupsByHostUsername, findUserGroups, getGroupUsers, deleteGroup } = require('../controllers/groupsController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/create', verifyToken, createGroup);
router.delete('/:groupId/delete', verifyToken, deleteGroup);
router.post('/:groupId/:username/addUser', verifyToken, addUserToGroup);
router.delete('/:groupId/:username/removeUser', verifyToken, removeUserFromGroup);
router.get('/:groupId/users', verifyToken, getGroupUsers);
router.get('/:groupId', verifyToken, getGroupById);
router.get('/host/:hostUsername', verifyToken, getGroupsByHostUsername);
router.get('/member/:username', verifyToken, findUserGroups);

module.exports = router;
