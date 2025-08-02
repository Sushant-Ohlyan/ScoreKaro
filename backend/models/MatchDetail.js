const mongoose = require('mongoose');




const matchDetailSchema = new mongoose.Schema({
    teamAName: { type: String, required: true },
    teamBName: { type: String, required: true },
    teamAPlayerNames: { type: [String], required: true },
    teamBPlayerNames: { type: [String], required: true },
    venueName: { type: String, required: true },
    overs: { type: Number, required: true },
    ballType: { type: String, required: true },
    matchType: { type: String, required: true },
    umpireName1: { type: String, required: true },
    umpireName2: { type: String, required: true },
    umpireName3: { type: String, required: false },
    tossWonBy: { type: String, required: true },
    tossDecision: { type: String, required: true },

});

module.exports = mongoose.model('MatchDetail', matchDetailSchema);