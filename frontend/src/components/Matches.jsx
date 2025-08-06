import React, { useEffect, useState } from 'react';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/match-details');
        if (!response.ok) throw new Error('Failed to fetch matches');
        const data = await response.json();
        setMatches(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Past Matches</h2>
      {loading ? (
        <p>Loading...</p>
      ) : matches.length === 0 ? (
        <p>No past matches found.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {matches.map(match => (
            <div
              key={match._id}
              style={{
                background: '#f4f4f4',
                borderRadius: '8px',
                padding: '18px 20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                minWidth: '260px'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
                {match.teamAName} vs {match.teamBName}
              </div>
              <div>
                <b>{match.teamAName}:</b> {match.teamAScore !== undefined ? match.teamAScore : 'N/A'}
              </div>
              <div>
                <b>{match.teamBName}:</b> {match.teamBScore !== undefined ? match.teamBScore : 'N/A'}
              </div>
              <div style={{ marginTop: 10 }}>
                <span style={{ fontWeight: 500, color: '#177d44' }}>
                  Winner: {match.winnerName || 'N/A'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
