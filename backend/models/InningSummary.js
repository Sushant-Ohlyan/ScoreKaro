const mongoose = require('mongoose');

const inningSummarySchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'MatchSetup', required: true },
    battingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    bowlingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    overs: { type: Number, required: true },
    runs: { type: Number, required: true },
    wickets: { type: Number, required: true },
});

module.exports = mongoose.model('InningSummary', inningSummarySchema);

// team a name, team b name, overs, runs, wickets, run rate, inning number, match id, Top scorer, Top Performer