const express = require('express');
const router = express.Router();
const MatchSetup = require('../models/MatchSetup');

router.post('/save', async (req, res) => {
  try {
    const matchSetup = new MatchSetup(req.body);
    await matchSetup.save();
    res.status(201).json({ message: "Match setup saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
