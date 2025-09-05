const express = require("express");
const router = express.Router();
const Scoring = require("../models/Scoring");
const MatchSetup = require("../models/MatchSetup");
const TeamSetup = require("../models/TeamSetup");

// 🎯 Start Scoring (Inning 1)
router.post("/start", async (req, res) => {
  try {
    const { matchId, teamSetupId, battingTeam } = req.body;

    const match = await MatchSetup.findById(matchId);
    const teamSetup = await TeamSetup.findById(teamSetupId);

    if (!match || !teamSetup) {
      return res.status(404).json({ error: "Match or Teams not found" });
    }

    const scoring = new Scoring({
      matchId,
      teamSetupId,
      innings: [
        { team: battingTeam, overs: [], totalRuns: 0, wickets: 0 }
      ],
      currentInnings: 1,
      matchCompleted: false
    });

    await scoring.save();
    res.status(201).json(scoring);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🎯 Save Over Update
router.put("/over/:id", async (req, res) => {
  try {
    const { score, wickets, overs, batsmen, bowlers, ballHistory } = req.body;
    const scoring = await Scoring.findById(req.params.id);
    if (!scoring) return res.status(404).json({ error: "Scoring not found" });

    let inning = scoring.innings[scoring.currentInnings - 1];
    inning.overs.push({ score, wickets, overs, batsmen, bowlers, ballHistory });

    // update totals
    inning.totalRuns = score;
    inning.wickets = wickets;

    await scoring.save();
    res.json(scoring);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🎯 End Inning
router.post("/inning-complete/:id", async (req, res) => {
  try {
    const scoring = await Scoring.findById(req.params.id)
      .populate("teamSetupId");
    if (!scoring) return res.status(404).json({ error: "Scoring not found" });

    if (scoring.currentInnings === 1) {
      // Switch to second innings
      const teamSetup = scoring.teamSetupId;
      const firstTeam = scoring.innings[0].team;
      const nextTeam =
        firstTeam === teamSetup.teamAName ? teamSetup.teamBName : teamSetup.teamAName;

      scoring.innings.push({ team: nextTeam, overs: [], totalRuns: 0, wickets: 0 });
      scoring.currentInnings = 2;
    }

    await scoring.save();
    res.json(scoring);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🎯 End Match
router.post("/match-complete/:id", async (req, res) => {
  try {
    const scoring = await Scoring.findById(req.params.id);
    if (!scoring) return res.status(404).json({ error: "Scoring not found" });

    const team1 = scoring.innings[0];
    const team2 = scoring.innings[1];

    scoring.matchCompleted = true;

    if (team1.totalRuns > team2.totalRuns) {
      scoring.winner = team1.team;
      scoring.result = `${team1.team} won by ${team1.totalRuns - team2.totalRuns} runs`;
    } else if (team2.totalRuns > team1.totalRuns) {
      scoring.winner = team2.team;
      scoring.result = `${team2.team} won by ${10 - team2.wickets} wickets`;
    } else {
      scoring.winner = "Draw";
      scoring.result = "Match tied";
    }

    await scoring.save();
    res.json(scoring);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🎯 Get Scoring State
router.get("/:id", async (req, res) => {
  try {
    const scoring = await Scoring.findById(req.params.id)
      .populate("matchId")
      .populate("teamSetupId");
    res.json(scoring);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
