const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
require('dotenv').config();

const User = require('./models/User');
const Post = require('./models/Post');

// Force DNS servers to local gateway to fix querySrv DNS resolution errors on Windows/certain networks
try {
  dns.setServers(['192.168.0.1']);
} catch (err) {
  console.warn('Unable to set DNS servers, proceeding with default resolver:', err.message);
}

const mockUsers = [
  { username: 'shethbhjt', email: 'priya@example.com', password: 'password123' },
  { username: 'jaiswamyn0', email: 'deepmala@example.com', password: 'password123' },
  { username: 'fariha3yw3', email: 'fariha@example.com', password: 'password123' },
  { username: 'k5abq', email: 'kgamers@example.com', password: 'password123' },
  { username: 'ideash3cnb', email: 'kishun@example.com', password: 'password123' },
  { username: 'senapaokl0', email: 'suman@example.com', password: 'password123' },
  { username: 'uyiosase73', email: 'uyiosa@example.com', password: 'password123' },
];

const seedDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/social_post_app';
    console.log(`Connecting to database: ${connStr}...`);
    await mongoose.connect(connStr, {
      family: 4
    });
    console.log('Connected to MongoDB.');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing users and posts.');

    // Hash passwords and save users
    const userMap = {};
    const salt = await bcrypt.genSalt(10);

    for (const u of mockUsers) {
      const hashedPassword = await bcrypt.hash(u.password, salt);
      const newUser = new User({
        username: u.username,
        email: u.email,
        password: hashedPassword
      });
      const savedUser = await newUser.save();
      userMap[u.username] = savedUser;
      console.log(`Registered user: ${u.username}`);
    }

    const now = Date.now();

    // Seed Posts
    const mockPosts = [
      {
        userId: userMap['shethbhjt']._id,
        username: 'shethbhjt',
        text: 'Hello',
        likes: [],
        comments: [],
        createdAt: new Date(now - 15 * 60 * 60 * 1000 + 30 * 1000) // 15 hours ago
      },
      {
        userId: userMap['jaiswamyn0']._id,
        username: 'jaiswamyn0',
        text: 'Hloo evening 🌃',
        likes: [],
        comments: [],
        createdAt: new Date(now - 15 * 60 * 60 * 1000 + 20 * 1000) // 15 hours ago
      },
      {
        userId: userMap['fariha3yw3']._id,
        username: 'fariha3yw3',
        text: 'Wishing everyone a peaceful and blessed day! ✨',
        likes: [],
        comments: [],
        createdAt: new Date(now - 15 * 60 * 60 * 1000) // 15 hours ago
      },
      {
        userId: userMap['k5abq']._id,
        username: 'k5abq',
        text: 'Good evening',
        likes: [],
        comments: [],
        createdAt: new Date(now - 16 * 60 * 60 * 1000 + 40 * 1000) // 16 hours ago
      },
      {
        userId: userMap['ideash3cnb']._id,
        username: 'ideash3cnb',
        text: '',
        image: 'earnings_post.png',
        likes: [],
        comments: [],
        createdAt: new Date(now - 16 * 60 * 60 * 1000 + 30 * 1000) // 16 hours ago
      },
      {
        userId: userMap['senapaokl0']._id,
        username: 'senapaokl0',
        text: '',
        image: 'train_post.png',
        likes: [],
        comments: [],
        createdAt: new Date(now - 16 * 60 * 60 * 1000 + 20 * 1000) // 16 hours ago
      },
      {
        userId: userMap['uyiosase73']._id,
        username: 'uyiosase73',
        text: 'Working on a new project, stay tuned! 🚀',
        likes: [],
        comments: [],
        createdAt: new Date(now - 16 * 60 * 60 * 1000) // 16 hours ago
      }
    ];

    for (const p of mockPosts) {
      const newPost = new Post(p);
      await newPost.save();
      console.log(`Created post by user: ${p.username}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();
