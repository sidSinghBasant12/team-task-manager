const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask, 
  updateTaskStatus, 
  uploadAttachment, 
  addComment 
} = require('../controllers/taskController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(authorizeRoles('ADMIN'), createTask);

router.route('/:id')
  .put(updateTask)
  .delete(authorizeRoles('ADMIN'), deleteTask);

router.route('/:id/status')
  .patch(updateTaskStatus);

router.route('/:id/upload')
  .post(upload.single('file'), uploadAttachment);

router.route('/:id/comments')
  .post(addComment);

module.exports = router;
