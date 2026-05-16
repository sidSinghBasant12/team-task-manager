const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getProjects, 
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(authorizeRoles('ADMIN'), createProject);

router.route('/:id')
  .get(getProjectById)
  .put(authorizeRoles('ADMIN'), updateProject)
  .delete(authorizeRoles('ADMIN'), deleteProject);

module.exports = router;
