import React from 'react';
import { useNavigate } from 'react-router-dom';

const TeamsManage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '20px' }}>  
    <button onClick={() => navigate('/teamsetup')}>Create New Team</button>
    </div>
  );
};

export default TeamsManage;

// retrieve all teams from db
// add the component to create new teams
// add functionality to delete teams
// add functionality to edit team details like name, logo, etc.
// add functionality to view team details