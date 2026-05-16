const prisma = require('../models/prismaClient');
const logger = require('../config/logger');
const { getIO } = require('../sockets');

/**
 * Calculates workload for team members and emits real-time updates.
 * Formula: Workload = activeTasks + (overdueTasks * 2) + estimatedHours
 */
const balanceWorkload = async (teamId) => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          include: {
            assignedTasks: {
              where: {
                teamId: teamId,
                status: { not: 'COMPLETED' }
              }
            }
          }
        }
      }
    });

    const workloadData = teamMembers.map(member => {
      const activeTasks = member.user.assignedTasks.filter(t => t.status !== 'COMPLETED');
      
      const overdueTasks = activeTasks.filter(t => {
        return t.dueDate && new Date(t.dueDate) < new Date();
      });

      const estimatedHours = activeTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

      // Workload algorithm
      const workloadScore = activeTasks.length + (overdueTasks.length * 2) + estimatedHours;

      return {
        userId: member.userId,
        name: member.user.name,
        activeTasks: activeTasks.length,
        overdueTasks: overdueTasks.length,
        estimatedHours,
        workloadScore
      };
    });

    // We can emit this via Socket.io to the project/team room
    try {
      const io = getIO();
      io.to(`team_${teamId}`).emit('workload_update', workloadData);
      logger.info(`Emitted workload update for team ${teamId}`);
    } catch (socketErr) {
      // socket.io might not be initialized if testing or running isolated job
      logger.warn(`Socket.io emit failed: ${socketErr.message}`);
    }

    return workloadData;

  } catch (error) {
    logger.error('Error balancing workload:', error);
    throw error;
  }
};

module.exports = {
  balanceWorkload
};
