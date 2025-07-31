import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Teamsetup.css";
import centerImg from "../assets/b.png"; // Replace with your actual image path
import axios from 'axios';

const TeamSetupPage = () => {
  const navigate = useNavigate();

  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [teamAPlayers, setTeamAPlayers] = useState([""]);
  const [teamBPlayers, setTeamBPlayers] = useState([""]);

  const handleTeamAPlayerChange = (index, value) => {
    const updated = [...teamAPlayers];
    updated[index] = value;
    setTeamAPlayers(updated);
  };

  const handleTeamBPlayerChange = (index, value) => {
    const updated = [...teamBPlayers];
    updated[index] = value;
    setTeamBPlayers(updated);
  };

  const addPlayerToTeamA = () => setTeamAPlayers([...teamAPlayers, ""]);
  const addPlayerToTeamB = () => setTeamBPlayers([...teamBPlayers, ""]);

  const handleSubmit = async () => {
  const data = {
    teamAName,
    teamBName,
    teamAPlayers,
    teamBPlayers,
  };

  try {
    const res = await axios.post("http://localhost:5000/api/teams/save", data);
    alert(res.data.message);
    console.log("Saved:", res.data);
  } catch (err) {
    console.error(err);
    alert("Error saving team data.");
  }
};


  return (
    <div className="team-setup-page">
      <h2>Team Setup</h2>
      <div className="team-setup-container">
        {/* Team A Card */}
        <div className="team-card">
          <h3>Team A</h3>
          <input
            type="text"
            placeholder="Enter Team A Name"
            value={teamAName}
            onChange={(e) => setTeamAName(e.target.value)}
          />
          <div className="players-section">
            <h4>Players</h4>
            {teamAPlayers.map((player, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Player ${index + 1}`}
                value={player}
                onChange={(e) => handleTeamAPlayerChange(index, e.target.value)}
              />
            ))}
            <button onClick={addPlayerToTeamA}>+ Add Player</button>
          </div>
        </div>

        {/* Center Image */}
        <div className="center-image">
          <img src={centerImg} alt="Center" />
        </div>

        {/* Team B Card */}
        <div className="team-card">
          <h3>Team B</h3>
          <input
            type="text"
            placeholder="Enter Team B Name"
            value={teamBName}
            onChange={(e) => setTeamBName(e.target.value)}
          />
          <div className="players-section">
            <h4>Players</h4>
            {teamBPlayers.map((player, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Player ${index + 1}`}
                value={player}
                onChange={(e) => handleTeamBPlayerChange(index, e.target.value)}
              />
            ))}
            <button onClick={addPlayerToTeamB}>+ Add Player</button>
          </div>
        </div>
      </div>

      <div className="button-group">
        <button className="submit-button" onClick={handleSubmit}>
          Save Teams
        </button>

        <button className="next-button" onClick={() => navigate("/matchsetup")}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TeamSetupPage;
