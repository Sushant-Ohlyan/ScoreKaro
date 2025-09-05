// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../style/Teamsetup.css";
// import centerImg from "../assets/b.png";
// import axios from "axios";
// import BackButton from "./BackButton";

// const MAX_PLAYERS = 11;

// const TeamCard = ({ teamName, setTeamName, players, setPlayers, label }) => {
//   const handlePlayerChange = (index, value) => {
//     const updated = [...players];
//     updated[index] = value;
//     setPlayers(updated);
//   };

//   const addPlayer = () => {
//     if (players.length >= MAX_PLAYERS) {
//       alert("Maximum 11 players allowed.");
//       return;
//     }
//     setPlayers([...players, ""]);
//   };

//   return (
//     <div className="team-card">
//       <h3>{label}</h3>
//       <input
//         type="text"
//         placeholder={`Enter ${label} Name`}
//         value={teamName}
//         onChange={(e) => setTeamName(e.target.value)}
//         maxLength={25}
//       />
//       <div className="players-section">
//         <h4>Players</h4>
//         {players.map((player, index) => {
//           if (index > 0 && players[index - 1].trim() === "") return null;

//           return (
//             <input
//               key={index}
//               id={`${label}-player-${index}`}
//               type="text"
//               placeholder={`Player ${index + 1}`}
//               value={player}
//               maxLength={25}
//               onChange={(e) => handlePlayerChange(index, e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   const trimmed = player.trim();
//                   if (trimmed !== "") {
//                     const nextInput = document.getElementById(
//                       `${label}-player-${index + 1}`
//                     );
//                     if (nextInput) {
//                       nextInput.focus();
//                       nextInput.scrollIntoView({
//                         behavior: "smooth",
//                         block: "center",
//                       });
//                     }
//                   }
//                 }
//               }}
//             />
//           );
//         })}
//         <button onClick={addPlayer} disabled={players.length >= MAX_PLAYERS}>
//           + Add Player
//         </button>
//       </div>
//     </div>
//   );
// };

// const Test4 = () => {
//   const navigate = useNavigate();
//   const [teamSaveSuccess, setTeamSaveSuccess] = useState(false);

//   const [teamAName, setTeamAName] = useState("");
//   const [teamBName, setTeamBName] = useState("");
//   const [teamAPlayers, setTeamAPlayers] = useState(Array(MAX_PLAYERS).fill(""));
//   const [teamBPlayers, setTeamBPlayers] = useState(Array(MAX_PLAYERS).fill(""));

//   const hasDuplicates = (arr) => {
//     const trimmed = arr.map((p) => p.trim().toLowerCase());
//     return new Set(trimmed).size !== trimmed.length;
//   };

//   const handleSubmit = async () => {
//     if (!teamAName.trim() || !teamBName.trim()) {
//       alert("Please enter both team names.");
//       return;
//     }
//     if (teamAPlayers.some((p) => !p.trim()) || teamBPlayers.some((p) => !p.trim())) {
//       alert("Please fill all player names.");
//       return;
//     }
//     if (hasDuplicates(teamAPlayers)) {
//       alert("Duplicate player names in Team A are not allowed.");
//       return;
//     }
//     if (hasDuplicates(teamBPlayers)) {
//       alert("Duplicate player names in Team B are not allowed.");
//       return;
//     }

//     const data = {
//       teamAName: teamAName.trim(),
//       teamBName: teamBName.trim(),
//       teamAPlayers: teamAPlayers.map((p) => p.trim()),
//       teamBPlayers: teamBPlayers.map((p) => p.trim()),
//     };

//     try {
//       const res = await axios.post("http://localhost:5000/api/team-setup/save", data);
//       alert(res.data.message || "Teams saved successfully!");
//       setTeamSaveSuccess(true);
//     } catch (err) {
//       console.error(err);
//       alert("Error saving team data.");
//     }
//   };

//   const handleNext = () => {
//     if (teamSaveSuccess) {
//       navigate("/test5", {
//         state: { teamAName, teamBName, teamAPlayers, teamBPlayers },
//       });
//     } else {
//       alert("Please save the teams before proceeding.");
//     }
//   };

