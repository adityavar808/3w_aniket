const mongoose = require('mongoose');
const Post = require('../models/Post');

// Robust local in-memory fallback array matching the screenshots exactly
let mockPosts = [
  {
    _id: "mock_post_1",
    userId: "mock_user_1",
    username: "shethbhjt",
    text: "Hello",
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000 + 30 * 1000).toISOString()
  },
  {
    _id: "mock_post_2",
    userId: "mock_user_2",
    username: "jaiswamyn0",
    text: "Hloo evening 🌃",
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000 + 20 * 1000).toISOString()
  },
  {
    _id: "mock_post_3",
    userId: "mock_user_3",
    username: "fariha3yw3",
    text: "Wishing everyone a peaceful and blessed day! ✨",
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "mock_post_4",
    userId: "mock_user_4",
    username: "k5abq",
    text: "Good evening",
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000 + 40 * 1000).toISOString()
  },
  {
    _id: "mock_post_5",
    userId: "mock_user_5",
    username: "ideash3cnb",
    text: "",
    image: "earnings_post.png",
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000 + 30 * 1000).toISOString()
  },
  {
    _id: "mock_post_6",
    userId: "mock_user_6",
    username: "senapaokl0",
    text: "",
    image: "train_post.png",
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000 + 20 * 1000).toISOString()
  },
  {
    _id: "mock_post_7",
    userId: "mock_user_7",
    username: "uyiosase73",
    text: "Working on a new project, stay tuned! 🚀",
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
  }
];

const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let imageFilename = null;

    if (req.file) {
      imageFilename = req.file.filename;
    }

    if (!text && !imageFilename) {
      return res.status(400).json({ message: 'Post must contain at least text or an image' });
    }

    if (!isDbConnected()) {
      console.log('Database not connected. Creating post in-memory.');
      const newPost = {
        _id: `mock_post_${Date.now()}`,
        userId: req.user.id || 'guest',
        username: req.user.username || 'guest',
        text: text || '',
        image: imageFilename,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
      };
      mockPosts = [newPost, ...mockPosts];
      return res.status(201).json(newPost);
    }

    const newPost = new Post({
      userId: req.user.id,
      username: req.user.username,
      text: text || '',
      image: imageFilename,
      likes: [],
      comments: []
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating post', error: error.message });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      console.log('Database not connected. Serving posts from memory.');
      // Return local copy sorted by newest first
      const sortedPosts = [...mockPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(sortedPosts);
    }

    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching posts', error: error.message });
  }
};

// @desc    Like / Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const username = req.user.username;

    if (!isDbConnected()) {
      console.log(`Database not connected. Liking post ${req.params.id} in-memory.`);
      const postIndex = mockPosts.findIndex((p) => p._id === req.params.id);
      if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const post = mockPosts[postIndex];
      const alreadyLiked = post.likes.includes(username);

      if (alreadyLiked) {
        post.likes = post.likes.filter((likeUsername) => likeUsername !== username);
      } else {
        post.likes.push(username);
      }

      mockPosts[postIndex] = post;
      return res.json(post);
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      post.likes = post.likes.filter((likeUsername) => likeUsername !== username);
    } else {
      post.likes.push(username);
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while liking post', error: error.message });
  }
};

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
const commentPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    if (!isDbConnected()) {
      console.log(`Database not connected. Commenting on post ${req.params.id} in-memory.`);
      const postIndex = mockPosts.findIndex((p) => p._id === req.params.id);
      if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const post = mockPosts[postIndex];
      const newComment = {
        _id: `mock_comment_${Date.now()}`,
        username: req.user.username,
        text: text,
        createdAt: new Date().toISOString()
      };

      post.comments.push(newComment);
      mockPosts[postIndex] = post;
      return res.json(post);
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      username: req.user.username,
      text: text,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding comment', error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  likePost,
  commentPost
};
