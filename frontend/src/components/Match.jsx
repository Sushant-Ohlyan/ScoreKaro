// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../style/Match.css";

// // --- Utility Creators ---
// const getDefaultBatsmen = () =>
//   Array.from({ length: 11 }, (_, i) => ({
//     name: `batsman${i + 1}`,
//     runs: 0,
//     balls: 0,
//   }));

// const getDefaultBowlers = () =>
//   Array.from({ length: 11 }, (_, i) => ({
//     name: `bowler${i + 1}`,
//     runs: 0,
//     balls: 0,
//     wickets: 0,
//   }));

// const Match = () => {
//   const navigate = useNavigate();
  
//   // ---- Team/Match State ----
//   const [teamAName] = useState("Team A");
//   const [teamBName] = useState("Team B");
//   const [venueName] = useState("Stadium Name");
//   const [currentBattingTeam] = useState("Team A");

//   // ---- Score State ----
//   const [currentBattingTeamScore, setCurrentBattingTeamScore] = useState(0);
//   const [currentWicketCount, setCurrentWicketCount] = useState(0);
//   const [ballsCount, setBallsCount] = useState(0);

//   // ---- Batting ----
//   const [batsmen, setBatsmen] = useState(getDefaultBatsmen());
//   const [onStrikeIdx, setOnStrikeIdx] = useState(0);
//   const [offStrikeIdx, setOffStrikeIdx] = useState(1);
//   const [nextBatsmanNum, setNextBatsmanNum] = useState(2);
//   const [showBatsmanDropdown, setShowBatsmanDropdown] = useState(false);
//   const [selectedNextBatsmanIdx, setSelectedNextBatsmanIdx] = useState(null);

//   // ---- Bowling ----
//   const [bowlers, setBowlers] = useState(getDefaultBowlers());
//   const [currentBowlerIdx, setCurrentBowlerIdx] = useState(0);
//   const [showBowlerDropdown, setShowBowlerDropdown] = useState(false);
//   const [selectedNextBowlerIdx, setSelectedNextBowlerIdx] = useState(null);

//   // ---- Extras ----
//   const [extraType, setExtraType] = useState(null);
//   const [extraRun, setExtraRun] = useState(1);

//   // ---- History ----
//   const [ballHistory, setBallHistory] = useState([]);

//   // Over Display
//   const oversDisplay = `${Math.floor(ballsCount / 6)}.${ballsCount % 6}`;

//   // --- Snapshot: for undo ---
//   const getSnapshot = () => ({
//     currentBattingTeamScore,
//     currentWicketCount,
//     ballsCount,
//     batsmen: JSON.parse(JSON.stringify(batsmen)),
//     onStrikeIdx,
//     offStrikeIdx,
//     nextBatsmanNum,
//     bowlers: JSON.parse(JSON.stringify(bowlers)),
//     currentBowlerIdx,
//     showBatsmanDropdown,
//     showBowlerDropdown,
//   });
//   const restoreSnapshot = snap => {
//     setCurrentBattingTeamScore(snap.currentBattingTeamScore);
//     setCurrentWicketCount(snap.currentWicketCount);
//     setBallsCount(snap.ballsCount);
//     setBatsmen(snap.batsmen);
//     setOnStrikeIdx(snap.onStrikeIdx);
//     setOffStrikeIdx(snap.offStrikeIdx);
//     setNextBatsmanNum(snap.nextBatsmanNum);
//     setBowlers(snap.bowlers);
//     setCurrentBowlerIdx(snap.currentBowlerIdx);
//     setShowBatsmanDropdown(snap.showBatsmanDropdown);
//     setShowBowlerDropdown(snap.showBowlerDropdown);
//   };

//   // --- Bat/Bowl Updating Helpers ---
//   const addBatStats = (idx, runs, balls = 1) => {
//     setBatsmen(bs =>
//       bs.map((b, i) =>
//         i === idx ? { ...b, runs: b.runs + runs, balls: b.balls + balls } : b
//       )
//     );
//   };
//   const addBowlerStats = (idx, runs, balls = 1, wickets = 0) => {
//     setBowlers(bw =>
//       bw.map((b, i) =>
//         i === idx
//           ? {
//               ...b,
//               runs: b.runs + runs,
//               balls: b.balls + balls,
//               wickets: b.wickets + wickets,
//             }
//           : b
//       )
//     );
//   };

//   // --- Strike Swapper ---
//   const swapStrike = () => {
//     setOnStrikeIdx(nowOn => {
//       setOffStrikeIdx(nowOn);
//       return offStrikeIdx;
//     });
//   };

//   // --- Legal Ball Played (inc balls, check over, open bowler select) ---
//   const legalBallPlayed = () => {
//     setBallsCount(prev => {
//       const newBalls = prev + 1;
//       if (newBalls % 6 === 0) setShowBowlerDropdown(true);
//       return newBalls;
//     });
//   };

