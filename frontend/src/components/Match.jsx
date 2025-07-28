import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Match.css';

const Match = () => {
  const navigate = useNavigate();

  const [currentScore, setCurrentScore] = useState(0);
  const [currentWicket, setCurrentWicket] = useState(0);
  const [balls, setBalls] = useState(0);
  const [overs, setOvers] = useState(0);
  const [ballHistory, setBallHistory] = useState([]);

  const [extraType, setExtraType] = useState(null);
  const [extraRun, setExtraRun] = useState(1);

  const [bowler, setBowler] = useState("bowler1");
  const [showBowlerDropdown, setShowBowlerDropdown] = useState(false);

  const [batsmen, setBatsmen] = useState(["batsman1", "batsman2"]);
  const [nextBatsmanIndex, setNextBatsmanIndex] = useState(3);
  const [showBatsmanDropdown, setShowBatsmanDropdown] = useState(false);

  useEffect(() => {
    if (currentWicket === 10 || overs === 20) {
      navigate('/inning-summary', {
        state: {
          score: currentScore,
          wickets: currentWicket,
          overs
        }
      });
    }
  }, [currentWicket, overs, navigate, currentScore]);

  const legalBallPlayed = () => {
    const newBalls = balls + 1;
    setBalls(newBalls);

    if (newBalls % 6 === 0) {
      setOvers(prev => prev + 1);
      setShowBowlerDropdown(true);
    }
  };

  const handleRun = (runs) => {
    setCurrentScore(prev => prev + runs);
    setBallHistory([...ballHistory, {
      type: 'run',
      value: runs,
      log: `${overs}.${(balls % 6) + 1} - ${runs} RUNS - Beautiful drive through covers`
    }]);
    legalBallPlayed();
  };

  const handleWicket = () => {
    setCurrentWicket(prev => prev + 1);
    setBallHistory([...ballHistory, {
      type: 'wicket',
      log: `${overs}.${(balls % 6) + 1} - WICKET - Bowled by ${bowler}, caught behind`
    }]);
    legalBallPlayed();
    setShowBatsmanDropdown(true);
  };

  const handleUndo = () => {
    if (ballHistory.length === 0) return;

    const last = ballHistory[ballHistory.length - 1];
    const updatedHistory = [...ballHistory];
    updatedHistory.pop();

    if (last.type === 'run') {
      setCurrentScore(prev => prev - last.value);
      setBalls(prev => prev - 1);
      if ((balls - 1) % 6 === 5 && overs > 0) setOvers(prev => prev - 1);
    } else if (last.type === 'extra') {
      setCurrentScore(prev => prev - last.value);
    } else if (last.type === 'wicket') {
      setCurrentWicket(prev => prev - 1);
      setBalls(prev => prev - 1);
      if ((balls - 1) % 6 === 5 && overs > 0) setOvers(prev => prev - 1);
    }

    setBallHistory(updatedHistory);
  };

  const submitExtraRun = () => {
    if (!extraType || extraRun < 0 || extraRun > 6) return;

    const desc = {
      nb: "NO BALL",
      wide: "WIDE",
      bye: "BYE",
      lb: "LEG BYE"
    }[extraType];

    setCurrentScore(prev => prev + extraRun);
    setBallHistory([...ballHistory, {
      type: 'extra',
      value: extraRun,
      subtype: extraType,
      log: `${overs}.${(balls % 6) + 1} - ${desc} + ${extraRun - 1} RUN(S)`
    }]);

    setExtraType(null);
    setExtraRun(1);
  };

  const selectNextBowler = (event) => {
    setBowler(event.target.value);
    setShowBowlerDropdown(false);
  };

  const selectNextBatsman = (event) => {
    const selected = event.target.value;
    setBatsmen(prev => [prev[1], selected]);
    setNextBatsmanIndex(prev => prev + 1);
    setShowBatsmanDropdown(false);
  };

  return (
    <div className="match-container">
      <div className="match-header">
        <h2>Team A VS Team B</h2>
        <p>Venue</p>
      </div>

      <div className="score-info">
        <div className="team-score">
          Batting Team - {currentScore}/{currentWicket}
          <br />OVERS - {overs}.{balls % 6}
        </div>
        <div className="batsmen">
          <div>{batsmen[0]} <span>35(30)</span></div>
          <div>{batsmen[1]} <span>55(30)</span></div>
        </div>
        <div className="bowler">
          Current Bowler: {bowler}<br />
          Balls: {balls} | Overs: {overs}
        </div>
      </div>

      <div className="buttons-grid">
        {[0, 1, 2, 3, 4, 6].map(run => (
          <button key={run} onClick={() => handleRun(run)}>{run}</button>
        ))}

        <button className="wicket" onClick={handleWicket}>WICKET</button>

        {['nb', 'wide', 'bye', 'lb'].map(type => (
          <button key={type} className={type} onClick={() => setExtraType(type)}>
            {type.toUpperCase()}
          </button>
        ))}

        <button className="undo" onClick={handleUndo}>UNDO</button>
      </div>

      {extraType && (
        <div className="extra-run-box">
          <label>
            Runs on {extraType.toUpperCase()} (including default 1): &nbsp;
            <select value={extraRun} onChange={e => setExtraRun(parseInt(e.target.value))}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </label>
          <button onClick={submitExtraRun}>Submit</button>
          <button className="cancel-btn" onClick={() => setExtraType(null)}>Cancel</button>
        </div>
      )}

      {showBowlerDropdown && (
        <div className="bowler-select-box">
          <label>
            Select Next Bowler:&nbsp;
            <select onChange={selectNextBowler} defaultValue={bowler}>
              {Array.from({ length: 11 }, (_, i) => `bowler${i + 1}`).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {showBatsmanDropdown && (
        <div className="batsman-select-box">
          <label>
            Select Next Batsman:&nbsp;
            <select onChange={selectNextBatsman}>
              {Array.from({ length: 11 - nextBatsmanIndex }, (_, i) => `batsman${i + nextBatsmanIndex}`).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="ball-log">
        <h3>Ball-by-Ball Commentary:</h3>
        <ul>
          {ballHistory.map((entry, index) => (
            <li key={index}>{entry.log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Match;
