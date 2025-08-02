const mongoose = require('mongoose');

const ongoingInningSchema = new mongoose.Schema({
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'MatchSetup', required: true },
    battingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    bowlingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    overs: { type: Number, required: true },
});

module.exports = mongoose.model('OnGoingInning', ongoingInningSchema);