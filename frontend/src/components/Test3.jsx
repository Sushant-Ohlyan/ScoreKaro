import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Test2.css";
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

  const [existingTeams, setExistingTeams] = useState([]);
  const [selectedTeamA, setSelectedTeamA] = useState("");
  const [selectedTeamB, setSelectedTeamB] = useState("");

  // Refs for Enter key navigation
  const teamARefs = useRef([]);
  const teamBRefs = useRef([]);

  // Fetch existing teams on mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/team-save");
        setExistingTeams(res.data);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };
    fetchTeams();
  }, []);

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

  const checkDuplicatePlayers = () => {
    const allPlayers = [...teamAPlayers, ...teamBPlayers].map(p => p.trim().toLowerCase());
    const duplicates = allPlayers.filter((p, i) => allPlayers.indexOf(p) !== i && p !== "");
    return duplicates.length > 0;
  };

  // Save Teams
  const handleSaveTeamA = async () => {
    if (!teamAName) return alert("Please enter Team A name.");
    if (teamAPlayers.some((player) => !player)) return alert("Please fill all player names.");
    if (checkDuplicatePlayers()) return alert("Duplicate player names detected across both teams.");

    try {
      const res = await axios.post("http://localhost:5000/api/team-save/save", {
        teamName: teamAName,
        teamPlayers: teamAPlayers,
      });
      alert(res.data.message || "Team A saved successfully!");
      setTeamSaveSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error saving team data.");
    }
  };

  const handleSaveTeamB = async () => {
    if (!teamBName) return alert("Please enter Team B name.");
    if (teamBPlayers.some((player) => !player)) return alert("Please fill all player names.");
    if (checkDuplicatePlayers()) return alert("Duplicate player names detected across both teams.");

    try {
      const res = await axios.post("http://localhost:5000/api/team-save/save", {
        teamName: teamBName,
        teamPlayers: teamBPlayers,
      });
      alert(res.data.message || "Team B saved successfully!");
      setTeamSaveSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error saving team data.");
    }
  };

  const handleSubmit = async () => {
    if (checkDuplicatePlayers()) return alert("Duplicate player names detected across both teams.");

    const data = { teamAName, teamBName, teamAPlayers, teamBPlayers };

    try {
      const res = await axios.post("http://localhost:5000/api/team-setup/save", data);
      alert(res.data.message);
      setTeamSaveSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error saving team data.");
    }
  };

  const handleNext = () => {
    if (teamSaveSuccess) {
      navigate("/matchsetup", {
        state: { teamAName, teamBName, teamAPlayers, teamBPlayers },
      });
    } else {
      alert("Please save the teams before proceeding.");
    }
  };

  // Handle Enter key to focus next input
  const handleKeyDown = (e, index, team) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (team === "A") {
        if (teamARefs.current[index + 1]) teamARefs.current[index + 1].focus();
      } else {
        if (teamBRefs.current[index + 1]) teamBRefs.current[index + 1].focus();
      }
    }
  };

  // Load existing team into inputs
  const handleAddExistingTeam = (teamType) => {
    const selectedId = teamType === "A" ? selectedTeamA : selectedTeamB;
    if (!selectedId) return alert("Please select a team first.");
    const team = existingTeams.find((t) => t._id === selectedId);
    if (!team) return alert("Team not found.");

    if (teamType === "A") {
      setTeamAName(team.teamName);
      setTeamAPlayers(team.teamPlayers);
    } else {
      setTeamBName(team.teamName);
      setTeamBPlayers(team.teamPlayers);
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

          {/* Existing Teams Dropdown */}
          <div className="existing-team-selector">
            <select
              value={selectedTeamA}
              onChange={(e) => setSelectedTeamA(e.target.value)}
            >
              <option value="">Select Existing Team A</option>
              {existingTeams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.teamName}
                </option>
              ))}
            </select>
            <button onClick={() => handleAddExistingTeam("A")}>Load Team A</button>
          </div>

          <div className="players-section">
            <h4>Players</h4>
            {teamAPlayers.map((player, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Player ${index + 1}`}
                value={player}
                ref={(el) => (teamARefs.current[index] = el)}
                onChange={(e) => handleTeamAPlayerChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index, "A")}
                className={player ? "input-expanded" : "input-collapsed"}
              />
            ))}
            <button onClick={addPlayerToTeamA}>+ Add Player</button>
            <button onClick={handleSaveTeamA}>Save Team A</button>
          </div>
        </div>

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

          {/* Existing Teams Dropdown */}
          <div className="existing-team-selector">
            <select
              value={selectedTeamB}
              onChange={(e) => setSelectedTeamB(e.target.value)}
            >
              <option value="">Select Existing Team B</option>
              {existingTeams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.teamName}
                </option>
              ))}
            </select>
            <button onClick={() => handleAddExistingTeam("B")}>Load Team B</button>
          </div>

          <div className="players-section">
            <h4>Players</h4>
            {teamBPlayers.map((player, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Player ${index + 1}`}
                value={player}
                ref={(el) => (teamBRefs.current[index] = el)}
                onChange={(e) => handleTeamBPlayerChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index, "B")}
                className={player ? "input-expanded" : "input-collapsed"}
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
        <button className="next-button" onClick={handleNext} disabled={!teamSaveSuccess}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TeamSetupPage;