//   // --- Runs, Wicket, Extras Handlers ---
//   function handleRun(runs) {
//     const snapshot = getSnapshot();
//     const ballNum = `${Math.floor(ballsCount / 6)}.${ballsCount % 6 + 1}`;
//     let commentary =
//       runs === 4
//         ? `${ballNum} - FOUR by ${batsmen[onStrikeIdx].name}`
//         : runs === 6
//         ? `${ballNum} - SIX by ${batsmen[onStrikeIdx].name}`
//         : `${ballNum} - ${runs} run${runs > 1 ? "s" : ""} by ${
//             batsmen[onStrikeIdx].name
//           }`;
//     setCurrentBattingTeamScore(s => s + runs);
//     addBatStats(onStrikeIdx, runs, 1);
//     addBowlerStats(currentBowlerIdx, runs, 1);
//     setBallHistory(prev => [
//       ...prev,
//       { type: "run", value: runs, snapshot, log: commentary },
//     ]);
//     legalBallPlayed();
//     if (runs % 2 === 1) swapStrike();
//   }

//   function handleWicket() {
//     const snapshot = getSnapshot();
//     const ballNum = `${Math.floor(ballsCount / 6)}.${ballsCount % 6 + 1}`;
//     const commentary = `${ballNum} - WICKET! ${
//       batsmen[onStrikeIdx].name
//     } OUT, bowled by ${bowlers[currentBowlerIdx].name}`;
//     setCurrentWicketCount(w => w + 1);
//     addBowlerStats(currentBowlerIdx, 0, 1, 1);
//     setBallHistory(prev => [
//       ...prev,
//       { type: "wicket", snapshot, log: commentary },
//     ]);
//     legalBallPlayed();
//     setShowBatsmanDropdown(true);
//     setSelectedNextBatsmanIdx(null);
//   }

//   function handleExtraType(type) {
//     setExtraType(type);
//     setExtraRun(1);
//   }
//   function submitExtraRun() {
//     if (!extraType) return;
//     const snapshot = getSnapshot();
//     const desc = { nb: "NO BALL", wide: "WIDE", bye: "BYE", lb: "LEG BYE" }[extraType];
//     const ballNum = `${Math.floor(ballsCount / 6)}.${ballsCount % 6 + 1}`;
//     setCurrentBattingTeamScore(s => s + extraRun);
//     addBowlerStats(
//       currentBowlerIdx,
//       extraRun,
//       extraType === "bye" || extraType === "lb" ? 1 : 0
//     );
//     setBallHistory(prev => [
//       ...prev,
//       {
//         type: "extra",
//         value: extraRun,
//         subtype: extraType,
//         snapshot,
//         log: `${ballNum} - ${desc} + ${extraRun - 1}`,
//       },
//     ]);
//     setExtraType(null);
//     setExtraRun(1);
//     if (extraType === "bye" || extraType === "lb") legalBallPlayed();
//   }

//   // --- Undo Handler ---
//   function handleUndo() {
//     if (ballHistory.length === 0) return;
//     const last = ballHistory[ballHistory.length - 1];
//     if (last && last.snapshot) restoreSnapshot(last.snapshot);
//     setBallHistory(hist => hist.slice(0, -1));
//   }

//   // --- Bowler/Batsman Dropdowns ---
//   const selectNextBowler = e => setSelectedNextBowlerIdx(Number(e.target.value));
//   const submitNextBowler = () => {
//     if (selectedNextBowlerIdx !== null) {
//       const snapshot = getSnapshot();
//       setBallHistory(prev => [
//         ...prev,
//         {
//           type: "bowlerChange",
//           snapshot,
//           log: `New Bowler: ${bowlers[selectedNextBowlerIdx].name}`,
//         },
//       ]);
//       setCurrentBowlerIdx(selectedNextBowlerIdx);
//       setShowBowlerDropdown(false);
//       setSelectedNextBowlerIdx(null);
//     }
//   };

//   const selectNextBatsman = e =>
//     setSelectedNextBatsmanIdx(Number(e.target.value));
//   const submitNextBatsman = () => {
//     if (selectedNextBatsmanIdx !== null) {
//       const snapshot = getSnapshot();
//       setBallHistory(prev => [
//         ...prev,
//         {
//           type: "batsmanChange",
//           snapshot,
//           log: `New Batsman: ${batsmen[selectedNextBatsmanIdx].name} to crease`,
//         },
//       ]);
//       setOnStrikeIdx(selectedNextBatsmanIdx);
//       setNextBatsmanNum(n => n + 1);
//       setShowBatsmanDropdown(false);
//       setSelectedNextBatsmanIdx(null);
//     }
//   };

//   // --- End of Innings ---
//   useEffect(() => {
//     if (currentWicketCount === 10 || ballsCount === 120) {
//       navigate("/inning-summary", {
//         state: {
//           score: currentBattingTeamScore,
//           wickets: currentWicketCount,
//           overs: `${Math.floor(ballsCount / 6)}.${ballsCount % 6}`,
//         },
//       });
//     }
//   }, [currentWicketCount, ballsCount, navigate, currentBattingTeamScore]);

//   // --- Render ---
//   return (
//     <div className="match-container">
//       <div className="match-header">
//         <h2>
//           {teamAName} vs {teamBName}
//         </h2>
//         <span>{venueName}</span>
//       </div>

