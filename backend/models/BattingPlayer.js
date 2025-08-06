const mongoose =require('mongoose');

const battingPlayerSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    name: { type: String, required: true },
    runs: { type: Number, required: true },
    overs: { type: Number, required: true },
});

module.exports = mongoose.model('BattingPlayer', battingPlayerSchema);