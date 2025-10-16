// src/components/InningSummary.jsx
import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function InningSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const summaryRef = useRef(null);

  // Expected state passed from Match.jsx
  const inningData = location.state;

  useEffect(() => {
    if (!inningData) {
      navigate("/"); // redirect if no state
    }
  }, [inningData, navigate]);

  if (!inningData) return null;

  const {
    currentBattingTeam,
    currentBowlingTeam,
    score,
    wickets,
    overs,
    batsmen = [],
    bowlers = [],
    nextInningsNumber,
    totalInnings,
    matchId,
    teamAName,
    teamBName,
    venueName,
  } = inningData;

  const handleNextInnings = () => {
    // Prepare state for next innings
    navigate("/test5", {
      state: {
        matchId,
        teamAName,
        teamBName,
        venueName,
        overs,
        inningsNumber: nextInningsNumber,
        totalInnings,
        battingFirst: currentBowlingTeam, // other team bats now
        bowlingFirst: currentBattingTeam,
        teamAPlayers: teamAName === currentBattingTeam ? batsmen.map(b => b.name) : null,
        teamBPlayers: teamBName === currentBattingTeam ? batsmen.map(b => b.name) : null,
      },
    });
  };

  return (
    <div className="inning-summary-container" style={{ padding: "20px" }}>
      <h2>Innings {nextInningsNumber - 1} Summary</h2>
      <div ref={summaryRef} id="inning-summary" style={{ padding: "20px", background: "#fff", color: "#000" }}>
        <h3>{currentBattingTeam} Innings</h3>
        <p><strong>Score:</strong> {score}/{wickets} ({overs})</p>
        <p><strong>Bowling Team:</strong> {currentBowlingTeam}</p>
        <p><strong>Venue:</strong> {venueName}</p>

        <hr />

        <h4>Batting Stats</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>Batsman</th>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>Runs</th>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>Balls</th>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>4s</th>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>6s</th>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>Out</th>
            </tr>
          </thead>
          <tbody>
            {batsmen.map((b, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #ddd", padding: "4px" }}>{b.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "4px", textAlign: "center" }}>{b.runs}</td>
                <td style={{ border: "1px solid #ddd", padding: "4px", textAlign: "center" }}>{b.balls}</td>
                <td style={{ border: "1px solid #ddd", padding: "4px", textAlign: "center" }}>{b.fours}</td>
                <td style={{ border: "1px solid #ddd", padding: "4px", textAlign: "center" }}>{b.sixes}</td>
                <td style={{ border: "1px solid #ddd", padding: "4px", textAlign: "center" }}>{b.out ? b.howOut : "Not Out"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4 style={{ marginTop: "12px" }}>Bowling Stats</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>Bowler</th>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>Overs</th>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>Runs</th>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>Wickets</th>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>Maidens</th>
            </tr>
          </thead>
          <tbody>
            {bowlers.map((b, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #ddd", padding: "4px" }}>{b.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "4px", textAlign: "center" }}>{Math.floor(b.balls / 6)}.{b.balls % 6}</td>
                <td style={{ border: "1px solid #ddd", padding: "4px", textAlign: "center" }}>{b.runs}</td>
                <td style={{ border: "1px solid #ddd", padding: "4px", textAlign: "center" }}>{b.wickets}</td>
                <td style={{ border: "1px solid #ddd", padding: "4px", textAlign: "center" }}>{b.maidens || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handleNextInnings} style={{ marginTop: "12px" }}>
        Proceed to Next Innings
      </button>
    </div>
  );
}
