const express = require('express');
const router = express.Router();
const TeamSetup = require('../models/TeamSetup');
const TeamSave = require('../models/TeamSave');
const TeamManage = require('../models/TeamManage');

router.get('/', async (req, res) => {
  try {
    const teams = await TeamSave.find();
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// res.status(200).json({ teamLogo, teamSetup, teamSave });    
// const teamLogo = await TeamManage.find();
// const teamSetup = await TeamSetup.find();