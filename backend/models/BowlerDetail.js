const mongoose = require('mongoose');


const bowlingPlayerSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    name: { type: String, required: true },
    overs: { type: Number, required: true },
    runs: { type: Number, required: true },
    wickets: { type: Number, required: true },
});

module.exports = mongoose.model('BowlerDetail',bowlingPlayerSchema);