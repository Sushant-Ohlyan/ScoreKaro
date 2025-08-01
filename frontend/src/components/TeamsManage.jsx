import React, { useEffect, useState } from "react";
import '../style/TeamManage.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const TeamManage = () => {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamPlayers, setTeamPlayers] = useState([""]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/team-manage");
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };

    fetchTeams();
  }, []);

  const handleAddTeam = () => {
    
    navigate("/teamsetup");
  };

  const handleViewTeam = (team) => {
    alert(
      `Viewing team:\n\n${team.teamName}:\n${team.teamPlayers.join(", ")}`
    );
  };

  const handleDeleteTeam = (id) => {
    alert(`Delete team with id: ${id}`);
  };

  return (
    <div className="team-manage-wrapper">
      <h2 className="team-manage-title">Manage Teams</h2>
      <div className="team-manage-grid">
        {teams.length === 0 ? (
          <p className="team-manage-empty">No teams available. Add a new team.</p>
        ) : (
          teams.map((team) => (
            <div key={team._id} className="team-manage-card">
              <h3 className="team-manage-name">
                {team.teamName} 
              </h3>
              <p className="team-manage-count">
                {team.teamName} Players: {team.teamPlayers?.length || 0}
              </p>
              
              <div className="team-manage-actions">
                <button
                  onClick={() => handleViewTeam(team)}
                  className="team-manage-btn view"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteTeam(team._id)}
                  className="team-manage-btn delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <button className="team-manage-add-btn" onClick={handleAddTeam}>
        Add Team
      </button>
    </div>
  );
};

export default TeamManage;

// retrieve all teams from db
// add the component to create new teams
// add functionality to delete teams
// add functionality to edit team details like name, logo, etc.
// add functionality to view team details