const express = require('express');
const router = express.Router();
const TeamSave = require('../models/TeamSave');

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await TeamSave.find();
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a team
router.post('/', async (req, res) => {
  try {
    const { teamName, teamPlayers } = req.body;
    const newTeam = new TeamSave({ teamName, teamPlayers });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a team
router.delete('/:id', async (req, res) => {
  try {
    await TeamSave.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