//       {/* ---- Scoreboard ---- */}
//       <div className="score-info">
//         <div className="team-score">
//           <h3>{currentBattingTeam}</h3>
//           <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
//             {currentBattingTeamScore}-{currentWicketCount}
//           </span>
//           <span style={{ fontSize: "1.1rem" }}>Overs: {oversDisplay}</span>
//         </div>
//         <div className="batsmen">
//           <div>
//             <b>{batsmen[onStrikeIdx].name}*</b>{" "}
//             <span>
//               {batsmen[onStrikeIdx].runs} ({batsmen[onStrikeIdx].balls})
//             </span>
//           </div>
//           <div>
//             <b>{batsmen[offStrikeIdx].name}</b>{" "}
//             <span>
//               {batsmen[offStrikeIdx].runs} ({batsmen[offStrikeIdx].balls})
//             </span>
//           </div>
//         </div>
//         <div className="bowler">
//           <span>
//             <b>Bowler:</b> {bowlers[currentBowlerIdx].name}
//           </span>
//           <br />
//           <span>
//             Overs: {Math.floor(bowlers[currentBowlerIdx].balls / 6)}.
//             {bowlers[currentBowlerIdx].balls % 6} | Runs:{" "}
//             {bowlers[currentBowlerIdx].runs} | Wickets:{" "}
//             {bowlers[currentBowlerIdx].wickets}
//           </span>
//         </div>
//       </div>

//       {/* --- CONTROLS GRID --- */}
//       <div className="buttons-grid">
//         {[0,1, 2, 3, 4, 6].map(run => (
//           <button
//             key={run}
//             onClick={() => handleRun(run)}
//             className="run-btn"
//             aria-label={`Add ${run} run${run > 1 ? "s" : ""}`}
//           >
//             {run}
//           </button>
//         ))}
//         <button className="wicket" onClick={handleWicket}>
//           WICKET
//         </button>
//         {["nb", "wide", "bye", "lb"].map(type => (
//           <button
//             key={type}
//             onClick={() => handleExtraType(type)}
//             className={`${type}`}
//             aria-label={type.toUpperCase()}
//           >
//             {type.toUpperCase()}
//           </button>
//         ))}
//         <button className="undo" onClick={handleUndo}>
//           Undo
//         </button>
//       </div>

//       {/* ---- EXTRAS SECTION ---- */}
//       {extraType && (
//         <div className="extra-run-box">
//           <label>
//             Runs on {extraType.toUpperCase()} (incl. default 1):{" "}
//             <select
//               value={extraRun}
//               onChange={e => setExtraRun(Number(e.target.value))}
//             >
//               {[0, 1, 2, 3, 4, 5, 6, 7].map(v => (
//                 <option key={v} value={v}>
//                   {v}
//                 </option>
//               ))}
//             </select>
//           </label>
//           <button onClick={submitExtraRun}>Submit</button>
//           <button className="cancel-btn" onClick={() => setExtraType(null)}>
//             Cancel
//           </button>
//         </div>
//       )}

//       {/* ---- BOWLER/BATSMAN DROPDOWNS ---- */}
//       {showBowlerDropdown && (
//         <div className="bowler-select-box">
//           <label>
//             Select Next Bowler:&nbsp;
//             <select
//               onChange={selectNextBowler}
//               value={selectedNextBowlerIdx ?? currentBowlerIdx}
//             >
//               {bowlers.map((b, idx) => (
//                 <option key={idx} value={idx}>
//                   {b.name}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={submitNextBowler}
//               disabled={selectedNextBowlerIdx === null}
//             >
//               Submit
//             </button>
//           </label>
//         </div>
//       )}

//       {showBatsmanDropdown && (
//         <div className="batsman-select-box">
//           <label>
//             Select Next Batsman:&nbsp;
//             <select
//               onChange={selectNextBatsman}
//               value={selectedNextBatsmanIdx ?? ""}
//             >
//               <option value="" disabled>
//                 Select
//               </option>
//               {batsmen.map(
//                 (bat, idx) =>
//                   idx >= nextBatsmanNum && (
//                     <option key={idx} value={idx}>
//                       {bat.name}
//                     </option>
//                   )
//               )}
//             </select>
//             <button
//               onClick={submitNextBatsman}
//               disabled={selectedNextBatsmanIdx === null}
//             >
//               Submit
//             </button>
//           </label>
//         </div>
//       )}

//       {/* ---- BALL LOG ---- */}
//       <div className="ball-log">
//         <h3>Ball-by-ball Log</h3>
//         <ul>
//           {ballHistory.map((entry, idx) => (
//             <li key={idx}>{entry.log}</li>
//           ))}
//         </ul>
//       </div>

      
//     </div>
//   );
// };

// export default Match;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../style/Match.css";

