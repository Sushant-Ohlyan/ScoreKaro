import React from 'react'
import BackButton from './BackButton';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const TeamAdd = () => {
    const navigate = useNavigate();
    const [teamSaveSuccess, setTeamSaveSuccess] = useState(false);

    const [teamName, setTeamName] = useState("");
    const [teamPlayers, setTeamPlayers] = useState(Array(11).fill(""));

    const handleSWaveTeam = async () => {
        if (!teamName) return alert("Please enter Team name.");
        if (teamPlayers.some((player) => !player)) return alert("Please fill all player names.");

        try {
            const res = await axios.post("http://localhost:5000/api/team-save/save", {
                teamName: teamName,
                teamPlayers: teamPlayers,
            });
            alert(res.data.message || "Team saved successfully!");
            setTeamSaveSuccess(true);
        } catch (err) {
            console.error(err);
            alert("Error saving team data.");
        }
    };
    
    const handleNavigate = () => {
        if (teamSaveSuccess) {
            navigate("/teams");
        }
    };

  return (
    <>
    <div>TeamAdd</div>
    <input type="text" placeholder='Enter Team Name' value={teamName} onChange={(e) => setTeamName(e.target.value)} />
    {teamPlayers.map((player, index) => (
        <input key={index} type="text" placeholder={`Player ${index + 1}`} value={player} onChange={(e) => {
            const newPlayers = [...teamPlayers];
            newPlayers[index] = e.target.value;
            setTeamPlayers(newPlayers);
        }} />
    ))}

    <button onClick={handleSWaveTeam}>Save Team</button>
    <button onClick={handleNavigate}>Go to Teams</button>
    <BackButton />
  </>
  )
}

export default TeamAdd