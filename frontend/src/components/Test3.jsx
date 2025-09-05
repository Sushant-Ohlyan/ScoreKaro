import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/Match.css";

const Test3 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    teamAName = "Team A",
    teamBName = "Team B",
    teamAPlayers = [],
    teamBPlayers = [],
    venue = "Stadium",
    tossWonBy,
    tossDecision,
    overs = 5,
  } = location.state || {};

  const [currentBattingTeam, setCurrentBattingTeam] = useState(
    tossDecision === "Bat"
      ? tossWonBy
      : tossWonBy === teamAName
      ? teamBName
      : teamAName
  );

  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [commentary, setCommentary] = useState([]);
  const commentaryRef = useRef(null);

  const maxBalls = overs * 6;

  const [playingBatsmen, setPlayingBatsmen] = useState([]);
  const [playingBowler, setPlayingBowler] = useState(null);

  const [availableBatsmen, setAvailableBatsmen] = useState(
    currentBattingTeam === teamAName ? [...teamAPlayers] : [...teamBPlayers]
  );
  const [availableBowler, setAvailableBowler] = useState(
    currentBattingTeam === teamAName ? [...teamBPlayers] : [...teamAPlayers]
  );

  const [selectedBatsman, setSelectedBatsman] = useState("");
  const [selectedBowler, setSelectedBowler] = useState("");

  const [showBatsmanBtn, setShowBatsmanBtn] = useState(true);
  const [showBowlerBtn, setShowBowlerBtn] = useState(true);

  const [extraRunsInput, setExtraRunsInput] = useState(null);
  const [history, setHistory] = useState([]);

  // Bowler stats
  const [bowlerStats, setBowlerStats] = useState({ overs: 0, balls: 0, wickets: 0 });

  const saveHistory = () => {
    setHistory((prev) => [
      ...prev,
      {
        score,
        wickets,
        balls,
        commentary: [...commentary],
        playingBatsmen: JSON.parse(JSON.stringify(playingBatsmen)),
        playingBowler,
        extraRunsInput,
        availableBatsmen: [...availableBatsmen],
        availableBowler: [...availableBowler],
        showBatsmanBtn,
        showBowlerBtn,
        bowlerStats: { ...bowlerStats },
      },
    ]);
  };

  const addBatsman = () => {
    if (!selectedBatsman) return;
    saveHistory();
    const newBat = availableBatsmen.find((b) => b === selectedBatsman);
    setPlayingBatsmen((prev) => [...prev, { name: newBat, runs: 0, balls: 0 }]);
    setAvailableBatsmen((prev) => prev.filter((b) => b !== selectedBatsman));
    setSelectedBatsman("");
    setShowBatsmanBtn(false);
    addCommentary(`${newBat} comes to bat!`);
  };

  const addBowler = () => {
    if (!selectedBowler) return;
    saveHistory();
    setPlayingBowler(selectedBowler);
    setAvailableBowler((prev) => prev.filter((b) => b !== selectedBowler));
    setSelectedBowler("");
    setShowBowlerBtn(false);
    setBowlerStats({ overs: 0, balls: 0, wickets: 0 });
    addCommentary(`${selectedBowler} starts bowling!`);
  };

  const addCommentary = (text) => {
    setCommentary((prev) => [...prev, text]);
  };

  const swapStrike = () => {
    setPlayingBatsmen((prev) => {
      if (prev.length < 2) return prev;
      const newBatsmen = [...prev];
      [newBatsmen[0], newBatsmen[1]] = [newBatsmen[1], newBatsmen[0]];
      return newBatsmen;
    });
  };

  const updateScore = (runs = 0, type = "runs") => {
    if (balls >= maxBalls || wickets >= 10) return;
    saveHistory();

    if (type !== "runs") {
      setExtraRunsInput({ type, runs: 1 });
      return;
    }

    setScore((prev) => prev + runs);
    setBalls((prev) => prev + 1);

    // Update striker runs and balls
    setPlayingBatsmen((prev) => {
      const updated = [...prev];
      if (updated[0]) {
        updated[0].runs += runs;
        updated[0].balls += 1;
      }
      return updated;
    });

    // Update bowler stats
    setBowlerStats((prev) => {
      let b = prev.balls + 1;
      let o = prev.overs;
      if (b === 6) {
        o += 1;
        b = 0;
        swapStrike(); // swap strike at end of over
        setShowBowlerBtn(true); // new bowler can be added
      }
      return { ...prev, overs: o, balls: b };
    });

    addCommentary(`${runs} run(s)`);

    if (runs % 2 !== 0) swapStrike();
  };

  const confirmExtraRuns = () => {
    if (!extraRunsInput) return;
    saveHistory();
    const extra = Number(extraRunsInput.runs) || 0;
    const type = extraRunsInput.type;

    setScore((prev) => prev + extra);

    if (type === "Bye") {
      setBalls((prev) => prev + 1);
      setBowlerStats((prev) => {
        let b = prev.balls + 1;
        let o = prev.overs;
        if (b === 6) {
          o += 1;
          b = 0;
          swapStrike();
          setShowBowlerBtn(true);
        }
        return { ...prev, overs: o, balls: b };
      });
    }

    addCommentary(`${extra} extra run(s) for ${type}`);
    setExtraRunsInput(null);

    if (extra % 2 !== 0) swapStrike();
  };

  const updateWicket = () => {
    if (balls >= maxBalls || wickets >= 10) return;
    saveHistory();

    setWickets((prev) => prev + 1);
    setBalls((prev) => prev + 1);

    setPlayingBatsmen((prev) => prev.slice(1));
    addCommentary("Wicket!");

    setBowlerStats((prev) => ({ ...prev, wickets: prev.wickets + 1 }));
    setShowBatsmanBtn(true);

    swapStrike();
  };

  const undo = () => {
    const last = history.pop();
    if (!last) return;
    setScore(last.score);
    setWickets(last.wickets);
    setBalls(last.balls);
    setCommentary(last.commentary);
    setPlayingBatsmen(last.playingBatsmen);
    setPlayingBowler(last.playingBowler);
    setExtraRunsInput(last.extraRunsInput);
    setAvailableBatsmen(last.availableBatsmen);
    setAvailableBowler(last.availableBowler);
    setShowBatsmanBtn(last.showBatsmanBtn);
    setShowBowlerBtn(last.showBowlerBtn);
    setBowlerStats(last.bowlerStats);
    setHistory([...history]);
  };

  useEffect(() => {
    if (commentaryRef.current) commentaryRef.current.scrollTop = commentaryRef.current.scrollHeight;
  }, [commentary]);

  useEffect(() => {
    if (balls >= maxBalls || wickets >= 10) {
      addCommentary("Innings Ended!");
      alert("Innings Ended!");
    }
  }, [balls, wickets, maxBalls]);

  useEffect(() => {
    if (playingBatsmen.length < 2 && availableBatsmen.length > 0) setShowBatsmanBtn(true);
    if (!playingBowler && availableBowler.length > 0) setShowBowlerBtn(true);
  }, [playingBatsmen, playingBowler, availableBatsmen, availableBowler]);

  return (
    <div className="match-container">
      <div className="info-box match-info">
        <h2>{teamAName} vs {teamBName}</h2>
        <p>Venue: {venue}</p>
        <p>Batting First: <b>{currentBattingTeam}</b></p>
        <h3>{currentBattingTeam}: {score}/{wickets}</h3>
        <p>Overs: {bowlerStats.overs}.{bowlerStats.balls} / {overs}</p>
      </div>

      <div className="grid-container">
        <div className="info-box batsmen-info">
          <h3>Current Batsmen</h3>
          {playingBatsmen.map((b, idx) => (
            <p key={idx}>🏏 {b.name}: {b.runs} ({b.balls} balls)</p>
          ))}
          {showBatsmanBtn && availableBatsmen.length > 0 && (
            <>
              <select value={selectedBatsman} onChange={(e) => setSelectedBatsman(e.target.value)}>
                <option value="">Select Batsman</option>
                {availableBatsmen.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <button onClick={addBatsman}>Add Batsman</button>
            </>
          )}
        </div>

        <div className="info-box bowler-info">
          <h3>Current Bowler</h3>
          {playingBowler && (
            <p>🎯 {playingBowler} | Overs: {bowlerStats.overs}.{bowlerStats.balls} | Wickets: {bowlerStats.wickets}</p>
          )}
          {showBowlerBtn && availableBowler.length > 0 && (
            <>
              <select value={selectedBowler} onChange={(e) => setSelectedBowler(e.target.value)}>
                <option value="">Select Bowler</option>
                {availableBowler.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <button onClick={addBowler}>Add Bowler</button>
            </>
          )}
        </div>
      </div>

      <div className="scoring-tray">
        <h3>Scoring Tray</h3>
        <div className="button-grid">
          <button onClick={() => updateScore(0)}>0</button>
          <button onClick={() => updateScore(1)}>1</button>
          <button onClick={() => updateScore(2)}>2</button>
          <button onClick={() => updateScore(3)}>3</button>
          <button onClick={() => updateScore(4)}>4</button>
          <button onClick={() => updateScore(6)}>6</button>
          <button className="wicket-btn" onClick={updateWicket}>Wicket</button>
          <button onClick={() => updateScore(1, "Wide")}>Wide</button>
          <button onClick={() => updateScore(1, "No Ball")}>No Ball</button>
          <button onClick={() => updateScore(1, "Bye")}>Bye</button>
          <button className="undo-btn" onClick={undo}>Undo</button>
        </div>

        {extraRunsInput && (
          <div className="extra-runs-input">
            <p>Enter extra runs for {extraRunsInput.type}:</p>
            <input
              type="number"
              value={extraRunsInput.runs}
              onChange={(e) => setExtraRunsInput({ ...extraRunsInput, runs: e.target.value })}
            />
            <button onClick={confirmExtraRuns}>Confirm</button>
          </div>
        )}
      </div>

      <div className="commentary-box" ref={commentaryRef}>
        <h3>Commentary</h3>
        <ul>
          {commentary.map((c, idx) => <li key={idx}>{c}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default Test3;