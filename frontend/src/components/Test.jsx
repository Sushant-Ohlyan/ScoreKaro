import { get } from 'mongoose';
import React, { use, useEffect } from 'react'
import React, { useState, useEffect } from 'react'; // Add useState here
import axios from 'axios';

const Test = () => {
  const [matchDetails, setMatchDetails] = useState({});

  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [teamAPlayers, setTeamAPlayers] = useState(Array(11).fill(""));
  const [teamBPlayers, setTeamBPlayers] = useState(Array(11).fill(""));
  const [venueName, setVenueName] = useState("");
  const [currentBattingTeam, setCurrentBattingTeam] = useState("");
  const [currentBowlingTeam, setCurrentBowlingTeam] = useState("");
  const [overs, setOvers] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [ballType, setBallType] = useState("");
  const [matchType, setMatchType] = useState("");
  const [umpireName1, setUmpireName1] = useState("");
  const [umpireName2, setUmpireName2] = useState("");
  const [umpireName3, setUmpireName3] = useState("");
  const [tossWonBy, setTossWonBy] = useState("");
  const [tossDecision, setTossDecision] = useState("");
  const [matchId, setMatchId] = useState("");
  const [battingPlayers, setBattingPlayers] = useState([]);
  const [bowlingPlayers, setBowlingPlayers] = useState([]);
  const [currentInnings, setCurrentInnings] = useState(1);
  const [currentOver, setCurrentOver] = useState(0);
  const [currentBall, setCurrentBall] = useState(0);
  const [currentBatsman, setCurrentBatsman] = useState("");
  const [currentBowler, setCurrentBowler] = useState("");
  const [currentRuns, setCurrentRuns] = useState(0);
  const [currentWickets, setCurrentWickets] = useState(0);
  const [currentOverRuns, setCurrentOverRuns] = useState(0);
  const [currentOverBalls, setCurrentOverBalls] = useState(0);
  const [onStrikeIdx, setOnStrikeIdx] = useState(0);
  const [nonStrikeIdx, setNonStrikeIdx] = useState(1);
  const [nextBatsmanIdx, setNextBatsmanIdx] = useState(2);
  const [secondNextBatsmanIdx, setSecondNextBatsmanIdx] = useState(null);
  const [nextBowlerIdx, setNextBowlerIdx] = useState(0);
  const [bowlers, setBowlers] = useState(getDefaultBowlers());
  const [batsmen, setBatsmen] = useState(getDefaultBatsmen());
  const [currentInningsData, setCurrentInningsData] = useState({});
  const [currentInningsId, setCurrentInningsId] = useState("");
  const [currentInningsScore, setCurrentInningsScore] = useState(0);
  const [currentInningsWickets, setCurrentInningsWickets] = useState(0);
  const [currentInningsOvers, setCurrentInningsOvers] = useState(0);
  const [currentInningsBalls, setCurrentInningsBalls] = useState(0);
  const [currentInningsRuns, setCurrentInningsRuns] = useState(0);
  
  const [navigate, setNavigate] = useState(useNavigate());

  const [extraRuns, setExtraRuns] = useState({
    noBall: 1,
    wideBall: 1,
    byes: 0,
    legByes: 0,
  });

  const [ballHistory, setBallHistory] = useState([]);

  

  useEffect(() => {
    const fetchData = async () => {
      
      try{
        const response = await fetch('http://localhost:5000/api/match-details/');
        const data = await response.json();
        console.log("Fetched Match Details Data:", data);
        setMatchDetails(data);
        setMatchId(data._id);

      } catch (error) {
        console.error("Error fetching match details:", error);
      }
    };
    fetchData();
  }, []);

function handleScoreUpdate() {
  currentScore = matchDetails.currentScore || 0;
  const newScore = currentScore + currentRuns;
  setCurrentScore(newScore);
  setCurrentOverRuns(currentOverRuns + currentRuns);
  setCurrentBall(currentBall + 1);
  setBallHistory([...ballHistory, { runs: currentRuns, ballType }]);
}

function handleOverUpdate() {
  const overs= matchDetails.overs|| 0;
  if (currentBall >= 6) {
    setCurrentOver(currentOver + 1);
    setCurrentBall(0);
    setCurrentOverRuns(0);
    setOnStrikeIdx(nonStrikeIdx);
    setNonStrikeIdx(onStrikeIdx);
    try{
      const response =fetch(`http://localhost:5000/api/match-details/${matchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentOver,
          currentScore,
          currentWickets,
          currentBattingTeam,
          currentBattingTeam,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update match details');
      }
    }
    catch(error){
      console.error("Error : ", error);
    }

  } 
  if (currentOver >= overs) {
    alert("Innings Over");
    navigate("/innings-summary");
  }
}



  return (
  <>
  <div>
    <h1>Match Details</h1>
    <ul>
      <li>
        {matchDetails.teamAName} vs {matchDetails.teamBName} at {matchDetails.venueName}
      </li>
      <li>{matchDetails.tossWonBy} won the toss and chose to {matchDetails.tossDecision}</li>
      <li>Match Type: {matchDetails.matchType}</li>
      <li>Umpires: {matchDetails.umpireName1}, {matchDetails.umpireName2}, {matchDetails.umpireName3}</li>
    </ul>
  </div>
  <div>
    <h2>Current Batting Team: {matchDetails.currentBattingTeam}</h2>
    <h3>Score :{currentScore}</h3>
    <h2>Current Bowling Team: {matchDetails.currentBowlingTeam}</h2>
    <h3>Current Over: {currentOver}</h3>

  </div>
  </>
)
}

export default Test