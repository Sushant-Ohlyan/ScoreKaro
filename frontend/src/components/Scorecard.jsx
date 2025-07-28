import React, { useEffect, useState } from "react";
import axios from "axios";

const Scorecard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/match/scorecard")
      .then(res => setPlayers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="scorecard">
      <h2>Full Scorecard</h2>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Runs</th>
            <th>Balls</th>
            <th>Strike Rate</th>
            <th>Wickets</th>
            <th>Catches</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, index) => (
            <tr key={index}>
              <td>{p.name}</td>
              <td>{p.runs}</td>
              <td>{p.balls}</td>
              <td>{p.strikeRate}</td>
              <td>{p.wickets}</td>
              <td>{p.catches}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scorecard;