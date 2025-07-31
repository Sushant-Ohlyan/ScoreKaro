const express = require('express');
const router = express.Router();
const TeamManage = require('../models/TeamManage'); 
const TeamSetup = require('../models/TeamSetup');

router.get('/', async (req, res) => {
  try {
    const teams = await TeamSetup.find();
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
