const mongoose = require('mongoose');
const { Schema } = mongoose;

const matchDetailSchema = new Schema({
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
    score:{type: Number, required: true},
    inning:{type:Number, required: true},
    wickets:{type:Number, required: true},    
    runRate:{type:Number, required:true},
    topPerformerBatTeamA:{type:String, required:true},
    topPerformerBatTeamB:{type:String, required:true},
    topPerformerBallTeamA:{type:String, required:true},
    topPerformerBallTeamB:{type:String, required:true},

});


module.exports = mongoose.model('MatchDetail', matchDetailSchema);
