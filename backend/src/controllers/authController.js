const bcrypt = require('bcryptjs');
const prisma = require('../models/prismaClient');
const generateToken = require('../utils/generateToken');
const logger = require('../config/logger');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please add all fields' });
  }

  // Check if user exists
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: req.body.role || 'DEVELOPER',
    },
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user.id, user.role),
    });
  } else {
    res.status(400).json({ error: 'Invalid user data' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user.id, user.role),
    });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
};

// @desc    Get user data
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
