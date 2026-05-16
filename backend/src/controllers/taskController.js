const prisma = require('../models/prismaClient');

// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  Private (Admin Only)
const createTask = async (req, res) => {
  const { title, description, priority, status, assignedTo, projectId, dueDate, estimatedHours } = req.body;

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can create tasks' });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        status: status || 'TODO',
        assignedTo,
        createdBy: req.user.id,
        projectId,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours
      },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        creator: { select: { id: true, name: true, avatar: true } }
      }
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private (Admin or Assigned User for status)
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, assignedTo, dueDate } = req.body;

  try {
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ error: 'Task not found' });

    // Role check
    const isAdmin = req.user.role === 'ADMIN';
    const isAssigned = existingTask.assignedTo === req.user.id;

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    // Members can only update status
    const updateData = isAdmin ? {
      title, description, priority, status, assignedTo,
      dueDate: dueDate ? new Date(dueDate) : undefined
    } : { status };

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        assignee: { select: { id: true, name: true, avatar: true } }
      }
    });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private (Admin Only)
const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can delete tasks' });
  }

  try {
    await prisma.task.delete({ where: { id } });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'ADMIN') {
      tasks = await prisma.task.findMany({
        include: { assignee: true, project: true }
      });
    } else {
      tasks = await prisma.task.findMany({
        where: { assignedTo: req.user.id },
        include: { assignee: true, project: true }
      });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update task status (Kanban drag and drop)
// @route   PATCH /api/v1/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (req.user.role !== 'ADMIN' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update status' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status }
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Upload attachment to task
// @route   POST /api/v1/tasks/:id/upload
// @access  Private
const uploadAttachment = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const attachment = await prisma.attachment.create({
      data: {
        taskId: id,
        fileUrl: req.file.path,
        uploadedBy: req.user.id
      }
    });
    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add comment to task
// @route   POST /api/v1/tasks/:id/comments
// @access  Private
const addComment = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        taskId: id,
        userId: req.user.id,
        message
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  updateTaskStatus,
  uploadAttachment,
  addComment
};
