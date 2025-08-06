import React, { useState, useEffect } from 'react';

const Test = () => {
  const [matchDetails, setMatchDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/match-details/');
        const data = await response.json();
        console.log("Fetched Match Details Data:", data);
        setMatchDetails(data);
      } catch (error) {
        console.error("Error fetching match details:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Match Details</h1>
      <ul>
        <li>
          {matchDetails.teamAName} vs {matchDetails.teamBName} at {matchDetails.venueName}
        </li>
        <li>{matchDetails.tossWonBy} won the toss and chose to {matchDetails.tossDecision}</li>
        <li>Match Type: {matchDetails.matchType}</li>
        <li>
          Umpires: {matchDetails.umpireName1}, {matchDetails.umpireName2}, {matchDetails.umpireName3}
        </li>
        <li>Batting Team: {matchDetails.currentBattingTeam}</li>
        <li>Bowling Team: {matchDetails.currentBowlingTeam}</li>
      </ul>
    </div>
  );
};

export default Test;
