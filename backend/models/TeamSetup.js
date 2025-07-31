const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamAName: String,
  teamBName: String,
  teamAPlayers: [String],
  teamBPlayers: [String],
}, { timestamps: true });

module.exports = mongoose.model('TeamSetup', teamSchema);
