import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Teamsetup.css";
import centerImg from "../assets/b.png"; 
import axios from "axios";
import BackButton from "./BackButton";

const TeamSetupPage = () => {
  const navigate = useNavigate();
  const [teamSaveSuccess, setTeamSaveSuccess] = useState(false); 

  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [teamAPlayers, setTeamAPlayers] = useState(Array(11).fill(""));
  const [teamBPlayers, setTeamBPlayers] = useState(Array(11).fill(""));


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

  const handleSaveTeamA = async () => {
  if (!teamAName) {
    alert("Please enter Team A name.");
    return;
  }
  if (teamAPlayers.some((player) => !player)) {
    alert("Please fill all player names.");
    return;
  }
  try {
    const res = await axios.post("http://localhost:5000/api/team-save/save", {
      teamName: teamAName,
      teamPlayers: teamAPlayers,
    });
    alert(res.data.message || "Team saved successfully!");
  } catch (err) {
    console.error(err);
    alert("Error saving team data.");
  }
};


  const handleSaveTeamB = async () => {
    if (!teamBName) {
      alert("Please enter Team B name.");
      return;
    }
    if (teamBPlayers.some((player) => !player)) {
      alert("Please fill all player names.");
      return;
    }
    alert("Team saved successfully!");

    try {
      const res = await axios.post("http://localhost:5000/api/team-save/save", {
        teamName: teamBName,
        teamPlayers: teamBPlayers,
      });
      alert(res.data.message || "Team saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving team data.");
    }
  };

  const handleSubmit = async () => {
    const data = {
      teamAName,
      teamBName,
      teamAPlayers,
      teamBPlayers,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/team-setup/save",
        data
      );
      alert(res.data.message);
      console.log("Saved:", res.data);
      setTeamSaveSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error saving team data.");
    }
  };

  const handleNext = () => {
    if (teamSaveSuccess) {
      navigate("/matchsetup", { state: { teamAName, teamBName } });
    } else {
      alert("Please save the teams before proceeding.");
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
            <button onClick={handleSaveTeamA}>Save Team A</button>
          </div>
        </div>

        <div className="center-image">
          <img src={centerImg} alt="Center" />
        </div>

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
            <button onClick={handleSaveTeamB}>Save Team B</button>
          </div>
        </div>
      </div>


        
      <div className="button-group">

        <div className="back-button">
          <BackButton />
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Save Teams
        </button>

        <button className="next-button" onClick={() => handleNext()} disabled={!teamSaveSuccess}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TeamSetupPage;
