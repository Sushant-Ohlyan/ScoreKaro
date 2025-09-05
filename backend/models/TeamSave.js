const mongoose = require('mongoose');

const teamSaveSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  teamPlayers: { type: [String], default: [] },
});

module.exports = mongoose.model('TeamSave', teamSaveSchema);
