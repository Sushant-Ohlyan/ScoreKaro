import React from 'react'

const Login = () => {
  return (
    <div>
        Login
        <form>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
            <button type="button">Register</button>
            <button type="button">Forgot Password</button>
        </form>
    </div>
  )
}

export default Login