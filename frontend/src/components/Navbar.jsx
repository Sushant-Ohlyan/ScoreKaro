import { Link } from 'react-router-dom'
import '../style/Navbar.css' // ✅ Import the CSS file
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">
        <span className="logo-icon">🏏</span> SCOREKARO
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/matches" className="nav-link">Matches</Link>
        <Link to="/teams" className="nav-link">Teams</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>
      <ThemeToggle />
    </nav>
  )
}

export default Navbar
