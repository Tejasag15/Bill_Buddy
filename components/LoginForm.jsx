import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PersonCircle, LockFill, Eye, EyeSlash } from 'react-bootstrap-icons';
import axios from 'axios';
import '../styles/LoginForm.css';
import LoginImage from '../assets/images/login.png';
import NavBar from './NavBar';
import Footer from './Footer';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);  // State to manage password visibility
  const navigate = useNavigate();
  
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };


  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      alert(response.data.message);

      const userType = response.data.userType;

      localStorage.setItem('username', username);
      localStorage.setItem('authenticated', 'true');

      if (userType === 'organization') {
        navigate('/dashboard');
      } else if (userType === 'customer') {
        navigate('/customerdashboard');
      } else if (userType === 'freelancer') {
        navigate('/freelancerdashboard');
      } else if (username === 'admin' && password === 'pass') {
        navigate('/admin-dashboard');
      } else {
        alert('Invalid user type or credentials. Please contact support.');
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Invalid username or password. Please try again.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="login-page">
        <img src={LoginImage} alt="Phone" height="600px" width="700px" />
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label htmlFor="username" className="label-icon">
                <PersonCircle size={20} />
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>

            <div className="input-box">
  <label htmlFor="password" className="label-icon">
    <LockFill size={20} />
    Password:
  </label>
  <div className="password-input-container">
    <input
      type={showPassword ? 'text' : 'password'}
      id="password"
      value={password}
      onChange={handlePasswordChange}
    />
    <span
      className="password-toggle-icon"
      onClick={handleTogglePassword}
    >
      {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
    </span>
   
  </div>
</div>

            <div className="button-container">
              <button type="submit">Login</button>
            </div>

            <p className="text-right">
              <Link to="/forgot-password">
                <span>Forgot Password?</span><br></br>
              </Link>{' '}
              <Link to="/register">New user?Click here to Register</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LoginForm;
