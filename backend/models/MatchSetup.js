const mongoose = require('mongoose');

const matchSetupSchema = new mongoose.Schema({
  overs: { type: Number, required: true },
  ballType: { type: String, required: true },
  matchType: { type: String, required: true },
  venue: { type: String, required: true },
  umpireName1: { type: String, required: true },
  umpireName2: { type: String, required: true },
  umpireName3: { type: String, required: false },
  tossWonBy: { type: String, required: true },
  tossDecision: { type: String, required: true },
}, { timestamps: true });

const MatchSetup = mongoose.model('MatchSetup', matchSetupSchema);

module.exports = MatchSetup;
