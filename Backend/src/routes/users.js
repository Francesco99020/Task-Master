const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { queryUser } = require('../controllers/usersController');

router.get('/search', verifyToken, queryUser);

module.exports = router;