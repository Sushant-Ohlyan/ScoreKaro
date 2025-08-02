const express = require('express');
const router = express.Router();
const MatchDetail = require('../models/MatchDetail');
const MatchSetup = require('../models/MatchSetup');
const TeamSetup = require('../models/TeamSetup');

const addMatchDetail = async (req, res) => {
  try {
    const latestTeamSetup = await TeamSetup.findOne().sort({ createdAt: -1 });
    const latestMatchSetup = await MatchSetup.findOne().sort({ createdAt: -1 });

    if (!latestTeamSetup || !latestMatchSetup) {
      return res.status(400).json({ message: 'Match setup or team setup not found' });
    }

    const matchDetail = new MatchDetail({
      teamAName: latestTeamSetup.teamAName,
      teamBName: latestTeamSetup.teamBName,
      teamAPlayerNames: latestTeamSetup.teamAPlayers,
      teamBPlayerNames: latestTeamSetup.teamBPlayers,
      venueName: latestMatchSetup.venue,
      overs: latestMatchSetup.overs,
      ballType: latestMatchSetup.ballType,
      matchType: latestMatchSetup.matchType,
      umpireName1: latestMatchSetup.umpireName1,
      umpireName2: latestMatchSetup.umpireName2,
      umpireName3: latestMatchSetup.umpireName3,
      tossWonBy: latestMatchSetup.tossWonBy,
      tossDecision: latestMatchSetup.tossDecision,
    });

    await matchDetail.save();
    res.status(201).json(matchDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.get('/', async (req, res) => {
  try {
    const innings = await MatchDetail.find();
    res.status(200).json(innings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const matchDetail = await MatchDetail.findById(req.params.id);
    if (!matchDetail) {
      return res.status(404).json({ message: 'Match detail not found' });
    }
    res.status(200).json(matchDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/latest', async (req, res) => {
  try {
    const latestMatchDetail = await MatchDetail.findOne().sort({ createdAt: -1 });
    if (!latestMatchDetail) {
      return res.status(404).json({ message: 'No match details found' });
    }
    res.status(200).json(latestMatchDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/latest/:teamName', async (req, res) => {
  try {
    const { teamName } = req.params;
    const latestMatchDetail = await MatchDetail.findOne({
      $or: [{ teamAName: teamName }, { teamBName: teamName }],
    }).sort({ createdAt: -1 });

    if (!latestMatchDetail) {
      return res.status(404).json({ message: 'No match details found for the specified team' });
    }
    res.status(200).json(latestMatchDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/latest/:teamName/:matchType', async (req, res) => {
  try {
    const { teamName, matchType } = req.params;
    const latestMatchDetail = await MatchDetail.findOne({
      $or: [{ teamAName: teamName }, { teamBName: teamName }],
      matchType: matchType
    }).sort({ createdAt: -1 });

    if (!latestMatchDetail) {
      return res.status(404).json({ message: 'No match details found for the specified team and match type' });
    }
    res.status(200).json(latestMatchDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;

