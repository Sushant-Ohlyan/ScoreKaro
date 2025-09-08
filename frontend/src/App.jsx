import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Teams from './components/TeamsManage';
import Matches from './components/Matches';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Singup'; 
import Match from './components/Match';
import CreateTeam from './components/CreateTeam';
import InningSummary from './components/InningSummary';
import Scorecard from './components/Scorecard';
import Test3 from './components/Test3';
import Test4 from './components/Test4';
import Test5 from './components/Test5';
import Test from './components/Test';
import Temp from './components/Temp';
import Matchsetup from './components/Matchsetup';
import Teamsetup from './components/Teamsetup';
import './style/App.css';
import TeamsManage from './components/TeamsManage';
import TeamAdd from './components/TeamAdd';

function App() {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/matchsetup" element={<Matchsetup />} />
        <Route path="/teamsetup" element={<Teamsetup />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/teams" element={<TeamsManage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/match" element={<Match />} />
        <Route path="/inning-summary" element={<InningSummary />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/scorecard" element={<Scorecard />} />
        <Route path="/test" element={<Test />} />
        <Route path="/temp" element={<Temp />} />
        <Route path="/test3" element={<Test3 />} />
        <Route path="/test4" element={<Test4 />} />
        <Route path="/test5" element={<Test5 />} />
        <Route path="/teamadd" element={<TeamAdd />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
