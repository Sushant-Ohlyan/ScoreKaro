import React, { useState } from "react";
import "../style/MatchSetup.css";
import b from "../assets/b.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BackButton from "./BackButton";

const MatchSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ team data from TeamSetup page
  const teamData = location.state || {};
  const { teamAName = "Team A", teamBName = "Team B" } = teamData;

  // ✅ match details state
  const [matchDetails, setMatchDetails] = useState({
    overs: "",
    customOvers: "",
    venue: "",
    ballType: "Leather",
    umpire1: "",
    umpire2: "",
    umpire3: "",
    matchType: "Day",
    tossWinner: "",
    tossDecision: "",
    matchDate: "",
    matchTime: "",
  });

  // ✅ smart handleChange (auto clear umpire3 if umpire2 is empty)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatchDetails((prev) => {
      let updated = { ...prev, [name]: value };
      if (name === "umpire2" && value.trim() === "") {
        updated.umpire3 = "";
      }
      return updated;
    });
  };

  // ✅ submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate date/time
    if (!matchDetails.matchDate || !matchDetails.matchTime) {
      alert("Please select match date and time.");
      return;
    }

    // ✅ proper overs logic
    const oversValue =
      matchDetails.overs === "Custom"
        ? Number(matchDetails.customOvers)
        : matchDetails.overs === "Test"
        ? "Test"
        : Number(matchDetails.overs);

    const matchData = {
      overs: oversValue,
      venue: matchDetails.venue.trim(),
      ballType: matchDetails.ballType,
      matchType: matchDetails.matchType,
      umpireName1: matchDetails.umpire1.trim(),
      umpireName2: matchDetails.umpire2.trim(),
      umpireName3: matchDetails.umpire3.trim(),
      tossWonBy: matchDetails.tossWinner,
      tossDecision: matchDetails.tossDecision,
      matchDate: matchDetails.matchDate,
      matchTime: matchDetails.matchTime,
    };

    // ✅ merge team + match setup
    const finalData = { ...teamData, ...matchData };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/match-setup/save",
        finalData
      );
      alert(res.data.message || "Match setup saved!");

      // ✅ pass data to Scoring Page
      navigate("/match", { state: finalData });
    } catch (error) {
      console.error("Error saving match setup:", error);
      alert("Failed to save match setup. Please try again.");
    }
  };

  return (
    <div className="match-setup-page">
      <h2>Match Setup</h2>
      <div className="setup-layout">
        {/* LEFT COLUMN */}
        <div className="left-column">
          {/* Overs */}
          <div className="card">
            <h3>Overs</h3>
            <div className="options">
              {["20", "50", "Test", "Custom"].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="overs"
                    value={type}
                    checked={matchDetails.overs === type}
                    onChange={handleChange}
                  />{" "}
                  {type}
                </label>
              ))}
            </div>
            {matchDetails.overs === "Custom" && (
              <input
                type="number"
                name="customOvers"
                placeholder="Enter Overs"
                value={matchDetails.customOvers}
                onChange={handleChange}
              />
            )}
          </div>

          {/* Ball Type */}
          <div className="card">
            <h3>Ball Type</h3>
            <div className="options">
              {["Leather", "Tennis", "Rubber"].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="ballType"
                    value={type}
                    checked={matchDetails.ballType === type}
                    onChange={handleChange}
                  />{" "}
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Match Type */}
          <div className="card">
            <h3>Match Type</h3>
            <div className="options">
              {["Day", "Day-Night", "Night"].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="matchType"
                    value={type}
                    checked={matchDetails.matchType === type}
                    onChange={handleChange}
                  />{" "}
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER IMAGE */}
        <div className="center-image">
          <img src={b} alt="Cricket" />
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">
          {/* Date & Time */}
          <div className="card">
            <h3>Match Schedule</h3>
            <label>Date:</label>
            <input
              type="date"
              name="matchDate"
              value={matchDetails.matchDate}
              onChange={handleChange}
              required
            />
            <label>Time:</label>
            <input
              type="time"
              name="matchTime"
              value={matchDetails.matchTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* Venue */}
          <div className="card">
            <h3>Venue</h3>
            <input
              type="text"
              name="venue"
              placeholder="Enter Venue"
              value={matchDetails.venue}
              onChange={handleChange}
              required
            />
          </div>

          {/* Umpires */}
          <div className="card">
            <h3>Umpires</h3>
            <input
              type="text"
              name="umpire1"
              placeholder="Enter Umpire 1"
              value={matchDetails.umpire1}
              onChange={handleChange}
            />
            <input
              type="text"
              name="umpire2"
              placeholder="Enter Umpire 2"
              value={matchDetails.umpire2}
              onChange={handleChange}
            />
            {matchDetails.umpire2.trim() !== "" && (
              <input
                type="text"
                name="umpire3"
                placeholder="Enter Umpire 3 (Optional)"
                value={matchDetails.umpire3}
                onChange={handleChange}
              />
            )}
          </div>

          {/* Toss */}
          <div className="card">
            <h3>Toss</h3>
            <select
              name="tossWinner"
              value={matchDetails.tossWinner}
              onChange={handleChange}
            >
              <option value="">Select Toss Winner</option>
              <option value={teamAName}>{teamAName}</option>
              <option value={teamBName}>{teamBName}</option>
            </select>

            <select
              name="tossDecision"
              value={matchDetails.tossDecision}
              onChange={handleChange}
            >
              <option value="">Select Decision</option>
              <option value="Bat">Bat</option>
              <option value="Bowl">Bowl</option>
            </select>
          </div>
        </div>
      </div>

      <div className="back-btn">
        <BackButton />
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        Start Match
      </button>
    </div>
  );
};

export default MatchSetup;