//   return (
//     <div className="team-setup-page">
//       <h2>Team Setup</h2>
//       <div className="team-setup-container">
//         <TeamCard
//           teamName={teamAName}
//           setTeamName={setTeamAName}
//           players={teamAPlayers}
//           setPlayers={setTeamAPlayers}
//           label="Team A"
//         />

//         <div className="center-image">
//           <img src={centerImg} alt="Center" />
//         </div>

//         <TeamCard
//           teamName={teamBName}
//           setTeamName={setTeamBName}
//           players={teamBPlayers}
//           setPlayers={setTeamBPlayers}
//           label="Team B"
//         />
//       </div>

//       <div className="button-group">
//         <div className="back-button">
//           <BackButton />
//         </div>
//         <button className="submit-button" onClick={handleSubmit}>
//           Save Teams
//         </button>
//         <button
//           className="next-button"
//           onClick={handleNext}
//           disabled={!teamSaveSuccess}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Test4;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../style/Teamsetup.css";
// import centerImg from "../assets/b.png"; 
// import axios from "axios";
// import BackButton from "./BackButton";

// const MAX_PLAYERS = 11;

// const TeamSetupPage = () => {
//   const navigate = useNavigate();
//   const [teamSaveSuccess, setTeamSaveSuccess] = useState(false); 

//   const [teamAName, setTeamAName] = useState("");
//   const [teamBName, setTeamBName] = useState("");
//   const [teamAPlayers, setTeamAPlayers] = useState(Array(MAX_PLAYERS).fill(""));
//   const [teamBPlayers, setTeamBPlayers] = useState(Array(MAX_PLAYERS).fill(""));

//   // ----- Utility Functions -----
//   const trimArray = (arr) => arr.map((p) => p.trim());
//   const hasDuplicates = (arr) => {
//     const trimmed = trimArray(arr);
//     return new Set(trimmed).size !== trimmed.length;
//   };

//   const handlePlayerChange = (team, index, value) => {
//     const updater = team === "A" ? [...teamAPlayers] : [...teamBPlayers];
//     updater[index] = value;
//     team === "A" ? setTeamAPlayers(updater) : setTeamBPlayers(updater);
//   };

//   const addPlayer = (team) => {
//     const players = team === "A" ? teamAPlayers : teamBPlayers;
//     if (players.length >= MAX_PLAYERS) {
//       alert("Maximum 11 players allowed.");
//       return;
//     }
//     const updated = [...players, ""];
//     team === "A" ? setTeamAPlayers(updated) : setTeamBPlayers(updated);
//   };

//   // ----- Save Handler -----
//   const handleSubmit = async () => {
//     // Validation
//     if (!teamAName.trim() || !teamBName.trim()) {
//       alert("Please enter both team names.");
//       return;
//     }

//     if (teamAPlayers.some((p) => !p.trim()) || teamBPlayers.some((p) => !p.trim())) {
//       alert("Please fill all player names.");
//       return;
//     }

//     if (hasDuplicates(teamAPlayers)) {
//       alert("Duplicate player names in Team A are not allowed.");
//       return;
//     }

//     if (hasDuplicates(teamBPlayers)) {
//       alert("Duplicate player names in Team B are not allowed.");
//       return;
//     }

//     const data = {
//       teamAName: teamAName.trim(),
//       teamBName: teamBName.trim(),
//       teamAPlayers: trimArray(teamAPlayers),
//       teamBPlayers: trimArray(teamBPlayers),
//     };

//     try {
//       const res = await axios.post("http://localhost:5000/api/team-setup/save", data);
//       alert(res.data.message || "Teams saved successfully!");
//       setTeamSaveSuccess(true);
//     } catch (err) {
//       console.error(err);
//       alert("Error saving team data.");
//     }
//   };

//   const handleNext = () => {
//     if (!teamSaveSuccess) {
//       alert("Please save the teams before proceeding.");
//       return;
//     }
//     navigate("/matchsetup", { state: { teamAName, teamBName } });
//   };

