const User = require('../MongoSchemas/user');

const queryUser = async (req, res) => {
    try {
      const { query } = req.query;
  
      // Perform a database query to find users matching the search term
      const users = await User.find({ username: { $regex: query, $options: 'i' } });
  
      res.status(200).json({ success: true, users });
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  module.exports = { queryUser };