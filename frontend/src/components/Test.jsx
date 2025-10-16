// src/components/MatchSummary.jsx
import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function MatchSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const summaryRef = useRef(null);

  const matchData = location.state;

  if (!matchData) {
    navigate("/"); // redirect if accessed directly
    return null;
  }

  const {
    teamAName,
    teamBName,
    venueName,
    overs,
    totalInnings,
    inningsData = [], // array of innings objects
    finalScore,
    totalWickets,
    totalOvers,
  } = matchData;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${teamAName} vs ${teamBName}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Venue: ${venueName}`, 14, 28);
    doc.text(`Overs: ${overs}`, 14, 36);

    inningsData.forEach((inning, index) => {
      const yStart = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 44;

      doc.text(
        `Innings ${index + 1}: ${inning.battingTeam} - ${inning.score}/${inning.wickets} (${inning.overs})`,
        14,
        yStart
      );

      // Batsmen Table
      autoTable(doc, {
        startY: yStart + 6,
        head: [["Batsman", "Runs", "Balls", "4s", "6s", "Out"]],
        body: inning.batsmen.map((b) => [
          b.name,
          b.runs,
          b.balls,
          b.fours,
          b.sixes,
          b.out ? b.howOut : "Not Out",
        ]),
      });

      const lastY = doc.lastAutoTable.finalY + 6;

      // Bowlers Table
      autoTable(doc, {
        startY: lastY,
        head: [["Bowler", "Overs", "Runs", "Wickets", "Maidens"]],
        body: inning.bowlers.map((b) => [
          b.name,
          `${Math.floor(b.balls / 6)}.${b.balls % 6}`,
          b.runs,
          b.wickets,
          b.maidens || 0,
        ]),
      });
    });

    doc.save(`Match_${teamAName}_vs_${teamBName}.pdf`);
  };

  return (
    <div className="match-summary-container" style={{ padding: "20px" }}>
      <h2>Match Summary</h2>
      <p>
        <strong>{teamAName} vs {teamBName}</strong>
      </p>
      <p>Venue: {venueName}</p>
      <p>Overs per innings: {overs}</p>

      {inningsData.map((inning, idx) => (
        <div key={idx} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>Innings {idx + 1}: {inning.battingTeam}</h3>
          <p>Score: {inning.score}/{inning.wickets} ({inning.overs})</p>

          <h4>Batting</h4>
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
              {inning.batsmen.map((b, idx) => (
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

          <h4 style={{ marginTop: "12px" }}>Bowling</h4>
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
              {inning.bowlers.map((b, idx) => (
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
      ))}

      <button onClick={downloadPDF} style={{ marginTop: "12px" }}>
        Download Match PDF
      </button>
    </div>
  );
}
