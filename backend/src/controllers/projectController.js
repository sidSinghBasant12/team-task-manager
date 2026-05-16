const prisma = require('../models/prismaClient');

// @desc    Create a new project
// @route   POST /api/v1/projects
// @access  Private (Admin Only)
const createProject = async (req, res) => {
  const { projectName, description, deadline, teamId, assignedUserIds } = req.body;

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can create projects' });
  }

  try {
    const project = await prisma.project.create({
      data: {
        projectName,
        description,
        deadline: deadline ? new Date(deadline) : null,
        teamId,
        assignedUsers: assignedUserIds ? {
          connect: assignedUserIds.map(id => ({ id }))
        } : undefined
      },
      include: { assignedUsers: true }
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'ADMIN') {
      projects = await prisma.project.findMany({
        include: {
          tasks: true,
          assignedUsers: {
            select: { id: true, name: true, avatar: true }
          }
        }
      });
    } else {
      projects = await prisma.project.findMany({
        where: {
          assignedUsers: {
            some: { id: req.user.id }
          }
        },
        include: {
          tasks: true,
          assignedUsers: {
            select: { id: true, name: true, avatar: true }
          }
        }
      });
    }
    res.status(200).json(projects);
  } catch (error) {
    const logger = require('../config/logger');
    logger.error('Error fetching projects:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private (Admin Only)
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { projectName, description, deadline, status, assignedUserIds } = req.body;

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can update projects' });
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        projectName,
        description,
        deadline: deadline ? new Date(deadline) : null,
        status,
        assignedUsers: assignedUserIds ? {
          set: assignedUserIds.map(id => ({ id }))
        } : undefined
      },
      include: { assignedUsers: true }
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private (Admin Only)
const deleteProject = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can delete projects' });
  }

  try {
    await prisma.project.delete({ where: { id } });
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/v1/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: true,
        assignedUsers: true,
        team: true
      }
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Check access
    if (req.user.role !== 'ADMIN' && !project.assignedUsers.some(u => u.id === req.user.id)) {
      return res.status(403).json({ error: 'Not authorized to view this project' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectById
};
