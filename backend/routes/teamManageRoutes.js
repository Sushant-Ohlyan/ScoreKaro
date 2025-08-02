const express = require('express');
const router = express.Router();
const TeamSave = require('../models/TeamSave');


router.get('/', async (req, res) => {
  try {
    const teams = await TeamSave.find();
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