//   // ----- Render -----
//   return (
//     <div className="team-setup-page">
//       <h2>Team Setup</h2>
//       <div className="team-setup-container">
//         {/* Team A */}
//         <div className="team-card">
//           <h3>Team A</h3>
//           <input
//             type="text"
//             placeholder="Enter Team A Name"
//             value={teamAName}
//             maxLength={25}
//             onChange={(e) => setTeamAName(e.target.value)}
//           />
//           <div className="players-section">
//             <h4>Players</h4>
//             {teamAPlayers.map((player, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 placeholder={`Player ${index + 1}`}
//                 value={player}
//                 maxLength={25}
//                 onChange={(e) => handlePlayerChange("A", index, e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && player.trim() !== "") {
//                     const nextInput = document.getElementById(`teamA-player-${index + 1}`);
//                     if (nextInput) {
//                       nextInput.focus();
//                       nextInput.scrollIntoView({ behavior: "smooth", block: "center" });
//                     }
//                   }
//                 }}
//                 id={`teamA-player-${index}`}
//               />
//             ))}
//             <button onClick={() => addPlayer("A")}>+ Add Player</button>
//           </div>
//         </div>

//         <div className="center-image">
//           <img src={centerImg} alt="Center" />
//         </div>

//         {/* Team B */}
//         <div className="team-card">
//           <h3>Team B</h3>
//           <input
//             type="text"
//             placeholder="Enter Team B Name"
//             value={teamBName}
//             maxLength={25}
//             onChange={(e) => setTeamBName(e.target.value)}
//           />
//           <div className="players-section">
//             <h4>Players</h4>
//             {teamBPlayers.map((player, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 placeholder={`Player ${index + 1}`}
//                 value={player}
//                 maxLength={25}
//                 onChange={(e) => handlePlayerChange("B", index, e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && player.trim() !== "") {
//                     const nextInput = document.getElementById(`teamB-player-${index + 1}`);
//                     if (nextInput) {
//                       nextInput.focus();
//                       nextInput.scrollIntoView({ behavior: "smooth", block: "center" });
//                     }
//                   }
//                 }}
//                 id={`teamB-player-${index}`}
//               />
//             ))}
//             <button onClick={() => addPlayer("B")}>+ Add Player</button>
//           </div>
//         </div>
//       </div>

//       <div className="button-group">
//         <div className="back-button">
//           <BackButton />
//         </div>
//         <button className="submit-button" onClick={handleSubmit}>
//           Save Teams
//         </button>
//         <button
//           className="next-button"
//           onClick={handleNext}
//           disabled={!teamSaveSuccess}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TeamSetupPage;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../style/Teamsetup.css";
// import centerImg from "../assets/b.png"; 
// import axios from "axios";
// import BackButton from "./BackButton";

// const MAX_PLAYERS = 11;

// const TeamSetupPage = () => {
//   const navigate = useNavigate();
//   const [teamSaveSuccess, setTeamSaveSuccess] = useState(false); 

//   const [teamAName, setTeamAName] = useState("");
//   const [teamBName, setTeamBName] = useState("");
//   const [teamAPlayers, setTeamAPlayers] = useState(Array(MAX_PLAYERS).fill(""));
//   const [teamBPlayers, setTeamBPlayers] = useState(Array(MAX_PLAYERS).fill(""));

//   // ----- Utility -----
//   const trimArray = (arr) => arr.map((p) => p.trim());
//   const hasDuplicates = (arr) => {
//     const trimmed = trimArray(arr);
//     return new Set(trimmed).size !== trimmed.length;
//   };

//   const handleTeamAPlayerChange = (index, value) => {
//     const updated = [...teamAPlayers];
//     updated[index] = value;
//     setTeamAPlayers(updated);
//   };

//   const handleTeamBPlayerChange = (index, value) => {
//     const updated = [...teamBPlayers];
//     updated[index] = value;
//     setTeamBPlayers(updated);
//   };

//   const addPlayerToTeamA = () => setTeamAPlayers([...teamAPlayers, ""]);
//   const addPlayerToTeamB = () => setTeamBPlayers([...teamBPlayers, ""]);

//   // ----- Save Handler -----
//   const handleSubmit = async () => {
//     if (!teamAName.trim() || !teamBName.trim()) {
//       alert("Please enter both team names.");
//       return;
//     }

