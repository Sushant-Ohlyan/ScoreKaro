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

});





const thisInningSchema = new Schema({
    currentBattingTeam:{type:String, required: true},
    currentBallingTeam:{type:String, required:true},
    totalOvers:{type:String, required:true},
    totalScore:{type:Number,required:true},
    totalWickets:{type:Number,reqquired:true},
})



module.exports = mongoose.model('MatchDetail', matchDetailSchema);
