import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "../styles/RegisterForm.css";
import RegisterImage from "../assets/images/signup.png";
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import Footer from "./Footer";
import NavBar from "./NavBar";


const RegisterForm = () => {
  const [registrationType, setRegistrationType] = useState("organization");
  const [companyName, setCompanyName] = useState("");
  const [companyEstablishmentDate, setCompanyEstablishmentDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [branchLocation, setBranchLocation] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");  // New field
  const [showUsernameHint, setShowUsernameHint] = useState(false);
  

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerContactNumber, setCustomerContactNumber] = useState("");
  const [customerPassword, setCustomerPassword ] = useState("");
  const [customerConfirmPassword, setCustomerConfirmPassword] = useState("");
  const [customerUsername, setCustomerUsername] = useState("");  // New field
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCustomerUsernameHint, setShowCustomerUsernameHint] = useState(false);

  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);
  const [showCustomerConfirmPassword, setShowCustomerConfirmPassword] = useState(false);


  const [freelancerName, setFreelancerName] = useState("");
  const [freelancerEmail, setFreelancerEmail] = useState("");
  const [freelancerContactNumber, setFreelancerContactNumber] = useState("");
  const [freelancerPassword, setFreelancerPassword] = useState("");
  const [freelancerConfirmPassword, setFreelancerConfirmPassword] = useState("");
  const [freelancerUsername, setFreelancerUsername] = useState("");
  const [showFreelancerUsernameHint, setShowFreelancerUsernameHint] = useState(false);
  const [showFreelancerPassword, setShowFreelancerPassword] = useState(false);
  const [showFreelancerConfirmPassword, setShowFreelancerConfirmPassword] = useState(false);
  const [showFreelancerPasswordHint, setShowFreelancerPasswordHint] = useState(false);

  
  const handlePasswordChange = (event) => {
    const enteredPassword = event.target.value;
    setPassword(enteredPassword);
  
    // Check the password criteria
    const isLowerCase = /[a-z]/.test(enteredPassword);
    const isUpperCase = /[A-Z]/.test(enteredPassword);
    const hasDigit = /\d/.test(enteredPassword);
    const isLengthValid = enteredPassword.length >= 8;
  
    setShowPasswordHint(!(isLowerCase && isUpperCase && hasDigit && isLengthValid));
  };

  const validatePassword = (password) => {
    // Password should have at least one lowercase letter, one uppercase letter,
    // one number, and a minimum length of 8 characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };
  


  const handleUsernameChange = async (event) => {
    const enteredUsername = event.target.value;
    setUsername(enteredUsername);

    // Check if the entered username contains uppercase letters
    setShowUsernameHint(/[A-Z]/.test(enteredUsername));

   // Check username availability
  try {
    const response = await axios.get(`http://localhost:5000/api/checkUsername/${enteredUsername}`);
    const isUsernameAvailable = response.data.isUsernameAvailable;
    setShowUsernameHint(!isUsernameAvailable);
    
    // Provide feedback to the user
    if (!isUsernameAvailable) {
      alert('Username is already taken. Please choose a different one.');
      setUsername("");
    }
  } catch (error) {
    console.error('Error checking username availability:', error);
  }
};

 // Inside handleCustomerUsernameChange function
const handleCustomerUsernameChange = async (event) => {
  const enteredCustomerUsername = event.target.value;
  setCustomerUsername(enteredCustomerUsername);

  // Check if the entered customer username contains uppercase letters
  setShowCustomerUsernameHint(/[A-Z]/.test(enteredCustomerUsername));

  try {
    const response = await axios.get(`http://localhost:5000/api/checkUsername/${enteredCustomerUsername}`);
    const isUsernameAvailable = response.data.isUsernameAvailable;
    setShowCustomerUsernameHint(!isUsernameAvailable);

    // Provide feedback to the user
    if (!isUsernameAvailable) {
      alert('Username is already taken. Please choose a different one.');
      setCustomerUsername("");
    }
  } catch (error) {
    console.error('Error checking customer username availability:', error);
  }
}

  const handleCustomerPasswordChange = (event) => {
    const enteredPassword = event.target.value;
    setCustomerPassword(enteredPassword);

    // Check the password criteria for the customer
    const isLowerCase = /[a-z]/.test(enteredPassword);
    const isUpperCase = /[A-Z]/.test(enteredPassword);
    const hasDigit = /\d/.test(enteredPassword);
    const isLengthValid = enteredPassword.length >= 8;

    setShowPasswordHint(!(isLowerCase && isUpperCase && hasDigit && isLengthValid));
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCustomerConfirmPasswordChange = (event) => {
    setCustomerConfirmPassword(event.target.value);
  };
  
  const handleCustomerTogglePassword = () => {
    setShowCustomerPassword(!showCustomerPassword);
  };
  
  const handleCustomerToggleConfirmPassword = () => {
    setShowCustomerConfirmPassword(!showCustomerConfirmPassword);
  };

  // freelancer

  const handleFreelancerUsernameChange = async (event) => {
    const enteredFreelancerUsername = event.target.value;
    setFreelancerUsername(enteredFreelancerUsername);
  
    // Check if the entered freelancer username contains uppercase letters
    setShowFreelancerUsernameHint(/[A-Z]/.test(enteredFreelancerUsername));
  
    try {
      const response = await axios.get(`http://localhost:5000/api/checkUsername/${enteredFreelancerUsername}`);
      const isUsernameAvailable = response.data.isUsernameAvailable;
      setShowFreelancerUsernameHint(!isUsernameAvailable);
  
      // Provide feedback to the user
      if (!isUsernameAvailable) {
        alert('Username is already taken. Please choose a different one.');
        setFreelancerUsername("");
      }
    } catch (error) {
      console.error('Error checking freelancer username availability:', error);
    }
  };
  
  const handleFreelancerPasswordChange = (event) => {
    const enteredPassword = event.target.value;
    setFreelancerPassword(enteredPassword);
  
    // Check the password criteria for the freelancer
    const isLowerCase = /[a-z]/.test(enteredPassword);
    const isUpperCase = /[A-Z]/.test(enteredPassword);
    const hasDigit = /\d/.test(enteredPassword);
    const isLengthValid = enteredPassword.length >= 8;
  
    setShowFreelancerPasswordHint(!(isLowerCase && isUpperCase && hasDigit && isLengthValid));
  };
  
  const handleFreelancerConfirmPasswordChange = (event) => {
    setFreelancerConfirmPassword(event.target.value);
  };
  
  const handleFreelancerTogglePassword = () => {
    setShowFreelancerPassword(!showFreelancerPassword);
  };
  
  const handleFreelancerToggleConfirmPassword = () => {
    setShowFreelancerConfirmPassword(!showFreelancerConfirmPassword);
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let dataToSend = {
        registrationType,
      };
      
      if (registrationType === 'organization') {

         // Validate the password
      if (!validatePassword(password)) {
        alert('Password does not meet the criteria. Please check the rules.');
        return;
      }
        dataToSend = {
          ...dataToSend,
          companyName,
          companyEstablishmentDate,
          phoneNumber,
          email,
          companyAddress,
          branchLocation,
          password,
          confirmPassword,
          username: username.toLowerCase(),  // Include username here
        };
      } else if (registrationType === 'customer') {

         // Validate the password
         if (!validatePassword(customerPassword)) {
          alert('Password does not meet the criteria. Please check the rules.');
          return;
        }
  
        // Customer-specific fields
        dataToSend = {
          ...dataToSend,
          customerName,
          customerEmail,
          customerContactNumber,
          password: customerPassword,
          confirmPassword: customerConfirmPassword,
          customerUsername: customerUsername.toLowerCase(),  
        };
      }
      else if (registrationType === 'freelancer') {
        // Validate the password
        if (!validatePassword(freelancerPassword)) {
            alert('Password does not meet the criteria. Please check the rules.');
            return;
        }

        // Freelancer-specific fields
        dataToSend = {
            ...dataToSend,
            freelancerName,
            freelancerEmail,
            freelancerContactNumber,
            password: freelancerPassword,
            confirmPassword: freelancerConfirmPassword,
            freelancerUsername: freelancerUsername.toLowerCase(),
        };
    }

      
      const response = await axios.post('http://localhost:5000/register', dataToSend);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert('Registration failed. Please try again.');
    }
  };


  return (
    <>
    <NavBar/>
    <div className="register-page">
    <img src={RegisterImage} alt="Phone" height="600px" width="700px" />
    <div className={`container ${registrationType === 'organization' ? '' : 'taller-form'}`}>
      
      <form onSubmit={handleRegister}>
        <h2>Registration</h2>

        {/* Registration Type Dropdown */}
        <div className="input-box">
          <label htmlFor="registrationtype">Registration Type</label>
          <select
            name="registrationtype"
            value={registrationType}
            onChange={(e) => {
              console.log("Selected value:", e.target.value);
              setRegistrationType(e.target.value);
            }}
            required
          >
            <option value="organization">Organization</option>
            <option value="customer">Customer</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>

        <div className="content">
          {/* Common fields for both organization and customer */}

          {registrationType === "organization" && (
            <>
              <div className="input-box company-name">
                <label htmlFor="companyname">Company Name</label>
                <input
                  type="text"
                  placeholder="Enter your Company name"
                  name="companyname"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="side-by-side">
                <div className="input-box">
                  <label htmlFor="companyestablishmentdate">Establishment Date</label>
                  <input
                    type="date"
                    placeholder="Enter your Company Establishment Date"
                    name="companyestablishmentdate"
                    value={companyEstablishmentDate}
                    onChange={(e) => setCompanyEstablishmentDate(e.target.value)}
                    required
                  />
                </div>
                <div className="input-box">
                  <label htmlFor="phonenumber">Contact Number</label>
                  <input
                    type="tel"
                    placeholder="Enter Contact number"
                    name="phonenumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="input-box">
                <label htmlFor="branchlocation">Branch Location</label>
                <input
                  type="text"
                  placeholder="Enter your branch location"
                  name="branchlocation"
                  value={branchLocation}
                  onChange={(e) => setBranchLocation(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <label htmlFor="email">Company Email Address</label>
                <input
                  type="email"
                  placeholder="Enter valid Company email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <label htmlFor="companyaddress">Company Address</label>
                <input
                  type="text"
                  placeholder="Enter your Company Address"
                  name="companyaddress"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  name="username"
                  value={username}
                  onChange={handleUsernameChange}  // Use the new handler
                  required
                /><p className={`hint ${showUsernameHint ? 'active' : ''}`}>
                  Username should be in lowercase.</p>
                
              </div>
              <div className="input-box">
        <label htmlFor="password">Password</label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
            
          />
            <span
              className="password-toggle-icon"
              onClick={handleTogglePassword}
            >
            {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </span>
        </div>

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

      <div className="input-box">
        <label htmlFor="confirmpassword">Confirm Password</label>
        <div className="password-input-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            name="confirmpassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={handleToggleConfirmPassword}
          >
            {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </span>
        </div>
      </div>
            </>
          )}

          {registrationType === "customer" && (
            <>
              <div className="input-box company-name">
                <label htmlFor="customername">Customer Name</label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  name="customername"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <label htmlFor="customerusername">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  name="customerusername"
                  value={customerUsername}
                  onChange={handleCustomerUsernameChange}  // Use the new handler
                  required
                />
                <p className={`hint ${showCustomerUsernameHint ? 'active' : ''}`}>
                  Username should be in lowercase.</p>
                
              </div>
              <div className="input-box">
                <label htmlFor="customeremail">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your valid email"
                  name="customeremail"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <label htmlFor="customercontactnumber">Contact Number</label>
                <input
                  type="tel"
                  placeholder="Enter contact number"
                  name="customercontactnumber"
                  value={customerContactNumber}
                  onChange={(e) => setCustomerContactNumber(e.target.value)}
                  required
                />
              </div>
              
              <div className="input-box">
        <label htmlFor="password">Password</label>
        <div className="password-input-container">
          <input
            type={showCustomerPassword ? 'text' : 'password'}
            placeholder="Enter password"
            name="customerPassword"
            value={customerPassword}
            onChange={handleCustomerPasswordChange}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={handleCustomerTogglePassword}
          >
            {showCustomerPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
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

      <div className="input-box">
        <label htmlFor="confirmpassword">Confirm Password</label>
        <div className="password-input-container">
          <input
            type={showCustomerConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            name="customerConfirmPassword"
            value={customerConfirmPassword}
            onChange={handleCustomerConfirmPasswordChange}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={handleCustomerToggleConfirmPassword}
          >
            {showCustomerConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </span>
        </div>
      </div>
              
            </>
          )}

{registrationType === "freelancer" && (
    <>
        <div className="input-box company-name">
            <label htmlFor="freelancername">Freelancer Name</label>
            <input
                type="text"
                placeholder="Enter freelancer name"
                name="freelancername"
                value={freelancerName}
                onChange={(e) => setFreelancerName(e.target.value)}
                required
            />
        </div>
        <div className="input-box">
            <label htmlFor="freelancerusername">Username</label>
            <input
                type="text"
                placeholder="Enter your username"
                name="freelancerusername"
                value={freelancerUsername}
                onChange={handleFreelancerUsernameChange}  // Define a new handler
                required
            />
            <p className={`hint ${showFreelancerUsernameHint ? 'active' : ''}`}>
                Username should be in lowercase.</p>
        </div>
        <div className="input-box">
            <label htmlFor="freelanceremail">Email Address</label>
            <input
                type="email"
                placeholder="Enter your valid email"
                name="freelanceremail"
                value={freelancerEmail}
                onChange={(e) => setFreelancerEmail(e.target.value)}
                required
            />
        </div>
        <div className="input-box">
            <label htmlFor="freelancercontactnumber">Contact Number</label>
            <input
                type="tel"
                placeholder="Enter contact number"
                name="freelancercontactnumber"
                value={freelancerContactNumber}
                onChange={(e) => setFreelancerContactNumber(e.target.value)}
                required
            />
        </div>

        <div className="input-box">
            <label htmlFor="freelancerpassword">Password</label>
            <div className="password-input-container">
                <input
                    type={showFreelancerPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    name="freelancerPassword"
                    value={freelancerPassword}
                    onChange={handleFreelancerPasswordChange}
                    required
                />
                <span
                    className="password-toggle-icon"
                    onClick={handleFreelancerTogglePassword}
                >
                    {showFreelancerPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </span>
                {showPasswordHint && (
                    <p className="hint">
                        <h5>Password should:</h5>
                        <ul>
                            <li>Contain at least one lowercase letter</li>
                            <li>Contain at least one uppercase letter</li>
                            <li>Contain at least one digit</li>
                            <li>Have a minimum length of 8 characters</li>
                        </ul>
                    </p>
                )}
            </div>
        </div>

        <div className="input-box">
            <label htmlFor="freelancerconfirmpassword">Confirm Password</label>
            <div className="password-input-container">
                <input
                    type={showFreelancerConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    name="freelancerConfirmPassword"
                    value={freelancerConfirmPassword}
                    onChange={handleFreelancerConfirmPasswordChange}
                    required
                />
                <span
                    className="password-toggle-icon"
                    onClick={handleFreelancerToggleConfirmPassword}
                >
                    {showFreelancerConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </span>
            </div>
        </div>
    </>
)}

        </div>

        <div className="button-container">
          <button type="submit">Register</button>
        </div>
        <p className="text-right">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  </div>
  <Footer />
</>
);
};

export default RegisterForm;