//     if (teamAPlayers.some((p) => !p.trim()) || teamBPlayers.some((p) => !p.trim())) {
//       alert("Please fill all player names.");
//       return;
//     }

//     if (hasDuplicates(teamAPlayers)) {
//       alert("Duplicate player names in Team A are not allowed.");
//       return;
//     }

//     if (hasDuplicates(teamBPlayers)) {
//       alert("Duplicate player names in Team B are not allowed.");
//       return;
//     }

//     const data = {
//       teamAName: teamAName.trim(),
//       teamBName: teamBName.trim(),
//       teamAPlayers: trimArray(teamAPlayers),
//       teamBPlayers: trimArray(teamBPlayers),
//     };

//     try {
//       const res = await axios.post("http://localhost:5000/api/team-setup/save", data);
//       alert(res.data.message || "Teams saved successfully!");
//       setTeamSaveSuccess(true);
//     } catch (err) {
//       console.error(err);
//       alert("Error saving team data.");
//     }
//   };

//   const handleNext = () => {
//     if (!teamSaveSuccess) {
//       alert("Please save the teams before proceeding.");
//       return;
//     }
//     navigate("/matchsetup", { state: { teamAName, teamBName } });
//   };

//   return (
//     <div className="team-setup-page">
//       <h2>Team Setup</h2>
//       <div className="team-setup-container">
//         {/* Team A Card */}
//         <div className="team-card">
//           <h3>Team A</h3>
//           <input
//             type="text"
//             placeholder="Enter Team A Name"
//             value={teamAName}
//             onChange={(e) => setTeamAName(e.target.value)}
//           />
//           <div className="players-section">
//             <h4>Players</h4>
//             {teamAPlayers.map((player, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 placeholder={`Player ${index + 1}`}
//                 value={player}
//                 onChange={(e) => handleTeamAPlayerChange(index, e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && player.trim() !== "") {
//                     const nextInput = document.getElementById(`teamA-player-${index + 1}`);
//                     if (nextInput) {
//                       nextInput.focus();
//                       nextInput.scrollIntoView({ behavior: "smooth", block: "center" });
//                     }
//                   }
//                 }}
//                 id={`teamA-player-${index}`}
//               />
//             ))}
//             <button onClick={addPlayerToTeamA}>+ Add Player</button>
//           </div>
//         </div>

//         <div className="center-image">
//           <img src={centerImg} alt="Center" />
//         </div>

//         {/* Team B Card */}
//         <div className="team-card">
//           <h3>Team B</h3>
//           <input
//             type="text"
//             placeholder="Enter Team B Name"
//             value={teamBName}
//             onChange={(e) => setTeamBName(e.target.value)}
//           />
//           <div className="players-section">
//             <h4>Players</h4>
//             {teamBPlayers.map((player, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 placeholder={`Player ${index + 1}`}
//                 value={player}
//                 onChange={(e) => handleTeamBPlayerChange(index, e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && player.trim() !== "") {
//                     const nextInput = document.getElementById(`teamB-player-${index + 1}`);
//                     if (nextInput) {
//                       nextInput.focus();
//                       nextInput.scrollIntoView({ behavior: "smooth", block: "center" });
//                     }
//                   }
//                 }}
//                 id={`teamB-player-${index}`}
//               />
//             ))}
//             <button onClick={addPlayerToTeamB}>+ Add Player</button>
//           </div>
//         </div>
//       </div>

//       <div className="button-group">
//         <div className="back-button">
//           <BackButton />
//         </div>
//         <button className="submit-button" onClick={handleSubmit}>
//           Save Teams
//         </button>
//         <button
//           className="next-button"
//           onClick={handleNext}
//           disabled={!teamSaveSuccess}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TeamSetupPage;

import React, { useState, useRef } from "react";
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

  // Refs for Enter key navigation
  const teamARefs = useRef([]);
  const teamBRefs = useRef([]);

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
      navigate("/test5", {
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
                ref={(el) => (teamARefs.current[index] = el)}
                onChange={(e) => handleTeamAPlayerChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index, "A")}
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
