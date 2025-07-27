import React from "react";
import '../style/Login.css' 
import wankhede from '../assets/wankhede bg.jpg';
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
  return (
    <div className="login-page"
      style={{ backgroundImage: `url(${wankhede})` }}>
           
      <form className="login-form">
        
        <h1>  <img src={logo} alt="Background example" style={{ width: "28px", borderRadius: "8px" }} />ScoreKaro</h1>
        <h2>Login</h2>
        <input type="text" placeholder="Name" required />
        <input type="email" placeholder="Email" required />
        <input type="Password" placeholder="Password" value ="" required />
        <input type="Password" placeholder="Confirm Password"  value ="" required />
        <button type="submit">Sign In</button>
        <button type="button"  onClick={() => navigate("/")}>Existing user LogIn </button>
      </form>
    </div>
  );
};

export default Signup;