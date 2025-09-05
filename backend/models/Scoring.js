// const mongoose = require("mongoose");

// const ballSchema = new mongoose.Schema({
//   ballNumber: Number,
//   runs: { type: Number, default: 0 },
//   wicket: { type: Boolean, default: false },
//   extra: {
//     type: String,
//     enum: ["wide", "no-ball", "bye", "leg-bye", null],
//     default: null
//   }
// });

// const overSchema = new mongoose.Schema({
//   overNumber: Number,
//   balls: [ballSchema]
// });

// const inningsSchema = new mongoose.Schema({
//   team: String, // Team name (Team A or Team B)
//   overs: [overSchema],
//   totalRuns: { type: Number, default: 0 },
//   wickets: { type: Number, default: 0 }
// });

// const scoringSchema = new mongoose.Schema(
//   {
//     matchId: { type: mongoose.Schema.Types.ObjectId, ref: "MatchSetup", required: true },
//     teamSetupId: { type: mongoose.Schema.Types.ObjectId, ref: "TeamSetup", required: true },
//     innings: [inningsSchema],
//     currentInnings: { type: Number, default: 1 },
//     currentOver: { type: Number, default: 1 },
//     currentBall: { type: Number, default: 1 },

//     // 🏏 Match completion details
//     matchCompleted: { type: Boolean, default: false },
//     winner: { type: String, default: null }, // Winning team name or "Draw"
//     result: { type: String, default: null }  // Human-readable result summary
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Scoring", scoringSchema);
// models/Scoring.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

// 🏏 Batsman Schema
const batsmanSchema = new Schema({
  name: { type: String, required: true },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  strikeRate: { type: Number, default: 0 },
  isOut: { type: Boolean, default: false },
  howOut: { type: String, default: "" }, // bowled, caught, run out, etc.
});

// 🏏 Bowler Schema
const bowlerSchema = new Schema({
  name: { type: String, required: true },
  overs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  maidens: { type: Number, default: 0 },
  runsConceded: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  economy: { type: Number, default: 0 },
});

// 🏏 Ball Schema
const ballSchema = new Schema({
  ballNumber: Number,
  runs: { type: Number, default: 0 },
  wicket: { type: Boolean, default: false },
  batsman: { type: String }, // who faced
  bowler: { type: String },  // who bowled
  description: { type: String }, // e.g. "FOUR through covers"
  extra: {
    type: String,
    enum: ["wide", "no-ball", "bye", "leg-bye", null],
    default: null,
  },
});

// 🏏 Over Schema
const overSchema = new Schema({
  overNumber: Number,
  balls: [ballSchema],
});

// 🏏 Inning Schema
const inningSchema = new Schema({
  battingTeam: { type: String, required: true },
  bowlingTeam: { type: String, required: true },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  overs: { type: Number, default: 0 }, // completed overs
  balls: { type: Number, default: 0 }, // current ball count
  oversDetail: [overSchema], // every ball
  batsmen: [batsmanSchema],
  bowlers: [bowlerSchema],
  extras: {
    wides: { type: Number, default: 0 },
    noBalls: { type: Number, default: 0 },
    legByes: { type: Number, default: 0 },
    byes: { type: Number, default: 0 },
  },
  fallOfWickets: [
    {
      runs: Number,
      wicketNumber: Number,
      over: String,
      batsmanOut: String,
      bowler: String,
    },
  ],
  commentary: [String], // optional log
});

// 🏏 Scoring Schema
const scoringSchema = new Schema(
  {
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "MatchSetup", required: true },
    teamSetupId: { type: mongoose.Schema.Types.ObjectId, ref: "TeamSetup", required: true },

    innings: [inningSchema], // both innings stored here
    currentInnings: { type: Number, default: 1 }, // 1 or 2
    currentOver: { type: Number, default: 1 },
    currentBall: { type: Number, default: 1 },

    matchCompleted: { type: Boolean, default: false },

    // Final result
    winner: { type: String, default: null },
    result: { type: String, default: null }, // "India won by 20 runs"
    manOfTheMatch: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scoring", scoringSchema);
