const prisma = require('../models/prismaClient');
const bcrypt = require('bcryptjs');

// @desc    Get all users (Members)
// @route   GET /api/v1/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can view member list' });
  }

  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a new member
// @route   POST /api/v1/users
// @access  Private (Admin only)
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can create members' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'DEVELOPER'
      },
      select: { id: true, name: true, email: true, role: true }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update a member
// @route   PUT /api/v1/users/:id
// @access  Private (Admin only)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can update members' });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, role },
      select: { id: true, name: true, email: true, role: true }
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a member
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can delete members' });
  }

  if (id === req.user.id) {
    return res.status(400).json({ error: 'You cannot delete yourself' });
  }

  try {
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/v1/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  const { name, email, avatar } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email, avatar },
      select: { id: true, name: true, email: true, role: true, avatar: true }
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update password
// @route   PUT /api/v1/users/password
// @access  Private
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  updatePassword
};
