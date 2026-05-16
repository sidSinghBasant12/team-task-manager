const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  updateProfile, 
  updatePassword 
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(protect);

// Admin only routes
router.route('/')
  .get(authorizeRoles('ADMIN'), getUsers)
  .post(authorizeRoles('ADMIN'), createUser);

router.route('/:id')
  .put(authorizeRoles('ADMIN'), updateUser)
  .delete(authorizeRoles('ADMIN'), deleteUser);

// User routes
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

module.exports = router;
