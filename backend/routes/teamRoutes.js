const express = require('express');
const router = express.Router();
const TeamSetup = require('../models/TeamSetup');

router.post('/save', async (req, res) => {
  try {
    const { teamAName, teamBName, teamAPlayers, teamBPlayers } = req.body;
    const newSetup = new TeamSetup({ teamAName, teamBName, teamAPlayers, teamBPlayers });
    await newSetup.save();
    res.status(201).json({ message: "Teams saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
