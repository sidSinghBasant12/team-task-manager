const prisma = require('../models/prismaClient');

const getNotifications = async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.status(200).json(notifications);
};

const markAsRead = async (req, res) => {
  const { id } = req.params;
  const notification = await prisma.notification.update({
    where: { id, userId: req.user.id },
    data: { isRead: true }
  });
  res.status(200).json(notification);
};

module.exports = { getNotifications, markAsRead };
