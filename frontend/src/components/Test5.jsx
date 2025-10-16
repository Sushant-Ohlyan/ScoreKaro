// src/components/Match.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../style/Match.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Match.jsx
 * - Full scoring UI + PDF export
 * - Integrates with backend endpoints (over-update, inning-complete, match-complete)
 *
 * NOTE:
 * - Ensure api base URL is configured through env or default.
 * - Install jspdf and html2canvas: npm i jspdf html2canvas
 */

/* ---------- API wrapper ---------- */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

const endpoints = {
  getMatch: (id) => `/api/scoring/${id}`,
  overUpdate: (id) => `/api/scoring/${id}/over-update`,
  inningComplete: (id) => `/api/scoring/${id}/inning-complete`,
  matchComplete: (id) => `/api/scoring/${id}/match-complete`,
};

/* ---------- Helpers (defaults) ---------- */
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
    balls: 0,
    runs: 0,
    wickets: 0,
    maidens: 0,
  }));

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/* ---------- Main Component ---------- */
export default function Match() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Accept many possible state props from previous pages (TeamSetup/MatchSetup)
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

  const routeMatchId = params.matchId;
  const matchId = matchIdFromState || routeMatchId || "temp-local";

  const configuredOvers = Number(oversFromState) || 2;
  const maxBallsInInnings = configuredOvers * 6;

  /* ---------- Local UI state ---------- */
  const [loading, setLoading] = useState(true);
  const [initialFetchError, setInitialFetchError] = useState("");

  const [currentBattingTeamScore, setCurrentBattingTeamScore] = useState(0);
  const [currentWicketCount, setCurrentWicketCount] = useState(0);
  const [ballsCount, setBallsCount] = useState(0);

  const [teamAName, setTeamAName] = useState(teamAFromState || "Team A");
  const [teamBName, setTeamBName] = useState(teamBFromState || "Team B");
  const [venueName, setVenueName] = useState(venueFromState || "Stadium");

  const [inningsNumber, setInningsNumber] = useState(inningsNumberFromState);
  const [totalInnings, setTotalInnings] = useState(totalInningsFromState);

  const [tossWonBy, setTossWonBy] = useState(tossWonByFromState || teamAFromState || "Team A");
  const [tossDecision, setTossDecision] = useState(tossDecisionFromState || "Bat");

  // who bats first
  const derivedBattingFirst = useMemo(() => {
    if (battingFirstFromState) return battingFirstFromState;
    if (!tossWonBy || !tossDecision) return teamAName;
    if (tossDecision === "Bat") return tossWonBy;
    return tossWonBy === teamAName ? teamBName : teamAName;
  }, [battingFirstFromState, tossWonBy, tossDecision, teamAName, teamBName]);

  const [currentBattingTeam, setCurrentBattingTeam] = useState(
    inningsNumber === 1
      ? derivedBattingFirst
      : derivedBattingFirst === teamAName
      ? teamBName
      : teamAName
  );
  const [currentBowlingTeam, setCurrentBowlingTeam] = useState(
    currentBattingTeam === teamAName ? teamBName : teamAName
  );

  const [batsmen, setBatsmen] = useState(getDefaultBatsmen());
  const [bowlers, setBowlers] = useState(getDefaultBowlers());

  // batting control
  const [onStrikeIdx, setOnStrikeIdx] = useState(0);
  const [offStrikeIdx, setOffStrikeIdx] = useState(1);
  const [nextBatsmanNum, setNextBatsmanNum] = useState(2);
  const [showBatsmanDropdown, setShowBatsmanDropdown] = useState(false);
  const [selectedNextBatsmanIdx, setSelectedNextBatsmanIdx] = useState(null);

  // bowling control
  const [currentBowlerIdx, setCurrentBowlerIdx] = useState(0);
  const [showBowlerDropdown, setShowBowlerDropdown] = useState(false);
  const [selectedNextBowlerIdx, setSelectedNextBowlerIdx] = useState(null);
  const [lastOverRunsThisBowler, setLastOverRunsThisBowler] = useState(0);

  // extras
  const [extraType, setExtraType] = useState(null);
  const [extraRun, setExtraRun] = useState(1);

  // ball history & commentary
  const [ballHistory, setBallHistory] = useState([]);
  const commentaryRef = useRef(null);

  // PDF auto-download setting
  const [autoDownloadOnComplete, setAutoDownloadOnComplete] = useState(false);

  // derived summary (used when navigating or saving)
  const summaryState = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  const oversDisplay = `${Math.floor(ballsCount / 6)}.${ballsCount % 6}`;

  /* ---------- Initial fetch: get saved match or populate from state ---------- */
  useEffect(() => {
    let canceled = false;

    async function fetchInitial() {
      try {
        if (matchId !== "temp-local") {
          const res = await api.get(endpoints.getMatch(matchId));
          const data = res?.data || {};

          if (!teamAFromState && data.teamAName) setTeamAName(data.teamAName);
          if (!teamBFromState && data.teamBName) setTeamBName(data.teamBName);
          if (!venueFromState && data.venueName) setVenueName(data.venueName);
          if (!tossWonByFromState && data.tossWonBy) setTossWonBy(data.tossWonBy);
          if (!tossDecisionFromState && data.tossDecision) setTossDecision(data.tossDecision);

          const aPlayers = teamAPlayersFromState || data.teamAPlayerNames || [];
          const bPlayers = teamBPlayersFromState || data.teamBPlayerNames || [];

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
          // temp-local: use provided state arrays
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

  /* Keep commentary scrolled to bottom */
  useEffect(() => {
    if (commentaryRef.current) commentaryRef.current.scrollTop = commentaryRef.current.scrollHeight;
  }, [ballHistory]);

  /* ---------- Snapshots for Undo ---------- */
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

  /* ---------- Helpers to mutate batsmen/bowlers ---------- */
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

  /* Swap strike */
  const swapStrike = () => {
    setOnStrikeIdx((nowOn) => {
      setOffStrikeIdx(nowOn);
      return offStrikeIdx;
    });
  };

  /* ---------- Over & balls management ---------- */
  const legalBallPlayed = async () => {
    setBallsCount((prev) => {
      const newBalls = prev + 1;

      // Over end (every 6 legal balls)
      if (newBalls % 6 === 0) {
        // Show bowler select for next over
        setShowBowlerDropdown(true);

        // Calculate maiden for current bowler
        setBowlers((bw) => {
          const updated = deepClone(bw);
          const current = updated[currentBowlerIdx];
          const concededThisOver = lastOverRunsThisBowler;
          if (concededThisOver === 0) {
            current.maidens = (current.maidens || 0) + 1;
          }
          return updated;
        });

        // Save over snapshot to backend (overNumber is 1-based)
        saveOverToBackend(newBalls / 6);

        // Reset per-over tracker
        setLastOverRunsThisBowler(0);

        // Swap strike at over end
        swapStrike();
      }

      return newBalls;
    });
  };

  /* ---------- API: save over snapshot ---------- */
  const saveOverToBackend = async (overNumber) => {
    try {
      if (matchId === "temp-local") return;
      await api.put(endpoints.overUpdate(matchId), {
        matchId,
        inningsNumber,
        overNumber,
        score: currentBattingTeamScore,
        wickets: currentWicketCount,
        balls: ballsCount,
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

  /* ---------- Scoring handlers ---------- */
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

    // Show dropdown to pick next batsman
    setShowBatsmanDropdown(true);
    setSelectedNextBatsmanIdx(null);
  }

  function handleExtraType(type) {
    setExtraType(type);
    setExtraRun(1);
  }

  function submitExtraRun() {
    if (!extraType) return;
    if (ballsCount >= maxBallsInInnings || currentWicketCount >= 10) return;

    const snapshot = getSnapshot();
    const desc = { nb: "NO BALL", wide: "WIDE", bye: "BYE", lb: "LEG BYE" }[extraType];
    const ballNum = `${Math.floor(ballsCount / 6)}.${(ballsCount % 6) + 1}`;

    setCurrentBattingTeamScore((s) => s + extraRun);

    if (extraType === "bye" || extraType === "lb") {
      // counts as legal ball; bowler not charged runs
      addBowlerStats(currentBowlerIdx, 0, 1);
      legalBallPlayed();

      if (extraRun % 2 === 1) swapStrike();
    } else {
      // no-ball/wide: not a legal ball; charge bowler runs
      addBowlerStats(currentBowlerIdx, extraRun, 0);
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

  /* ---------- Undo ---------- */
  function handleUndo() {
    if (ballHistory.length === 0) return;
    const last = ballHistory[ballHistory.length - 1];
    if (last && last.snapshot) restoreSnapshot(last.snapshot);
    setBallHistory((hist) => hist.slice(0, -1));
  }

  /* ---------- Bowler/Batsman selection flows ---------- */
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

  /* ---------- End of innings/match flow ---------- */
  useEffect(() => {
    if (currentWicketCount === 10 || ballsCount >= maxBallsInInnings) {
      // allow UI to update then perform end flow
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
        if (matchId !== "temp-local") {
          await api.post(endpoints.inningComplete(matchId), buildInningsPayload());
        }
        // navigate to inning summary or reset for next innings
        navigate("/Test6", {
          state: {
            ...summaryState,
            score: currentBattingTeamScore,
            wickets: currentWicketCount,
            overs: oversDisplay,
            nextInningsNumber: inningsNumber + 1,
          },
        });
      } else {
        // final innings end — save match summary and go to match-summary
        if (matchId !== "temp-local") {
          await api.post(endpoints.matchComplete(matchId), buildInningsPayload());
        }
        // Prepare final data
        const finalData = {
          ...summaryState,
          finalScore: currentBattingTeamScore,
          totalWickets: currentWicketCount,
          totalOvers: oversDisplay,
          batsmen,
          bowlers,
        };

        // navigate to match summary page and include finalData
        navigate("/Test", { state: { matchData: finalData } });

        // Optional auto PDF download (toggleable)
        if (autoDownloadOnComplete) {
          // small delay to allow the summary route to render in SPA; if you want server-saved PDF, call backend
          setTimeout(() => generatePDF(finalData), 500);
        }
      }
    } catch (err) {
      console.error("Failed to persist end of innings/match:", err?.message || err);
    }
  };

  /* ---------- PDF generation (captures a DOM element) ---------- */
  const generatePDF = async (overrideMatchData = null) => {
    try {
      /*
        We'll render a temporary off-screen node with the summary in case we're calling from this page
        OR if overrideMatchData is passed (finalData) create a small DOM structure on the fly.
      */
      if (overrideMatchData) {
        // Create a temporary container element
        const temp = document.createElement("div");
        temp.style.position = "fixed";
        temp.style.left = "-9999px";
        temp.style.top = "0";
        temp.style.background = "white";
        temp.style.padding = "20px";
        temp.setAttribute("id", "pdf-temp-container");

        // Build minimal HTML for PDF based on overrideMatchData
        temp.innerHTML = buildSummaryHTML(overrideMatchData);
        document.body.appendChild(temp);

        await captureAndSave(temp, `${overrideMatchData.teamAName}_vs_${overrideMatchData.teamBName}_summary.pdf`);

        // cleanup
        document.body.removeChild(temp);
      } else {
        // If there's an element with id 'score-summary' on screen (e.g., match-summary page component),
        // we'll capture that. Otherwise build an inline summary using current state.
        const el = document.getElementById("score-summary");
        if (el) {
          await captureAndSave(el, `${teamAName}_vs_${teamBName}_summary.pdf`);
        } else {
          // build temporary with current state
          const temp = document.createElement("div");
          temp.style.position = "fixed";
          temp.style.left = "-9999px";
          temp.style.top = "0";
          temp.style.background = "white";
          temp.style.padding = "20px";
          temp.setAttribute("id", "pdf-temp-container");
          const currentData = {
            teamAName,
            teamBName,
            tossWonBy,
            tossDecision,
            venueName,
            overs: configuredOvers,
            result: `${currentBattingTeamScore}/${currentWicketCount} (${oversDisplay})`,
            batsmen,
            bowlers,
          };
          temp.innerHTML = buildSummaryHTML(currentData);
          document.body.appendChild(temp);

          await captureAndSave(temp, `${teamAName}_vs_${teamBName}_summary.pdf`);
          document.body.removeChild(temp);
        }
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  const captureAndSave = async (element, filename) => {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  };

  const buildSummaryHTML = (data) => {
    // Return a compact styled HTML string representing the summary (used for temporary PDF capture)
    const { teamAName, teamBName, tossWonBy, tossDecision, venue, overs, result, batsmen = [], bowlers = [] } = data;
    const safeVenue = venue || venueName || "";
    const safeOvers = overs || configuredOvers;

    const batsmenRows = (batsmen || [])
      .map(
        (b) =>
          `<tr>
            <td style="padding:4px;border:1px solid #ddd">${escapeHtml(b.name || "")}</td>
            <td style="padding:4px;border:1px solid #ddd;text-align:center">${b.runs || 0}</td>
            <td style="padding:4px;border:1px solid #ddd;text-align:center">${b.balls || 0}</td>
            <td style="padding:4px;border:1px solid #ddd;text-align:center">${b.fours || 0}</td>
            <td style="padding:4px;border:1px solid #ddd;text-align:center">${b.sixes || 0}</td>
          </tr>`
      )
      .join("");

    const bowlersRows = (bowlers || [])
      .map(
        (b) =>
          `<tr>
            <td style="padding:4px;border:1px solid #ddd">${escapeHtml(b.name || "")}</td>
            <td style="padding:4px;border:1px solid #ddd;text-align:center">${Math.floor((b.balls || 0) / 6)}.${(b.balls || 0) % 6}</td>
            <td style="padding:4px;border:1px solid #ddd;text-align:center">${b.runs || 0}</td>
            <td style="padding:4px;border:1px solid #ddd;text-align:center">${b.wickets || 0}</td>
          </tr>`
      )
      .join("");

    return `
      <div style="font-family: Arial, Helvetica, sans-serif; color:#000; max-width:700px">
        <h2 style="color:#007bff; margin-bottom:6px">Match Summary</h2>
        <h3 style="margin:2px 0">${escapeHtml(teamAName)} vs ${escapeHtml(teamBName)}</h3>
        <p style="margin:2px 0"><strong>Venue:</strong> ${escapeHtml(safeVenue)}</p>
        <p style="margin:2px 0"><strong>Toss:</strong> ${escapeHtml(tossWonBy || "")} chose to ${escapeHtml(tossDecision || "")}</p>
        <p style="margin:2px 0"><strong>Overs:</strong> ${safeOvers}</p>
        <p style="margin:2px 0"><strong>Result:</strong> ${escapeHtml(result || "")}</p>
        <hr />
        <h4 style="margin-bottom:6px">Batting</h4>
        <table style="width:100%; border-collapse:collapse; margin-bottom:12px;">
          <thead>
            <tr>
              <th style="padding:6px;border:1px solid #ddd">Batsman</th>
              <th style="padding:6px;border:1px solid #ddd">Runs</th>
              <th style="padding:6px;border:1px solid #ddd">Balls</th>
              <th style="padding:6px;border:1px solid #ddd">4s</th>
              <th style="padding:6px;border:1px solid #ddd">6s</th>
            </tr>
          </thead>
          <tbody>
            ${batsmenRows}
          </tbody>
        </table>

        <h4 style="margin-bottom:6px">Bowling</h4>
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="padding:6px;border:1px solid #ddd">Bowler</th>
              <th style="padding:6px;border:1px solid #ddd">Overs</th>
              <th style="padding:6px;border:1px solid #ddd">Runs</th>
              <th style="padding:6px;border:1px solid #ddd">Wickets</th>
            </tr>
          </thead>
          <tbody>
            ${bowlersRows}
          </tbody>
        </table>

        <p style="margin-top:14px;font-size:12px;color:#666">Generated by Your Cricket Scoring App</p>
      </div>
    `;
  };

  const escapeHtml = (text) =>
    String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  /* ---------- UI rendering ---------- */
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
      {/* Header */}
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

      {/* Scoreboard */}
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

      {/* Controls */}
      <div className="buttons-grid">
        {[0, 1, 2, 3, 4, 6].map((run) => (
          <button key={run} onClick={() => handleRun(run)} className="run-btn" aria-label={`Add ${run} run`}>
            {run}
          </button>
        ))}

        <button className="wicket" onClick={handleWicket}>
          WICKET
        </button>

        {["nb", "wide", "bye", "lb"].map((type) => (
          <button key={type} onClick={() => handleExtraType(type)} className={`${type}`} aria-label={type.toUpperCase()}>
            {type.toUpperCase()}
          </button>
        ))}

        <button className="undo" onClick={handleUndo}>
          Undo
        </button>
      </div>

      {/* Extras box */}
      {extraType && (
        <div className="extra-run-box">
          <label>
            Runs on {extraType.toUpperCase()}:
            <select value={extraRun} onChange={(e) => setExtraRun(Number(e.target.value))}>
              {[0, 1, 2, 3, 4, 5, 6].map((v) => (
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

      {/* Bowler select */}
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

      {/* Batsman select */}
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

      {/* Ball log */}
      <div className="ball-log" ref={commentaryRef}>
        <h3>Ball-by-ball Log</h3>
        <ul>
          {ballHistory.map((entry, idx) => (
            <li key={idx}>{entry.log}</li>
          ))}
        </ul>
      </div>

      {/* PDF / options */}
      <div style={{ marginTop: 12 }}>
        <label style={{ marginRight: 8 }}>
          <input
            type="checkbox"
            checked={autoDownloadOnComplete}
            onChange={(e) => setAutoDownloadOnComplete(e.target.checked)}
          />{" "}
          Auto-download PDF on match completion
        </label>

        <button style={{ marginLeft: 12 }} onClick={() => generatePDF()}>
          📄 Download Summary PDF
        </button>
      </div>

      {/* Footer notes */}
      <div className="help" style={{ marginTop: 18 }}>
        <details>
          <summary>Notes & Tips</summary>
          <ul>
            <li>At the end of each over a snapshot is saved to the server (if matchId is real).</li>
            <li>When wickets reach 10 or overs complete the inning ends and you are navigated to summary screens.</li>
            <li>PDF generation captures a clean summary snapshot and downloads it.</li>
          </ul>
        </details>
      </div>
    </div>
  );
}
