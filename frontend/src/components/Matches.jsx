import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/match-details');
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleStartMatch = () => {
    navigate('/teamsetup');
  };

  const handleDeleteMatch = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this match?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/match-details/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMatches(prev => prev.filter(match => match._id !== id));
      } else {
        alert('Failed to delete match');
      }
    } catch (error) {
      alert('Error deleting match');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Live Matches</h2>
      <BackButton />
      <button onClick={handleStartMatch} style={{ marginBottom: '10px' }}>
        Start New Match
      </button>

      {loading ? (
        <p>Loading matches...</p>
      ) : matches.length === 0 ? (
        <p>No live matches found.</p>
      ) : (
        <ul>
          {matches.map((match) => {
            // Assuming match object has these fields, adjust as per your backend data:
            const { _id, teamA, teamB, currentBattingTeamScore, currentWicketCount, ballsCount, overs, status, startTime } = match;

            const oversDisplay = overs
              ? `${Math.floor(ballsCount / 6)}.${ballsCount % 6}`
              : null;

            return (
              <li key={_id} style={{ marginBottom: '10px' }}>
                {teamA} vs {teamB} -{' '}
                {status === 'live' ? (
                  <>
                    {currentBattingTeamScore}/{currentWicketCount} ({oversDisplay} overs)
                  </>
                ) : (
                  `Match starts at ${startTime || 'TBD'}`
                )}
                &nbsp;
                {status === 'live' && (
                  <button onClick={() => handleDeleteMatch(_id)} style={{ marginLeft: '10px', color: 'red' }}>
                    Delete
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Matches;
