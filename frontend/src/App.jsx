import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Teams from './components/Teams';
import Matches from './components/Matches';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Singup'; 
import Match from './components/Match';
import CreateTeam from './components/CreateTeam';

function App() {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/match" element={<Match />} />
        <Route path="/create-team" element={<CreateTeam />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
