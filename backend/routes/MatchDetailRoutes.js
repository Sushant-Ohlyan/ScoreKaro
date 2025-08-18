const express = require('express');
const router = express.Router();
const MatchDetail = require('../models/MatchDetail');
const MatchSetup = require('../models/MatchSetup');
const TeamSetup = require('../models/TeamSetup');
const BattingPlayer=require('../models/BattingPlayer');
const BowlerDetail=require('../models/BowlerDetail');

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
    const matches = await MatchDetail.find();
    res.status(200).json(matches);
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



router.put('/:id', async (req, res) => {
  try {
    const updateFields = req.body;
    const matchDetail = await MatchDetail.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!matchDetail) {
      return res.status(404).json({ message: 'Match detail not found' });
    }
    res.status(200).json(matchDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const match = await MatchDetail.findByIdAndDelete(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match detail not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/batter-score', async (req, res) => {
  const { teamName, name, runs, overs } = req.body;
  try {
    const updatedPlayer = await BattingPlayer.findOneAndUpdate(
      { teamName, name },
      { runs, overs },
      { new: true, upsert: false, runValidators: true }
    );
    if (!updatedPlayer) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.status(200).json(updatedPlayer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/bowler-detail', async(req,res)=>{

  const {teamName,name,overs,runs,wickets}= req.body;

  try{
    const updatedPlayer = await BowlerDetail.findOneAndUpdate({teamName,name},{overs,runs,wickets},{new:true, upsert:false,runValidators:true});
  if(!updatedPlayer){
    return res.status(404).json({error:'player not found'});
  }
  res.status(200).json(updatedPlayer);
} catch(err){
  res.status(400).json({error :err.message});
}
});

router.get('/inning-summary', async(req,res)=>{
  try {
    const matches = await MatchDetail.find();
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

module.exports = router;