/**
 * Match.jsx (Hybrid: Frontend scoring + Backend persistence)
 *
 * WHAT THIS FILE DOES
 * --------------------
 * - All cricket scoring logic is handled on the frontend (runs, wickets, extras, strike swap, undo, bowlers/batsmen, commentary).
 * - The backend is only used to:
 *      1) Fetch initial match data at the start (teams, players, toss, etc.)
 *      2) Save a snapshot every over
 *      3) Save an inning summary when the inning ends
 *      4) Save a final match summary when the match ends (2nd innings complete)
 *
 * HOW TO USE
 * ----------
 * - Navigate to this route with `useLocation.state` from MatchSetup.jsx.
 *   Expected `location.state` (examples / optional fallback defaults):
 *     {
 *       matchId: "<mongo-id>",
 *       teamAName: "Team A",
 *       teamBName: "Team B",
 *       teamAPlayers: ["A1", "A2", ... up to 11],
 *       teamBPlayers: ["B1", "B2", ... up to 11],
 *       venueName: "Stadium Name",
 *       tossWonBy: "Team A",
 *       tossDecision: "Bat" | "Bowl",
 *       overs: 20, // <-- authoritative from MatchSetup.jsx (your note)
 *       inningsNumber: 1, // 1 or 2
 *       totalInnings: 2,   // usually 2
 *       battingFirst: "Team A", // optional
 *       bowlingFirst: "Team B", // optional
 *     }
 *
 * - If some fields are missing in `location.state`, we attempt to fetch them from backend.
 * - API BASE is configurable. See `api` object below.
 *
 * NOTES
 * -----
 * - Keep code simple & verbose with comments for clarity. You can delete comments later.
 * - UI is plain; you can style more in ../style/Match.css.
 */

// -------------------------------
// API CONFIG
// -------------------------------
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Build endpoint paths in one place so it's easy to change later
const endpoints = {
  getMatch: (id) => `/api/scoring/${id}`,
  overUpdate: (id) => `/api/scoring/${id}/over-update`,
  inningComplete: (id) => `/api/scoring/${id}/inning-complete`,
  matchComplete: (id) => `/api/scoring/${id}/match-complete`,
};

// -------------------------------
// Helpers to create default squads for quick testing
// -------------------------------
const getDefaultBatsmen = () =>
  Array.from({ length: 11 }, (_, i) => ({
    name: `batsman${i + 1}`,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    out: false,
    howOut: "",
  }));

const getDefaultBowlers = () =>
  Array.from({ length: 11 }, (_, i) => ({
    name: `bowler${i + 1}`,
    balls: 0, // balls this bowler delivered
    runs: 0, // conceded
    wickets: 0,
    maidens: 0, // simple calc at over end if over conceded 0
  }));

