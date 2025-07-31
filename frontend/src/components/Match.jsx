
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Match.css";

// --- Utility Creators ---
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

const Match = () => {
  const navigate = useNavigate();
  



  // ---- Team/Match State ----
  const [teamAName] = useState("Team A");
  const [teamBName] = useState("Team B");
  const [venueName] = useState("Stadium Name");
  const [currentBattingTeam] = useState("Team A");

  // ---- Score State ----
  const [currentBattingTeamScore, setCurrentBattingTeamScore] = useState(0);
  const [currentWicketCount, setCurrentWicketCount] = useState(0);
  const [ballsCount, setBallsCount] = useState(0);

  // ---- Batting ----
  const [batsmen, setBatsmen] = useState(getDefaultBatsmen());
  const [onStrikeIdx, setOnStrikeIdx] = useState(0);
  const [offStrikeIdx, setOffStrikeIdx] = useState(1);
  const [nextBatsmanNum, setNextBatsmanNum] = useState(2);
  const [showBatsmanDropdown, setShowBatsmanDropdown] = useState(false);
  const [selectedNextBatsmanIdx, setSelectedNextBatsmanIdx] = useState(null);

  // ---- Bowling ----
  const [bowlers, setBowlers] = useState(getDefaultBowlers());
  const [currentBowlerIdx, setCurrentBowlerIdx] = useState(0);
  const [showBowlerDropdown, setShowBowlerDropdown] = useState(false);
  const [selectedNextBowlerIdx, setSelectedNextBowlerIdx] = useState(null);

  // ---- Extras ----
  const [extraType, setExtraType] = useState(null);
  const [extraRun, setExtraRun] = useState(1);

  // ---- History ----
  const [ballHistory, setBallHistory] = useState([]);

  // Over Display
  const oversDisplay = `${Math.floor(ballsCount / 6)}.${ballsCount % 6}`;

  // --- Snapshot: for undo ---
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
  const restoreSnapshot = snap => {
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

  // --- Bat/Bowl Updating Helpers ---
  const addBatStats = (idx, runs, balls = 1) => {
    setBatsmen(bs =>
      bs.map((b, i) =>
        i === idx ? { ...b, runs: b.runs + runs, balls: b.balls + balls } : b
      )
    );
  };
  const addBowlerStats = (idx, runs, balls = 1, wickets = 0) => {
    setBowlers(bw =>
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

  // --- Strike Swapper ---
  const swapStrike = () => {
    setOnStrikeIdx(nowOn => {
      setOffStrikeIdx(nowOn);
      return offStrikeIdx;
    });
  };

  // --- Legal Ball Played (inc balls, check over, open bowler select) ---
  const legalBallPlayed = () => {
    setBallsCount(prev => {
      const newBalls = prev + 1;
      if (newBalls % 6 === 0) setShowBowlerDropdown(true);
      return newBalls;
    });
  };

  // --- Runs, Wicket, Extras Handlers ---
  function handleRun(runs) {
    const snapshot = getSnapshot();
    const ballNum = `${Math.floor(ballsCount / 6)}.${ballsCount % 6 + 1}`;
    let commentary =
      runs === 4
        ? `${ballNum} - FOUR by ${batsmen[onStrikeIdx].name}`
        : runs === 6
        ? `${ballNum} - SIX by ${batsmen[onStrikeIdx].name}`
        : `${ballNum} - ${runs} run${runs > 1 ? "s" : ""} by ${
            batsmen[onStrikeIdx].name
          }`;
    setCurrentBattingTeamScore(s => s + runs);
    addBatStats(onStrikeIdx, runs, 1);
    addBowlerStats(currentBowlerIdx, runs, 1);
    setBallHistory(prev => [
      ...prev,
      { type: "run", value: runs, snapshot, log: commentary },
    ]);
    legalBallPlayed();
    if (runs % 2 === 1) swapStrike();
  }

  function handleWicket() {
    const snapshot = getSnapshot();
    const ballNum = `${Math.floor(ballsCount / 6)}.${ballsCount % 6 + 1}`;
    const commentary = `${ballNum} - WICKET! ${
      batsmen[onStrikeIdx].name
    } OUT, bowled by ${bowlers[currentBowlerIdx].name}`;
    setCurrentWicketCount(w => w + 1);
    addBowlerStats(currentBowlerIdx, 0, 1, 1);
    setBallHistory(prev => [
      ...prev,
      { type: "wicket", snapshot, log: commentary },
    ]);
    legalBallPlayed();
    setShowBatsmanDropdown(true);
    setSelectedNextBatsmanIdx(null);
  }

  function handleExtraType(type) {
    setExtraType(type);
    setExtraRun(1);
  }
  function submitExtraRun() {
    if (!extraType) return;
    const snapshot = getSnapshot();
    const desc = { nb: "NO BALL", wide: "WIDE", bye: "BYE", lb: "LEG BYE" }[extraType];
    const ballNum = `${Math.floor(ballsCount / 6)}.${ballsCount % 6 + 1}`;
    setCurrentBattingTeamScore(s => s + extraRun);
    addBowlerStats(
      currentBowlerIdx,
      extraRun,
      extraType === "bye" || extraType === "lb" ? 1 : 0
    );
    setBallHistory(prev => [
      ...prev,
      {
        type: "extra",
        value: extraRun,
        subtype: extraType,
        snapshot,
        log: `${ballNum} - ${desc} + ${extraRun - 1}`,
      },
    ]);
    setExtraType(null);
    setExtraRun(1);
    if (extraType === "bye" || extraType === "lb") legalBallPlayed();
  }

  // --- Undo Handler ---
  function handleUndo() {
    if (ballHistory.length === 0) return;
    const last = ballHistory[ballHistory.length - 1];
    if (last && last.snapshot) restoreSnapshot(last.snapshot);
    setBallHistory(hist => hist.slice(0, -1));
  }

  // --- Bowler/Batsman Dropdowns ---
  const selectNextBowler = e => setSelectedNextBowlerIdx(Number(e.target.value));
  const submitNextBowler = () => {
    if (selectedNextBowlerIdx !== null) {
      const snapshot = getSnapshot();
      setBallHistory(prev => [
        ...prev,
        {
          type: "bowlerChange",
          snapshot,
          log: `New Bowler: ${bowlers[selectedNextBowlerIdx].name}`,
        },
      ]);
      setCurrentBowlerIdx(selectedNextBowlerIdx);
      setShowBowlerDropdown(false);
      setSelectedNextBowlerIdx(null);
    }
  };

  const selectNextBatsman = e =>
    setSelectedNextBatsmanIdx(Number(e.target.value));
  const submitNextBatsman = () => {
    if (selectedNextBatsmanIdx !== null) {
      const snapshot = getSnapshot();
      setBallHistory(prev => [
        ...prev,
        {
          type: "batsmanChange",
          snapshot,
          log: `New Batsman: ${batsmen[selectedNextBatsmanIdx].name} to crease`,
        },
      ]);
      setOnStrikeIdx(selectedNextBatsmanIdx);
      setNextBatsmanNum(n => n + 1);
      setShowBatsmanDropdown(false);
      setSelectedNextBatsmanIdx(null);
    }
  };

  // --- End of Innings ---
  useEffect(() => {
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

  // --- Render ---
  return (
    <div className="match-container">
      <div className="match-header">
        <h2>
          {teamAName} vs {teamBName}
        </h2>
        <span>{venueName}</span>
      </div>

      {/* ---- Scoreboard ---- */}
      <div className="score-info">
        <div className="team-score">
          <h3>{currentBattingTeam}</h3>
          <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {currentBattingTeamScore}-{currentWicketCount}
          </span>
          <span style={{ fontSize: "1.1rem" }}>Overs: {oversDisplay}</span>
        </div>
        <div className="batsmen">
          <div>
            <b>{batsmen[onStrikeIdx].name}*</b>{" "}
            <span>
              {batsmen[onStrikeIdx].runs} ({batsmen[onStrikeIdx].balls})
            </span>
          </div>
          <div>
            <b>{batsmen[offStrikeIdx].name}</b>{" "}
            <span>
              {batsmen[offStrikeIdx].runs} ({batsmen[offStrikeIdx].balls})
            </span>
          </div>
        </div>
        <div className="bowler">
          <span>
            <b>Bowler:</b> {bowlers[currentBowlerIdx].name}
          </span>
          <br />
          <span>
            Overs: {Math.floor(bowlers[currentBowlerIdx].balls / 6)}.
            {bowlers[currentBowlerIdx].balls % 6} | Runs:{" "}
            {bowlers[currentBowlerIdx].runs} | Wickets:{" "}
            {bowlers[currentBowlerIdx].wickets}
          </span>
        </div>
      </div>

      {/* --- CONTROLS GRID --- */}
      <div className="buttons-grid">
        {[0,1, 2, 3, 4, 6].map(run => (
          <button
            key={run}
            onClick={() => handleRun(run)}
            className="run-btn"
            aria-label={`Add ${run} run${run > 1 ? "s" : ""}`}
          >
            {run}
          </button>
        ))}
        <button className="wicket" onClick={handleWicket}>
          WICKET
        </button>
        {["nb", "wide", "bye", "lb"].map(type => (
          <button
            key={type}
            onClick={() => handleExtraType(type)}
            className={`${type}`}
            aria-label={type.toUpperCase()}
          >
            {type.toUpperCase()}
          </button>
        ))}
        <button className="undo" onClick={handleUndo}>
          Undo
        </button>
      </div>

      {/* ---- EXTRAS SECTION ---- */}
      {extraType && (
        <div className="extra-run-box">
          <label>
            Runs on {extraType.toUpperCase()} (incl. default 1):{" "}
            <select
              value={extraRun}
              onChange={e => setExtraRun(Number(e.target.value))}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <button onClick={submitExtraRun}>Submit</button>
          <button className="cancel-btn" onClick={() => setExtraType(null)}>
            Cancel
          </button>
        </div>
      )}

      {/* ---- BOWLER/BATSMAN DROPDOWNS ---- */}
      {showBowlerDropdown && (
        <div className="bowler-select-box">
          <label>
            Select Next Bowler:&nbsp;
            <select
              onChange={selectNextBowler}
              value={selectedNextBowlerIdx ?? currentBowlerIdx}
            >
              {bowlers.map((b, idx) => (
                <option key={idx} value={idx}>
                  {b.name}
                </option>
              ))}
            </select>
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
            <select
              onChange={selectNextBatsman}
              value={selectedNextBatsmanIdx ?? ""}
            >
              <option value="" disabled>
                Select
              </option>
              {batsmen.map(
                (bat, idx) =>
                  idx >= nextBatsmanNum && (
                    <option key={idx} value={idx}>
                      {bat.name}
                    </option>
                  )
              )}
            </select>
            <button
              onClick={submitNextBatsman}
              disabled={selectedNextBatsmanIdx === null}
            >
              Submit
            </button>
          </label>
        </div>
      )}

      {/* ---- BALL LOG ---- */}
      <div className="ball-log">
        <h3>Ball-by-ball Log</h3>
        <ul>
          {ballHistory.map((entry, idx) => (
            <li key={idx}>{entry.log}</li>
          ))}
        </ul>
      </div>

      
    </div>
  );
};

export default Match;
