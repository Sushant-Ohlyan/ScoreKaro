import React from 'react';
import '../style/Home.css'; // Make sure to create this CSS file
import a from '../assets/a.png';
import Navbar from './Navbar'; // Assuming you have a Navbar component
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
    
    <div className="home-container">
      <div className="home-content">
        <img src={a} alt="Cricket Player" className="home-image" />
        <div className="home-text">
          <h1 className="home-heading">Let's Bring Your Match to Life!</h1>
          <button className="start-button" onClick={() => navigate("/teamsetup")}>Start Match</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
