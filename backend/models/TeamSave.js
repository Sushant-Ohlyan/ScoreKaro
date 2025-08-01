const mongoose = require('mongoose');

const teamSaveSchema = new mongoose.Schema({
    teamName: String,
    teamPlayers: [String],
});

module.exports = mongoose.model('TeamSave', teamSaveSchema);
