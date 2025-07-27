import "../style/Login.css";
import wankhede from '../assets/wankhede bg.jpg';
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";

const Login = () => {
  // ✅ Get the navigate function from useNavigate
  const navigate = useNavigate();

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${wankhede})` }}
    >
      <form className="login-form">
        <h1>
          <img
            src={logo}
            alt="Background example"
            style={{ width: "28px", borderRadius: "8px" }}
          />
          ScoreKaro
        </h1>
        <h2>Login</h2>
        
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign In</button>

        {/* ✅ Button to navigate to signup */}
        <button
          type="button"
          onClick={() => navigate("/signup")}
         
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Login;

