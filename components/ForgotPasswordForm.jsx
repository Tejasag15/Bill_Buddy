import React, { useState } from 'react';
import axios from 'axios';
import LoginImage from '../assets/images/login.png';
import '../styles/ForgotPasswordForm.css';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

function ForgotPasswordForm() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    // Password should have at least one lowercase letter, one uppercase letter,
    // one number, and a minimum length of 8 characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

 
  const  handleNewPasswordChange = (event) => {
    const enteredPassword = event.target.value;
    setNewPassword(enteredPassword);
  
    // Check the password criteria
    const isLowerCase = /[a-z]/.test(enteredPassword);
    const isUpperCase = /[A-Z]/.test(enteredPassword);
    const hasDigit = /\d/.test(enteredPassword);
    const isLengthValid = enteredPassword.length >= 8;
  
    setShowPasswordHint(!(isLowerCase && isUpperCase && hasDigit && isLengthValid));
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Validate the new password
      if (!validatePassword(newPassword)) {
          alert('New password does not meet the criteria. Please check the rules.');
          return;
      }
  
      // Make a single request with both user types
      const response = await axios.post('http://localhost:5000/forgot-password', {
          username,
          newPassword,
          confirmPassword,
          userTypes: ['organization', 'customer'], // Provide an array of user types
      });
  
      // Handle the response
      console.log('Server response:', response.data.message);
      // You can add more logic as needed
  
      // Assuming you want to navigate to "/login" after a successful request
      navigate("/login");
  } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
  }
  
};

  const handleCancel = () => {
    // Navigate back to the login form
    navigate('/login');
  };

  return (
    <div className="forgot-password-page">
      <img src={LoginImage} alt="Phone" height="600px" width="700px" style={{ marginLeft: '70px' }} />
      <div className="forgot-password-form">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={handleUsernameChange} />
          </div>
          <div className="input-box">
        <label htmlFor="newPassword">New Password:</label>
        <div className="password-input-container">
          <input
            type={showNewPassword ? 'text' : 'password'}
            id="newPassword"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          <span
            className="password-toggle-icon"
            onClick={handleToggleNewPassword}
          >
            {showNewPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </span>
        </div>
      </div>

      <div className="input-box">
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <div className="password-input-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <span
            className="password-toggle-icon"
            onClick={handleToggleConfirmPassword}
          >
            {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </span>
          {showPasswordHint && (
    <p className="hint">
     <h5> Password should:</h5>
      <ul>
         Contain at least one lowercase letter,
        Contain at least one uppercase letter,
        Contain at least one digit,
        Have a minimum length of 8 characters
      </ul>
    </p>
      )}
        </div>
      </div>

          <div className="button-container1">
            <button type="submit">Set New Password</button>
          </div>
          <div className="button-container2">
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
