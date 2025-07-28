import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InningSummary = () => {
    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");
    const [inning, setInning] = useState(1);
    const [score, setScore] = useState(0);
    const [overs, setOvers] = useState("0.0");
    const [wickets, setWickets] = useState(0);
    const [runRate, setRunRate] = useState(0.0);
    const [topScorer, setTopScorer] = useState("");
    const [topPerformerBat, setTopPerformerBat] = useState("");
    const [topPerformerBall, setTopPerformerBall] = useState("");
    const [mostWickets, setMostWickets] = useState("");
    const [bestFielder, setBestFielder] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/match/details");
                const data = response.data;
                setTeamA(data.teamA);
                setTeamB(data.teamB);
                setInning(data.inning);
                setScore(data.score);
                setOvers(data.overs);
                setWickets(data.wickets);
                setRunRate(data.runRate);
                setTopScorer(data.topScorer);
                setTopPerformerBat(data.topPerformerBat);
                setTopPerformerBall(data.topPerformerBall);
                setMostWickets(data.mostWickets);
                setBestFielder(data.bestFielder);
            } catch (error) {
                console.error("Error fetching match details:", error);
            }
        };

     fetchMatchData();
    }, []);

  return (
    <>
    <div className="match-summary">
      <h2>{teamA} vs {teamB}</h2>
      <h3>Inning: {inning}</h3>
      <p>Score: {score}/{wickets} in {overs} overs</p>
      <p>Run Rate: {runRate}</p>

      <h4>Top Scorer: {topScorer}</h4>
      <h4>Top Performer (Batting): {topPerformerBat}</h4>

      {inning > 1 && (
        <>
          <h4>Top Performer (Bowling): {topPerformerBall}</h4>
          <h4>Most Wickets: {mostWickets}</h4>
          <h4>Best Fielder: {bestFielder}</h4>
        </>
      )}

      <button onClick={() => navigate("/scorecard")}>View Full Scorecard</button>
      {inning === 1 ? (
        <button onClick={() => setInning(2)}>Start Next Inning</button>
      ) : (
        <button onClick={() => alert("Match Ended")}>End Match</button>
      )}
    </div>
    </>

  )
}

export default InningSummary