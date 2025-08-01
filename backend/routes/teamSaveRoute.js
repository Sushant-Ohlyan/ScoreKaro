const express = require('express');
const router = express.Router();
const TeamSave = require('../models/TeamSave');

router.post('/save', async (req, res) => {
  try {
    const { teamName, teamPlayers } = req.body;
    const newTeam = new TeamSave({ teamName, teamPlayers });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