// Deep clone utility for snapshots/undo
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export default function Match() {
  // Router
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams(); // optional if you also embed :matchId in route

  // -------------------------------
  // Parse incoming location.state (authoritative overs come from here per your instruction)
  // -------------------------------
  const {
    matchId: matchIdFromState,
    teamAName: teamAFromState,
    teamBName: teamBFromState,
    teamAPlayers: teamAPlayersFromState,
    teamBPlayers: teamBPlayersFromState,
    venueName: venueFromState,
    tossWonBy: tossWonByFromState,
    tossDecision: tossDecisionFromState,
    overs: oversFromState,
    inningsNumber: inningsNumberFromState = 1,
    totalInnings: totalInningsFromState = 2,
    battingFirst: battingFirstFromState,
    bowlingFirst: bowlingFirstFromState,
  } = location.state || {};

  // If route contains :matchId, use it; otherwise use state. (Both supported)
  const routeMatchId = params.matchId;
  const matchId = matchIdFromState || routeMatchId || "temp-local"; // fallback id

  // Authoritative overs from location.state (as requested)
  const configuredOvers = Number(oversFromState) || 20; // default to 20 if missing
  const maxBallsInInnings = configuredOvers * 6;

  // -------------------------------
  // Local UI + Match state
  // -------------------------------
  const [loading, setLoading] = useState(true);
  const [initialFetchError, setInitialFetchError] = useState("");

  // scoreboard basic
  const [currentBattingTeamScore, setCurrentBattingTeamScore] = useState(0);
  const [currentWicketCount, setCurrentWicketCount] = useState(0);
  const [ballsCount, setBallsCount] = useState(0); // legal balls in the innings

  // teams & venue
  const [teamAName, setTeamAName] = useState(teamAFromState || "Team A");
  const [teamBName, setTeamBName] = useState(teamBFromState || "Team B");
  const [venueName, setVenueName] = useState(venueFromState || "Stadium Name");

  // innings flow
  const [inningsNumber, setInningsNumber] = useState(inningsNumberFromState);
  const [totalInnings, setTotalInnings] = useState(totalInningsFromState);

  // who bats first (derived from toss or provided directly)
  const [tossWonBy, setTossWonBy] = useState(tossWonByFromState || "Team A");
  const [tossDecision, setTossDecision] = useState(tossDecisionFromState || "Bat");

  // Determine batting order
  const derivedBattingFirst = useMemo(() => {
    if (battingFirstFromState) return battingFirstFromState;
    if (!tossWonBy || !tossDecision) return teamAName; // fallback
    if (tossDecision === "Bat") return tossWonBy;
    // if tossDecision === "Bowl", the other team bats first
    return tossWonBy === teamAName ? teamBName : teamAName;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tossWonBy, tossDecision, teamAName, teamBName]);

  const [currentBattingTeam, setCurrentBattingTeam] = useState(
    inningsNumber === 1 ? derivedBattingFirst : (derivedBattingFirst === teamAName ? teamBName : teamAName)
  );
  const [currentBowlingTeam, setCurrentBowlingTeam] = useState(
    currentBattingTeam === teamAName ? teamBName : teamAName
  );

  // squads
  const [batsmen, setBatsmen] = useState(getDefaultBatsmen());
  const [bowlers, setBowlers] = useState(getDefaultBowlers());

  // batting control
  const [onStrikeIdx, setOnStrikeIdx] = useState(0);
  const [offStrikeIdx, setOffStrikeIdx] = useState(1);
  const [nextBatsmanNum, setNextBatsmanNum] = useState(2); // index pointer for next new batsman
  const [showBatsmanDropdown, setShowBatsmanDropdown] = useState(false);
  const [selectedNextBatsmanIdx, setSelectedNextBatsmanIdx] = useState(null);

  // bowling control
  const [currentBowlerIdx, setCurrentBowlerIdx] = useState(0);
  const [showBowlerDropdown, setShowBowlerDropdown] = useState(false);
  const [selectedNextBowlerIdx, setSelectedNextBowlerIdx] = useState(null);
  const [lastOverRunsThisBowler, setLastOverRunsThisBowler] = useState(0); // used to calculate maidens

  // extras UI
  const [extraType, setExtraType] = useState(null); // 'nb' | 'wide' | 'bye' | 'lb'
  const [extraRun, setExtraRun] = useState(1); // default 1 per extra button

  // history & commentary
  const [ballHistory, setBallHistory] = useState([]); // array of entries
  const commentaryRef = useRef(null);

  // Navigation state packing helper (for summaries)
  const summaryState = useMemo(() => ({
    matchId,
    inningsNumber,
    totalInnings,
    teamAName,
    teamBName,
    venueName,
    tossWonBy,
    tossDecision,
    overs: configuredOvers,
    currentBattingTeam,
    currentBowlingTeam,
  }), [
    matchId,
    inningsNumber,
    totalInnings,
    teamAName,
    teamBName,
    venueName,
    tossWonBy,
    tossDecision,
    configuredOvers,
    currentBattingTeam,
    currentBowlingTeam,
  ]);

  // Overs display "x.y"
  const oversDisplay = `${Math.floor(ballsCount / 6)}.${ballsCount % 6}`;

  // ---------------------------------
  // INITIAL FETCH (API #1) when component mounts
  //   - We respect overs from location.state (authoritative),
  //     but we may fetch players/names/venue/toss if not provided.
  // ---------------------------------
  useEffect(() => {
    let canceled = false;

    async function fetchInitial() {
      try {
        // If we have a real matchId (not temp), hit backend; otherwise just use state
        if (matchId !== "temp-local") {
          const res = await api.get(endpoints.getMatch(matchId));
          const data = res?.data || {};

          // Only set fields that are missing in state to keep state authoritative when provided
          if (!teamAFromState && data.teamAName) setTeamAName(data.teamAName);
          if (!teamBFromState && data.teamBName) setTeamBName(data.teamBName);
          if (!venueFromState && data.venueName) setVenueName(data.venueName);
          if (!tossWonByFromState && data.tossWonBy) setTossWonBy(data.tossWonBy);
          if (!tossDecisionFromState && data.tossDecision) setTossDecision(data.tossDecision);

          // squads: prefer location.state; else backend; else defaults
          const chosenBattingTeamFirst = inningsNumber === 1 ? (
            battingFirstFromState || (tossDecisionFromState === "Bat" ? tossWonByFromState : (tossWonByFromState === teamAFromState ? teamBFromState : teamAFromState))
          ) : (
            // second innings
            battingFirstFromState ? (battingFirstFromState === teamAFromState ? teamBFromState : teamAFromState) : undefined
          );

          const aPlayers = teamAPlayersFromState || data.teamAPlayerNames || [];
          const bPlayers = teamBPlayersFromState || data.teamBPlayerNames || [];

          // If no players provided anywhere, keep defaults
          if (aPlayers.length && bPlayers.length) {
            const initialBatsmen = (currentBattingTeam === teamAName ? aPlayers : bPlayers).map((p) => ({
              name: p,
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              out: false,
              howOut: "",
            }));
            const initialBowlers = (currentBowlingTeam === teamAName ? aPlayers : bPlayers).map((p) => ({
              name: p,
              balls: 0,
              runs: 0,
              wickets: 0,
              maidens: 0,
            }));
            if (!canceled) {
              setBatsmen(initialBatsmen);
              setBowlers(initialBowlers);
            }
          }
        } else {
          // temp-local: build squads from state if provided
          const aPlayers = teamAPlayersFromState || [];
          const bPlayers = teamBPlayersFromState || [];
          if (aPlayers.length && bPlayers.length) {
            const initialBatsmen = (currentBattingTeam === teamAName ? aPlayers : bPlayers).map((p) => ({
              name: p,
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              out: false,
              howOut: "",
            }));
            const initialBowlers = (currentBowlingTeam === teamAName ? aPlayers : bPlayers).map((p) => ({
              name: p,
              balls: 0,
              runs: 0,
              wickets: 0,
              maidens: 0,
            }));
            if (!canceled) {
              setBatsmen(initialBatsmen);
              setBowlers(initialBowlers);
            }
          }
        }
      } catch (err) {
        if (!canceled) setInitialFetchError(err?.message || "Failed to fetch initial match data");
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    fetchInitial();
    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep commentary scrolled to bottom
  useEffect(() => {
    if (commentaryRef.current) {
      commentaryRef.current.scrollTop = commentaryRef.current.scrollHeight;
    }
  }, [ballHistory]);

  // -------------------------------
  // Snapshots for Undo
  // -------------------------------
  const getSnapshot = () => ({
    currentBattingTeamScore,
    currentWicketCount,
    ballsCount,
    batsmen: deepClone(batsmen),
    onStrikeIdx,
    offStrikeIdx,
    nextBatsmanNum,
    bowlers: deepClone(bowlers),
    currentBowlerIdx,
    showBatsmanDropdown,
    showBowlerDropdown,
    lastOverRunsThisBowler,
  });

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
    setLastOverRunsThisBowler(snap.lastOverRunsThisBowler);
  };

  // ---------------------------------
  // Bat / Bowl updating helpers
  // ---------------------------------
  const addBatStats = (idx, runs, balls = 1) => {
    setBatsmen((bs) =>
      bs.map((b, i) =>
        i === idx
          ? {
              ...b,
              runs: b.runs + runs,
              balls: b.balls + balls,
              fours: b.fours + (runs === 4 ? 1 : 0),
              sixes: b.sixes + (runs === 6 ? 1 : 0),
            }
          : b
      )
    );
  };

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

  // -------------------------------
  // Strike swapper (called on odd runs and over end)
  // -------------------------------
  const swapStrike = () => {
    setOnStrikeIdx((nowOn) => {
      setOffStrikeIdx(nowOn);
      return offStrikeIdx;
    });
  };

  // -------------------------------
  // LEGAL BALL PLAYED: increments balls, handles over end & bowler selection & API #2
  // -------------------------------
  const legalBallPlayed = async () => {
    setBallsCount((prev) => {
      const newBalls = prev + 1;

      // Over end block (every 6 legal balls)
      if (newBalls % 6 === 0) {
        // Show next bowler dropdown for the new over
        setShowBowlerDropdown(true);

        // Calculate maiden over for the current bowler
        setBowlers((bw) => {
          const updated = deepClone(bw);
          const current = updated[currentBowlerIdx];
          const concededThisOver = lastOverRunsThisBowler;
          if (concededThisOver === 0) {
            current.maidens = (current.maidens || 0) + 1;
          }
          return updated;
        });

        // API #2 — save over snapshot to backend
        saveOverToBackend(newBalls / 6);

        // Reset over conceded tracker
        setLastOverRunsThisBowler(0);

        // Swap strike at the end of the over
        swapStrike();
      }

      return newBalls;
    });
  };

  // ---------------------------------
  // API #2: Update backend at OVER END
  // ---------------------------------
  const saveOverToBackend = async (overNumber) => {
    try {
      if (matchId === "temp-local") return; // do nothing in local mode
      await api.put(endpoints.overUpdate(matchId), {
        matchId,
        inningsNumber,
        overNumber, // 1-based index of the over that just completed
        score: currentBattingTeamScore,
        wickets: currentWicketCount,
        balls: ballsCount, // total legal balls so far
        batsmen,
        bowlers,
        currentBattingTeam,
        currentBowlingTeam,
        ballHistory,
      });
    } catch (err) {
      console.error("Failed to save over snapshot:", err?.message || err);
    }
  };

  // ---------------------------------
  // RUNS, WICKET, EXTRAS HANDLERS (frontend-only calculation)
  // ---------------------------------
  function handleRun(runs) {
    if (ballsCount >= maxBallsInInnings || currentWicketCount >= 10) return;

    const snapshot = getSnapshot();
    const ballNum = `${Math.floor(ballsCount / 6)}.${(ballsCount % 6) + 1}`;

    const striker = batsmen[onStrikeIdx]?.name || "Striker";
    let commentary =
      runs === 4
        ? `${ballNum} - FOUR by ${striker}`
        : runs === 6
        ? `${ballNum} - SIX by ${striker}`
        : `${ballNum} - ${runs} run${runs > 1 ? "s" : ""} by ${striker}`;

    setCurrentBattingTeamScore((s) => s + runs);
    addBatStats(onStrikeIdx, runs, 1);
    addBowlerStats(currentBowlerIdx, runs, 1);

    // Track over conceded for maiden calc
    setLastOverRunsThisBowler((val) => val + runs);

    setBallHistory((prev) => [...prev, { type: "run", value: runs, snapshot, log: commentary }]);

    legalBallPlayed();

    if (runs % 2 === 1) swapStrike();
  }

  function handleWicket() {
    if (ballsCount >= maxBallsInInnings || currentWicketCount >= 10) return;

    const snapshot = getSnapshot();
    const ballNum = `${Math.floor(ballsCount / 6)}.${(ballsCount % 6) + 1}`;
    const outBatter = batsmen[onStrikeIdx]?.name || "Batter";
    const byBowler = bowlers[currentBowlerIdx]?.name || "Bowler";

    const commentary = `${ballNum} - WICKET! ${outBatter} OUT, bowled by ${byBowler}`;
    setCurrentWicketCount((w) => w + 1);
    addBowlerStats(currentBowlerIdx, 0, 1, 1);
    setBallHistory((prev) => [...prev, { type: "wicket", snapshot, log: commentary }]);

    legalBallPlayed();

    // Mark striker as out
    setBatsmen((bs) => {
      const updated = deepClone(bs);
      if (updated[onStrikeIdx]) {
        updated[onStrikeIdx].out = true;
        updated[onStrikeIdx].howOut = "b. " + byBowler;
      }
      return updated;
    });

    setShowBatsmanDropdown(true);
    setSelectedNextBatsmanIdx(null);
  }

  function handleExtraType(type) {
    setExtraType(type); // 'nb' | 'wide' | 'bye' | 'lb'
    setExtraRun(1);
  }

  function submitExtraRun() {
    if (!extraType) return;
    if (ballsCount >= maxBallsInInnings || currentWicketCount >= 10) return;

    const snapshot = getSnapshot();
    const desc = { nb: "NO BALL", wide: "WIDE", bye: "BYE", lb: "LEG BYE" }[extraType];
    const ballNum = `${Math.floor(ballsCount / 6)}.${(ballsCount % 6) + 1}`;

    // Score always increases for extras by extraRun
    setCurrentBattingTeamScore((s) => s + extraRun);

    // Bowler gets runs added for NB/WIDE; Bye/LB are not bowler's conceded (traditional scoring),
    // but leagues vary; we'll do conventional: bye/lb not charged to bowler.
    if (extraType === "bye" || extraType === "lb") {
      // counts as a legal ball
      addBowlerStats(currentBowlerIdx, 0, 1);
      legalBallPlayed();

      // Byes/leg byes can rotate strike if odd
      if (extraRun % 2 === 1) swapStrike();
    } else {
      // NO BALL or WIDE: not a legal ball, so don't increment balls for the over
      addBowlerStats(currentBowlerIdx, extraRun, 0);
      // For NB + runs off the bat, you'd normally add separate run buttons after NB; here we keep it simple.

      // Over-conceded tracker increments for wides & NBs
      setLastOverRunsThisBowler((val) => val + extraRun);
    }

    setBallHistory((prev) => [
      ...prev,
      {
        type: "extra",
        value: extraRun,
        subtype: extraType,
        snapshot,
        log: `${ballNum} - ${desc}${extraRun > 1 ? ` + ${extraRun - 1}` : ""}`,
      },
    ]);

    setExtraType(null);
    setExtraRun(1);
  }

  // ---------------------------------
  // UNDO (restores last snapshot if available)
  // ---------------------------------
  function handleUndo() {
    if (ballHistory.length === 0) return;
    const last = ballHistory[ballHistory.length - 1];
    if (last && last.snapshot) restoreSnapshot(last.snapshot);
    setBallHistory((hist) => hist.slice(0, -1));
  }

  // ---------------------------------
  // Bowler/Batsman dropdown handlers
  // ---------------------------------
  const selectNextBowler = (e) => setSelectedNextBowlerIdx(Number(e.target.value));

  const submitNextBowler = () => {
    if (selectedNextBowlerIdx !== null) {
      const snapshot = getSnapshot();
      setBallHistory((prev) => [
        ...prev,
        { type: "bowlerChange", snapshot, log: `New Bowler: ${bowlers[selectedNextBowlerIdx].name}` },
      ]);
      setCurrentBowlerIdx(selectedNextBowlerIdx);
      setShowBowlerDropdown(false);
      setSelectedNextBowlerIdx(null);
    }
  };

  const selectNextBatsman = (e) => setSelectedNextBatsmanIdx(Number(e.target.value));

  const submitNextBatsman = () => {
    if (selectedNextBatsmanIdx !== null) {
      const snapshot = getSnapshot();
      setBallHistory((prev) => [
        ...prev,
        { type: "batsmanChange", snapshot, log: `New Batsman: ${batsmen[selectedNextBatsmanIdx].name} to crease` },
      ]);
      setOnStrikeIdx(selectedNextBatsmanIdx);
      setNextBatsmanNum((n) => n + 1);
      setShowBatsmanDropdown(false);
      setSelectedNextBatsmanIdx(null);
    }
  };

  // ---------------------------------
  // INNINGS END WATCHERS
  //   - End when wickets === 10 or balls === maxBallsInInnings
  //   - On end: Call API #3 (inning-complete) OR API #4 (match-complete)
  // ---------------------------------
  useEffect(() => {
    if (currentWicketCount === 10 || ballsCount >= maxBallsInInnings) {
      // Slight delay to allow UI updates, then persist
      endOfInningsFlow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWicketCount, ballsCount]);

  const buildInningsPayload = () => ({
    matchId,
    inningsNumber,
    overs: oversDisplay,
    balls: ballsCount,
    score: currentBattingTeamScore,
    wickets: currentWicketCount,
    batsmen,
    bowlers,
    currentBattingTeam,
    currentBowlingTeam,
    ballHistory,
    venueName,
    teamAName,
    teamBName,
  });

  const endOfInningsFlow = async () => {
    try {
      if (inningsNumber < totalInnings) {
        // API #3: Save inning summary and navigate to InningSummary
        if (matchId !== "temp-local") {
          await api.post(endpoints.inningComplete(matchId), buildInningsPayload());
        }
        navigate("/inning-summary", {
          state: {
            ...summaryState,
            score: currentBattingTeamScore,
            wickets: currentWicketCount,
            overs: oversDisplay,
            nextInningsNumber: inningsNumber + 1,
          },
        });
      } else {
        // Last innings → API #4: save full match summary
        if (matchId !== "temp-local") {
          await api.post(endpoints.matchComplete(matchId), buildInningsPayload());
        }
        navigate("/match-summary", {
          state: {
            ...summaryState,
            finalScore: currentBattingTeamScore,
            totalWickets: currentWicketCount,
            totalOvers: oversDisplay,
          },
        });
      }
    } catch (err) {
      console.error("Failed to persist end of innings/match:", err?.message || err);
    }
  };

  // ---------------------------------
  // RENDER
  // ---------------------------------
  if (loading) {
    return (
      <div className="match-container">
        <p>Loading match...</p>
        {initialFetchError && <p className="error">{initialFetchError}</p>}
      </div>
    );
  }

  return (
    <div className="match-container">
      {/* HEADER */}
      <div className="match-header">
        <h2>
          {teamAName} vs {teamBName}
        </h2>
        <div className="meta">
          <span>Venue: {venueName}</span>
          <span> | Overs: {configuredOvers}</span>
          <span> | Innings: {inningsNumber}/{totalInnings}</span>
        </div>
        <div className="meta">
          <span>Toss: {tossWonBy} chose to {tossDecision}</span>
        </div>
      </div>

      {/* SCOREBOARD */}
      <div className="score-info">
        <div className="team-score">
          <h3>Batting: {currentBattingTeam}</h3>
          <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {currentBattingTeamScore}-{currentWicketCount}
          </span>
          <span style={{ fontSize: "1.1rem" }}>Overs: {oversDisplay}</span>
        </div>

        {/* Batsmen */}
        <div className="batsmen">
          <div>
            <b>{batsmen[onStrikeIdx]?.name || "Striker"}*</b>{" "}
            <span>
              {batsmen[onStrikeIdx]?.runs || 0} ({batsmen[onStrikeIdx]?.balls || 0})
            </span>
          </div>
          <div>
            <b>{batsmen[offStrikeIdx]?.name || "Non-Striker"}</b>{" "}
            <span>
              {batsmen[offStrikeIdx]?.runs || 0} ({batsmen[offStrikeIdx]?.balls || 0})
            </span>
          </div>
        </div>

        {/* Bowler */}
        <div className="bowler">
          <span>
            <b>Bowler:</b> {bowlers[currentBowlerIdx]?.name || "Bowler"}
          </span>
          <br />
          <span>
            Overs: {Math.floor((bowlers[currentBowlerIdx]?.balls || 0) / 6)}.
            {(bowlers[currentBowlerIdx]?.balls || 0) % 6} | Runs: {bowlers[currentBowlerIdx]?.runs || 0} | Wickets: {bowlers[currentBowlerIdx]?.wickets || 0} | Maidens: {bowlers[currentBowlerIdx]?.maidens || 0}
          </span>
        </div>
      </div>

      {/* CONTROLS GRID */}
      <div className="buttons-grid">
        {[0, 1, 2, 3, 4, 6].map((run) => (
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

        {["nb", "wide", "bye", "lb"].map((type) => (
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

      {/* EXTRAS SECTION */}
      {extraType && (
        <div className="extra-run-box">
          <label>
            Runs on {extraType.toUpperCase()} (incl. default 1):{" "}
            <select value={extraRun} onChange={(e) => setExtraRun(Number(e.target.value))}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((v) => (
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

      {/* BOWLER SELECT */}
      {showBowlerDropdown && (
        <div className="bowler-select-box">
          <label>
            Select Next Bowler:&nbsp;
            <select onChange={selectNextBowler} value={selectedNextBowlerIdx ?? currentBowlerIdx}>
              {bowlers.map((b, idx) => (
                <option key={idx} value={idx}>
                  {b.name}
                </option>
              ))}
            </select>
            <button onClick={submitNextBowler} disabled={selectedNextBowlerIdx === null}>
              Submit
            </button>
          </label>
        </div>
      )}

      {/* BATSMAN SELECT (on wicket) */}
      {showBatsmanDropdown && (
        <div className="batsman-select-box">
          <label>
            Select Next Batsman:&nbsp;
            <select onChange={selectNextBatsman} value={selectedNextBatsmanIdx ?? ""}>
              <option value="" disabled>
                Select
              </option>
              {batsmen.map((bat, idx) => idx >= nextBatsmanNum && (
                <option key={idx} value={idx}>
                  {bat.name}
                </option>
              ))}
            </select>
            <button onClick={submitNextBatsman} disabled={selectedNextBatsmanIdx === null}>
              Submit
            </button>
          </label>
        </div>
      )}

      {/* BALL LOG */}
      <div className="ball-log" ref={commentaryRef}>
        <h3>Ball-by-ball Log</h3>
        <ul>
          {ballHistory.map((entry, idx) => (
            <li key={idx}>{entry.log}</li>
          ))}
        </ul>
      </div>

      {/* FOOTNOTE / HELP */}
      <div className="help">
        <details>
          <summary>Notes & Tips</summary>
          <ul>
            <li>Overs limit is provided by MatchSetup via <code>useLocation.state.overs</code>.</li>
            <li>All scoring is calculated on the frontend. The backend is only for saving.</li>
            <li>At the end of each over, a snapshot is saved to the server (API #2).</li>
            <li>When wickets reach 10 or overs complete, the inning ends and is saved (API #3/#4).</li>
            <li>Undo restores the last snapshot state (if any).</li>
          </ul>
        </details>
      </div>
    </div>
  );
}

