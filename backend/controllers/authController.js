const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET || 'super_secret_jwt_token_key_for_mern_social_app_2026',
    { expiresIn: '30d' }
  );
};

// Local mock users store for offline fallback
const localUsers = {
  'shethbhjt': { _id: 'mock_user_1', username: 'shethbhjt', email: 'priya@example.com', passwordHash: '' },
  'jaiswamyn0': { _id: 'mock_user_2', username: 'jaiswamyn0', email: 'deepmala@example.com', passwordHash: '' },
  'fariha3yw3': { _id: 'mock_user_3', username: 'fariha3yw3', email: 'fariha@example.com', passwordHash: '' },
  'k5abq': { _id: 'mock_user_4', username: 'k5abq', email: 'kgamers@example.com', passwordHash: '' },
  'ideash3cnb': { _id: 'mock_user_5', username: 'ideash3cnb', email: 'kishun@example.com', passwordHash: '' },
  'senapaokl0': { _id: 'mock_user_6', username: 'senapaokl0', email: 'suman@example.com', passwordHash: '' },
  'uyiosase73': { _id: 'mock_user_7', username: 'uyiosase73', email: 'uyiosa@example.com', passwordHash: '' }
};

const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    if (!isDbConnected()) {
      console.log('Database not connected. Registering user in-memory.');
      const unameLower = username.toLowerCase();
      if (localUsers[unameLower]) {
        return res.status(400).json({ message: 'Username is already taken' });
      }

      const newUser = {
        _id: `mock_user_${Date.now()}`,
        username: username,
        email: email.toLowerCase(),
      };
      localUsers[unameLower] = newUser;

      return res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        token: generateToken(newUser)
      });
    }

    // Check for existing user by email
    const userExistsEmail = await User.findOne({ email });
    if (userExistsEmail) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check for existing user by username
    const userExistsUsername = await User.findOne({ username });
    if (userExistsUsername) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    if (!isDbConnected()) {
      console.log('Database not connected. Logging in user in-memory.');
      const identifier = emailOrUsername.toLowerCase();
      
      // Look up user by username or email in our local mock store
      let user = Object.values(localUsers).find(
        (u) => u.username.toLowerCase() === identifier || u.email.toLowerCase() === identifier
      );

      // If not found, dynamically register them in memory (convenient fallback)
      if (!user) {
        user = {
          _id: `mock_user_${Date.now()}`,
          username: emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername,
          email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@example.com`,
        };
        localUsers[user.username.toLowerCase()] = user;
      }

      return res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user)
      });
    }

    let user = await User.findOne({ email: emailOrUsername.toLowerCase() });
    if (!user) {
      user = await User.findOne({ username: emailOrUsername });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

module.exports = {
  signup,
  login
};
