import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../style/Test.css';
import '../style/Match.css';
// Utilities for default names
const getDefaultBatsmen = () =>
  Array.from({ length: 11 }, (_, i) => ({
    name: `batsman${i + 1}`,
    runs: 0,
    balls: 0,
  }));

const getDefaultBowlers = () =>
  Array.from({ length: 11 }, (_, i) => ({
    name: `bowler${i + 1}`,
    runs: 0,
    balls: 0,
    wickets: 0,
  }));

const Test = () => {
  const navigate = useNavigate();

  // Core state
  const [teamAName] = useState("Team A");
  const [teamBName] = useState("Team B");
  const [venueName] = useState("Stadium Name");
  const [currentBattingTeam] = useState("Team A");

  const [currentBattingTeamScore, setCurrentBattingTeamScore] = useState(0);
  const [currentWicketCount, setCurrentWicketCount] = useState(0);
  // Only ballsCount is needed for overs/balls display & logic
  const [ballsCount, setBallsCount] = useState(0);

  // Batting state
  const [batsmen, setBatsmen] = useState(getDefaultBatsmen());
  const [onStrikeIdx, setOnStrikeIdx] = useState(0);
  const [offStrikeIdx, setOffStrikeIdx] = useState(1);
  const [nextBatsmanNum, setNextBatsmanNum] = useState(2);
  const [showBatsmanDropdown, setShowBatsmanDropdown] = useState(false);
  const [selectedNextBatsmanIdx, setSelectedNextBatsmanIdx] = useState(null);

  // Bowling state
  const [bowlers, setBowlers] = useState(getDefaultBowlers());
  const [currentBowlerIdx, setCurrentBowlerIdx] = useState(0);
  const [showBowlerDropdown, setShowBowlerDropdown] = useState(false);
  const [selectedNextBowlerIdx, setSelectedNextBowlerIdx] = useState(null);

  // Extras
  const [extraType, setExtraType] = useState(null);
  const [extraRun, setExtraRun] = useState(1);

  // Log: save snapshots for undo
  const [ballHistory, setBallHistory] = useState([]);

  // Derived for display
  const oversDisplay = `${Math.floor(ballsCount / 6)}.${ballsCount % 6}`;

  // Helpers for undo: get deep snapshot of all key states
  const getSnapshot = () => ({
    currentBattingTeamScore,
    currentWicketCount,
    ballsCount,
    batsmen: JSON.parse(JSON.stringify(batsmen)),
    onStrikeIdx,
    offStrikeIdx,
    nextBatsmanNum,
    bowlers: JSON.parse(JSON.stringify(bowlers)),
    currentBowlerIdx,
    showBatsmanDropdown,
    showBowlerDropdown,
  });

  // Restore all key states from snapshot (for undo)
  const restoreSnapshot = (snap) => {
    setCurrentBattingTeamScore(snap.currentBattingTeamScore);
    setCurrentWicketCount(snap.currentWicketCount);
    setBallsCount(snap.ballsCount);
    setBatsmen(snap.batsmen);
    setOnStrikeIdx(snap.onStrikeIdx);
    setOffStrikeIdx(snap.offStrikeIdx);
    setNextBatsmanNum(snap.nextBatsmanNum);
    setBowlers(snap.bowlers);
    setCurrentBowlerIdx(snap.currentBowlerIdx);
    setShowBatsmanDropdown(snap.showBatsmanDropdown);
    setShowBowlerDropdown(snap.showBowlerDropdown);
  };

  // --- Stats Helpers ---

  // Batsman - update by runs/balls (e.g. for run scored or not)
  const addBatStats = (idx, runs, balls = 1) => {
    setBatsmen((bs) =>
      bs.map((b, i) =>
        i === idx
          ? { ...b, runs: b.runs + runs, balls: b.balls + balls }
          : b
      )
    );
  };

  // Bowler - update by runs, balls, wickets
  const addBowlerStats = (idx, runs, balls = 1, wickets = 0) => {
    setBowlers((bw) =>
      bw.map((b, i) =>
        i === idx
          ? {
              ...b,
              runs: b.runs + runs,
              balls: b.balls + balls,
              wickets: b.wickets + wickets,
            }
          : b
      )
    );
  };

  // --- Strike Swap ---
  const swapStrike = () => {
    setOnStrikeIdx((nowOn) => {
      setOffStrikeIdx(nowOn);
      return offStrikeIdx;
    });
  };

  // --- Ball and Over Management ---

  // Legal delivery: always increments ballsCount (called for run, wicket, bye, lb)
  const legalBallPlayed = () => {
    setBallsCount((prev) => {
      const newBalls = prev + 1;
      if ((newBalls % 6) === 0) setShowBowlerDropdown(true);
      return newBalls;
    });
  };

  // --- MAIN BUTTONS ---

  const handleRun = (runs) => {
    // Save snapshot for undo
    const snapshot = getSnapshot();

    const ballNum = `${Math.floor(ballsCount / 6)}.${ballsCount % 6 + 1}`;
    let commentary = runs === 4
      ? `${ballNum} - FOUR by ${batsmen[onStrikeIdx].name}`
      : runs === 6
      ? `${ballNum} - SIX by ${batsmen[onStrikeIdx].name}`
      : `${ballNum} - ${runs} RUN${runs > 1 ? "S" : ""} by ${batsmen[onStrikeIdx].name}`;

    setCurrentBattingTeamScore((s) => s + runs);
    addBatStats(onStrikeIdx, runs, 1);
    addBowlerStats(currentBowlerIdx, runs, 1);

    setBallHistory((prev) => [
      ...prev,
      {
        type: "run",
        value: runs,
        snapshot,
        log: commentary,
      }
    ]);

    legalBallPlayed();

    if (runs % 2 === 1) swapStrike();
  };

  const handleWicket = () => {
    // Save snapshot for undo
    const snapshot = getSnapshot();

    const ballNum = `${Math.floor(ballsCount / 6)}.${ballsCount % 6 + 1}`;
    const commentary = `${ballNum} - WICKET! ${batsmen[onStrikeIdx].name} OUT, bowled by ${bowlers[currentBowlerIdx].name}`;
    setCurrentWicketCount((w) => w + 1);
    addBowlerStats(currentBowlerIdx, 0, 1, 1);

    setBallHistory((prev) => [
      ...prev,
      {
        type: "wicket",
        snapshot,
        log: commentary,
      }
    ]);

    legalBallPlayed();

    setShowBatsmanDropdown(true);
    setSelectedNextBatsmanIdx(null);
  };

  // --- EXTRAS ---

  const handleExtraType = (type) => {
    setExtraType(type);
    setExtraRun(1);
  };

  // Extras - submit and record
  const submitExtraRun = () => {
    if (!extraType) return;

    // Save snapshot for undo
    const snapshot = getSnapshot();

    const desc = { nb: "NO BALL", wide: "WIDE", bye: "BYE", lb: "LEG BYE" }[extraType];
    const ballNum = `${Math.floor(ballsCount / 6)}.${ballsCount % 6 + 1}`;

    setCurrentBattingTeamScore((s) => s + extraRun);
    // Add to bowler's runs (ball is legal only for bye/lb)
    addBowlerStats(currentBowlerIdx, extraRun, (extraType === "bye" || extraType === "lb") ? 1 : 0);

    setBallHistory((prev) => [
      ...prev,
      {
        type: "extra",
        value: extraRun,
        subtype: extraType,
        snapshot,
        log: `${ballNum} - ${desc} + ${extraRun - 1}`,
      }
    ]);

    setExtraType(null);
    setExtraRun(1);

    // Only bye or lb are legal deliveries (increment balls)
    if (extraType === "bye" || extraType === "lb") {
      legalBallPlayed();
    }
  };

  // --- UNDO ---

  const handleUndo = () => {
    if (ballHistory.length === 0) return;
    // Remove last event, get previous snapshot
    const last = ballHistory[ballHistory.length - 1];
    if (last && last.snapshot) {
      restoreSnapshot(last.snapshot);
    }

    // Remove last log
    setBallHistory((hist) => hist.slice(0, -1));
  };

  // --- Dropdowns ---
  // Bowler: after 6 balls, must submit
  const selectNextBowler = (e) => setSelectedNextBowlerIdx(Number(e.target.value));
  const submitNextBowler = () => {
    if (selectedNextBowlerIdx !== null) {
      // Save snapshot for undo (so UNDO after bowler change also works)
      const snapshot = getSnapshot();
      setBallHistory((prev) => [
        ...prev,
        {
          type: "bowlerChange",
          snapshot,
          log: `New Bowler: ${bowlers[selectedNextBowlerIdx].name}`,
        }
      ]);
      setCurrentBowlerIdx(selectedNextBowlerIdx);
      setShowBowlerDropdown(false);
      setSelectedNextBowlerIdx(null);
    }
  };

  // Batsman: after wicket, must submit
  const selectNextBatsman = (e) => setSelectedNextBatsmanIdx(Number(e.target.value));
  const submitNextBatsman = () => {
    if (selectedNextBatsmanIdx !== null) {
      // Save snapshot for undo (so UNDO after batsman change also works)
      const snapshot = getSnapshot();
      setBallHistory((prev) => [
        ...prev,
        {
          type: "batsmanChange",
          snapshot,
          log: `New Batsman: ${batsmen[selectedNextBatsmanIdx].name} to crease`,
        }
      ]);
      setOnStrikeIdx(selectedNextBatsmanIdx);
      setNextBatsmanNum((n) => n + 1);
      setShowBatsmanDropdown(false);
      setSelectedNextBatsmanIdx(null);
    }
  };

  // --- End of Innings ---
  useEffect(() => {
    // End after 10 wickets or 120 balls (20 overs)
    if (currentWicketCount === 10 || ballsCount === 120) {
      navigate("/inning-summary", {
        state: {
          score: currentBattingTeamScore,
          wickets: currentWicketCount,
          overs: `${Math.floor(ballsCount / 6)}.${ballsCount % 6}`,
        },
      });
    }
  }, [currentWicketCount, ballsCount, navigate, currentBattingTeamScore]);

  // --- UI ---
  return (
    <div className="match-container">
  <div className="match-header">
    <h2>
      {teamAName} vs {teamBName}
    </h2>
    <span>{venueName}</span>
  </div>

  <hr />

  <div className="score-info">
    <h3>
      {currentBattingTeam}
      <br />
      <span style={{ fontSize: "18pt" }}>
        {currentBattingTeamScore}-{currentWicketCount}
        &nbsp; Overs: {Math.floor(ballsCount / 6)}.{ballsCount % 6}
      </span>
    </h3>
  </div>

  <div className="batsmen-section">
    <b>Batsmen</b>
    <div>
      <b>{batsmen[onStrikeIdx].name}*</b> &nbsp;
      {batsmen[onStrikeIdx].runs}({batsmen[onStrikeIdx].balls})
    </div>
    <div>
      {batsmen[offStrikeIdx].name} &nbsp;
      {batsmen[offStrikeIdx].runs}({batsmen[offStrikeIdx].balls})
    </div>
  </div>

  <div className="bowler-section">
    <b>Bowler:</b>{" "}
    {bowlers[currentBowlerIdx].name} &nbsp;
    Overs: {Math.floor(bowlers[currentBowlerIdx].balls / 6)}.
    {bowlers[currentBowlerIdx].balls % 6} &nbsp;
    Runs: {bowlers[currentBowlerIdx].runs} &nbsp;
    Wickets: {bowlers[currentBowlerIdx].wickets}
  </div>

  <div className="buttons-row">
    {[1, 2, 3, 4, 6].map((run) => (
      <button key={run} onClick={() => handleRun(run)}>{run}</button>
    ))}
    <button onClick={handleWicket}>Wicket</button>
    {["nb", "wide", "bye", "lb"].map((type) => (
      <button key={type} onClick={() => handleExtraType(type)}>
        {type.toUpperCase()}
      </button>
    ))}
    <button onClick={handleUndo}>Undo</button>
  </div>

  {extraType && (
    <div className="extra-run-box">
      <label>
        Runs on {extraType.toUpperCase()} (including default 1):{" "}
        <select
          value={extraRun}
          onChange={(e) => setExtraRun(Number(e.target.value))}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </label>{" "}
      <button onClick={submitExtraRun}>Submit</button>
      <button className="cancel-btn" onClick={() => setExtraType(null)}>Cancel</button>
    </div>
  )}

  {showBowlerDropdown && (
    <div className="bowler-select-box">
      <label>
        Select Next Bowler:&nbsp;
        <select
          onChange={selectNextBowler}
          value={selectedNextBowlerIdx ?? currentBowlerIdx}
        >
          {bowlers.map((b, idx) => (
            <option key={idx} value={idx}>{b.name}</option>
          ))}
        </select>{" "}
        <button 
          onClick={submitNextBowler}
          disabled={selectedNextBowlerIdx === null}
        >
          Submit
        </button>
      </label>
    </div>
  )}

  {showBatsmanDropdown && (
    <div className="batsman-select-box">
      <label>
        Select Next Batsman:&nbsp;
        <select onChange={selectNextBatsman} value={selectedNextBatsmanIdx ?? ""}>
          <option value="" disabled>Select</option>
          {batsmen.map((bat, idx) =>
            idx >= nextBatsmanNum && (
              <option key={idx} value={idx}>{bat.name}</option>
            )
          )}
        </select>{" "}
        <button 
          onClick={submitNextBatsman}
          disabled={selectedNextBatsmanIdx === null}
        >
          Submit
        </button>
      </label>
    </div>
  )}

  <div className="ball-history">
    <b>Ball-by-ball log:</b>
    <ul>
      {ballHistory.map((entry, idx) => (
        <li key={idx}>{entry.log}</li>
      ))}
    </ul>
  </div>
</div>

  );
};

export default Test;
