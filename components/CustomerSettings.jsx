import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLeftSidebar from './CustomerLeftSideBar';
import RightSidebar from './RightSidebar';
import Footer from '../components/Footer';
import axios from 'axios';
import '../styles/CustomerSettings.css';
import SettingImage from "../assets/images/settings.jpg";

const CustomerSettings = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  // Example state for form fields
  const [companyLogo, setCompanyLogo] = useState(null);
  const [customerUsername, setCustomerUsername] = useState('');
  const [customerContactNumber, setCustomerContactNumber] = useState('');
  const [customeremail, setCustomerEmail] = useState('');
  const [showCustomerUsernameHint, setShowCustomerUsernameHint] = useState(false);
  useEffect(() => {
    // Fetch the username from local storage and set it in state
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');
  }, []);

  const activeItem = 'settings';

  const handleLogout = () => {
    // Add logic to handle logout (e.g., clear authentication state)
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
    navigate('/home');
    window.location.reload();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Handle logo change logic
      setCompanyLogo(file);
    }
  };

  const handleSave = () => {
    // Handle save logic, e.g., send data to the server using axios
    axios
      .post('http://localhost:5000/api/saveCustomerSettings', {
        customerUsername,
        customerContactNumber,
        customeremail,
      })
      .then((response) => {
        // Handle success, e.g., show a success message
        console.log('Customer settings saved successfully:', response.data);
        alert("Customer data saved successfully");
        localStorage.setItem('username', customerUsername);
        const oldProfilePic = localStorage.getItem(`profilePic_${username}`);
      if (oldProfilePic) {
        localStorage.setItem(`profilePic_${customerUsername}`, oldProfilePic);
        localStorage.removeItem(`profilePic_${username}`);
      }
      window.location.reload();
    })
      
      .catch((error) => {
        // Handle error, e.g., show an error message
        console.error('Error saving customer settings:', error);
      });
  };
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
  
  

  const handleReset = () => {
    // Handle reset logic, e.g., reset form fields to the initial state
    setCompanyLogo(null);
    setCustomerUsername('');
    setCustomerContactNumber('');
    setCustomerEmail('');
  };

  return (
    <>
      <div className="settings-container">
        {/* Left Sidebar */}
        <CustomerLeftSidebar activeItem={activeItem} handleItemClick={navigate} handleLogout={handleLogout} />

        {/* Main Content for Settings Page */}
        <div className="settings-cont">
          <img src={SettingImage} alt="personal data" style={{
            borderRadius: '2px', // Adjust border-radius as needed
            height: '600px',
            width: '450px',
            objectFit: 'cover',
            marginLeft: '60px',
            marginTop: '60px',
          }} />
          <div className="settings-content">
            <h2>Customer Data</h2>

            {/* Form for Personal Data */}
            <form>
              <div className="logoip">
                <label htmlFor="logoInput">
                  <h3>Upload Logo:</h3>
                </label>
                <input type="file" id="logoInput" accept="image/*" onChange={handleLogoChange} />
              </div>
               <div className="dash">
               
              </div>
              
            <p>
              <div>
                <label htmlFor="customerUsername">
                  <h3>Customer UserName:</h3>
                </label>
                <input
                  type="text"
                  id="customerUsername"
                  value={customerUsername}
                  onChange={handleCustomerUsernameChange}
                />
              </div>

              <div>
                <label htmlFor="customerContactNumber">
                  <h3>Contact Number:</h3>
                </label>
                <input
                  type="text"
                  id="customerContactNumber"
                  value={customerContactNumber}
                  onChange={(e) => setCustomerContactNumber(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email">
                  <h3>Customer Email</h3>
                </label>
                <input
                  type="text"
                  id="customerEmail"
                  value={customeremail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              
            </p>
              <div className="sr-btn">
                <button type="button" onClick={handleSave}>
                  Save
                </button>
              </div>
              <div className="rs-btn">
                <button type="button" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar */}
          <RightSidebar username={username} companyLogo={companyLogo} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CustomerSettings;