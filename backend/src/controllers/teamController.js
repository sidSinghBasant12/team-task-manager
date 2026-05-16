const prisma = require('../models/prismaClient');

// @desc    Create a new team
// @route   POST /api/v1/teams
// @access  Private (Project Manager / Admin)
const createTeam = async (req, res) => {
  const { teamName } = req.body;

  if (!teamName) {
    return res.status(400).json({ error: 'Team name is required' });
  }

  const team = await prisma.teams.create({
    data: {
      teamName,
      createdBy: req.user.id,
      members: {
        create: {
          userId: req.user.id,
          role: 'ADMIN' // The creator gets admin access to the team
        }
      }
    },
    include: {
      members: true
    }
  });

  res.status(201).json(team);
};

// @desc    Get all teams for the logged-in user
// @route   GET /api/v1/teams
// @access  Private
const getMyTeams = async (req, res) => {
  const teams = await prisma.teams.findMany({
    where: {
      members: {
        some: {
          userId: req.user.id
        }
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true }
          }
        }
      },
      _count: {
        select: { projects: true }
      }
    }
  });

  res.status(200).json(teams);
};

// @desc    Add member to team
// @route   POST /api/v1/teams/:id/members
// @access  Private (Admin / Project Manager)
const addTeamMember = async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;

  // Find user by email
  const userToAdd = await prisma.user.findUnique({ where: { email } });
  if (!userToAdd) {
    return res.status(404).json({ error: 'User not found with this email' });
  }

  // Check if team exists and user is admin/manager of it
  const teamMember = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: id,
        userId: req.user.id
      }
    }
  });

  if (!teamMember || (teamMember.role !== 'ADMIN' && teamMember.role !== 'PROJECT_MANAGER')) {
    return res.status(403).json({ error: 'Not authorized to add members to this team' });
  }

  const newMember = await prisma.teamMember.create({
    data: {
      teamId: id,
      userId: userToAdd.id,
      role: role || 'DEVELOPER'
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true }
      }
    }
  });

  res.status(201).json(newMember);
};

module.exports = {
  createTeam,
  getMyTeams,
  addTeamMember
};
