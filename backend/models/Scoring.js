const mongoose = require("mongoose");

const ballSchema = new mongoose.Schema({
  ballNumber: Number,
  runs: { type: Number, default: 0 },
  wicket: { type: Boolean, default: false },
  extra: {
    type: String,
    enum: ["wide", "no-ball", "bye", "leg-bye", null],
    default: null
  }
});

const overSchema = new mongoose.Schema({
  overNumber: Number,
  balls: [ballSchema]
});

const inningsSchema = new mongoose.Schema({
  team: String, // Team name (Team A or Team B)
  overs: [overSchema],
  totalRuns: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 }
});

const scoringSchema = new mongoose.Schema(
  {
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "MatchSetup", required: true },
    teamSetupId: { type: mongoose.Schema.Types.ObjectId, ref: "TeamSetup", required: true },
    innings: [inningsSchema],
    currentInnings: { type: Number, default: 1 },
    currentOver: { type: Number, default: 1 },
    currentBall: { type: Number, default: 1 },

    // 🏏 Match completion details
    matchCompleted: { type: Boolean, default: false },
    winner: { type: String, default: null }, // Winning team name or "Draw"
    result: { type: String, default: null }  // Human-readable result summary
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scoring", scoringSchema);