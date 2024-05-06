const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../MongoSchemas/user');
const registerSchema = require('../schemas/registerSchema');
const { verifyToken } = require('../middleware/authMiddleware');


mongoose.connect('mongodb://localhost:27017/TaskMaster');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

router.post('/register', async (req, res) => {
    try {
      // Validate request body against the schema
      const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ success: false, message: error.details.map(detail => detail.message) });
      }
  
      // Check if username or email already exists in the database
      const existingUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username or email already exists' });
      }
  
      // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // If validation passes and user doesn't already exist, proceed with registration logic
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword // Save hashed password to the database
    });
    await newUser.save();
  
      res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid username or password' });
      }
  
      // Check if password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: 'Invalid username or password' });
      }
  
      // If username and password are valid, generate JWT token
      const token = jwt.sign({ userId: user._id }, 'X&W$z#5*8@2!vPq', { expiresIn: '1h' });
  
      // Return the JWT token in the response
      res.status(200).json({ success: true, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  });

  router.get('/profile/:username', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
  

module.exports = router;