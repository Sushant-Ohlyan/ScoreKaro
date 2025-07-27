import React, { useState } from 'react';
import '../style/Match.css';

const Match = () => {
  const [currentScore, setCurrentScore] = useState(0);
  const [currentWicket, setCurrentWicket] = useState(0);
  const [balls, setBalls] = useState(0);
  const [overs, setOvers] = useState(0);
  const [ballHistory, setBallHistory] = useState([]);

  const [extraType, setExtraType] = useState(null); // e.g. 'nb', 'bye', etc.
  const [extraRun, setExtraRun] = useState(1);

  const legalBallPlayed = () => {
    setBalls(balls + 1);
    if ((balls + 1) % 6 === 0) setOvers(overs + 1);
  };

  const handleRun = (runs) => {
    setCurrentScore(currentScore + runs);
    setBallHistory([...ballHistory, {
      type: 'run',
      value: runs,
      log: `${overs}.${(balls % 6) + 1} - ${runs} RUNS - Beautiful drive through covers`
    }]);
    legalBallPlayed();
  };

  const handleWicket = () => {
    setCurrentWicket(currentWicket + 1);
    setBallHistory([...ballHistory, {
      type: 'wicket',
      log: `${overs}.${(balls % 6) + 1} - WICKET - Bowled by M. Starc, caught by Kohli`
    }]);
    legalBallPlayed();
  };

  const handleUndo = () => {
    if (ballHistory.length === 0) return;

    const last = ballHistory[ballHistory.length - 1];
    const updatedHistory = [...ballHistory];
    updatedHistory.pop();

    if (last.type === 'run') {
      setCurrentScore(currentScore - last.value);
      setBalls(balls - 1);
      if (balls % 6 === 0 && overs > 0) setOvers(overs - 1);
    } else if (last.type === 'extra') {
      setCurrentScore(currentScore - last.value);
      // do not reduce balls
    } else if (last.type === 'wicket') {
      setCurrentWicket(currentWicket - 1);
      setBalls(balls - 1);
      if (balls % 6 === 0 && overs > 0) setOvers(overs - 1);
    }

    setBallHistory(updatedHistory);
  };

  const submitExtraRun = () => {
    if (!extraType || extraRun < 1 || extraRun > 6) return;

    const desc = {
      nb: "NO BALL",
      wide: "WIDE",
      bye: "BYE",
      lb: "LEG BYE"
    }[extraType];

    setCurrentScore(currentScore + extraRun);
    setBallHistory([...ballHistory, {
      type: 'extra',
      value: extraRun,
      subtype: extraType,
      log: `${overs}.${(balls % 6) + 1} - ${desc} + ${extraRun - 1} RUN(S)`
    }]);

    setExtraType(null); // close dropdown
    setExtraRun(1);
  };

  return (
    <div className="match-container">
      <div className="match-header">
        <h2>Team A VS Team B</h2>
        <p>Venue</p>
      </div>

      <div className="score-info">
        <div className="team-score">Batting Team - {currentScore}/{currentWicket}<br />OVERS - {overs}.{balls % 6}</div>
        <div className="batsmen">
          <div>Player 1 <span>35(30)</span></div>
          <div>Player 2 <span>55(30)</span></div>
        </div>
        <div className="bowler">Current Bowler  <br /> {balls}</div>
      </div>

      <div className="buttons-grid">
        {[0, 1, 2, 3, 4, 6].map(run => (
          <button key={run} onClick={() => handleRun(run)}>{run}</button>
        ))}

        <button className="wicket" onClick={handleWicket}>WICKET</button>

        {/* Extra Buttons */}
        {['nb', 'wide', 'bye', 'lb'].map(type => (
          <button key={type} className={type} onClick={() => setExtraType(type)}>
            {type.toUpperCase()}
          </button>
        ))}

        <button className="undo" onClick={handleUndo}>UNDO</button>
      </div>

      {/* Dropdown for extra run input */}
      {extraType && (
        <div className="extra-run-box">
          <label>
            Runs on {extraType.toUpperCase()} (including default 1): &nbsp;
            <select value={extraRun} onChange={e => setExtraRun(parseInt(e.target.value))}>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </label>
          <button onClick={submitExtraRun}>Submit</button>
          <button className="cancel-btn" onClick={() => setExtraType(null)}>Cancel</button>
        </div>
      )}

      {/* Ball Log */}
      <div className="ball-log">
        <h3>Ball-by-Ball Commentary:</h3>
        <ul>
          {ballHistory.map((entry, index) => (
            <li key={index}>{entry.log}</li>
          ))}
        </ul>
      </div>

      <footer className="match-footer">
        <p>© 2025 Abhijeet All Rights Reserved.</p>
        <div className="social-icons">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-instagram"></i>
        </div>
      </footer>
    </div>
  );
};

export default Match;
