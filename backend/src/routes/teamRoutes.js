const express = require('express');
const router = express.Router();
const { createTeam, getMyTeams, addTeamMember } = require('../controllers/teamController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createTeam)
  .get(protect, getMyTeams);

router.route('/:id/members')
  .post(protect, addTeamMember);

module.exports = router;
