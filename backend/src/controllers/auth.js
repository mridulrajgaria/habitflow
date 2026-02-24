const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, name, password: hashedPassword });

    const token = generateToken(user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};


const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    // Validate it's a base64 image (max ~2MB)
    if (!avatar || !avatar.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    // Accurate base64 size check (strip header first)
    const base64Data = avatar.split(',')[1] || '';
    const sizeInBytes = Math.ceil((base64Data.length * 3) / 4);
    if (sizeInBytes > 3 * 1024 * 1024) { // 3MB limit server-side (frontend compresses to ~1MB)
      return res.status(400).json({ error: 'Image too large. Max 3MB.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    );

    res.json({ user, message: 'Avatar updated!' });
  } catch (error) {
    console.error('Avatar update error:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
};

const removeAvatar = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: null },
      { new: true }
    );
    res.json({ user, message: 'Avatar removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove avatar' });
  }
};

module.exports = { register, login, getMe, updateAvatar, removeAvatar };
