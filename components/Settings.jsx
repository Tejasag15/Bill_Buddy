import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Footer from '../components/Footer';
import axios from 'axios';
import '../styles/Settings.css';
import SettingImage from "../assets/images/settings.jpg";

const Settings = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  // Example state for form fields
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [email, setEmail] = useState('');
  const [branchLocation, setBranchLocation] = useState('');

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
      .post('http://localhost:5000/api/saveSettings', {
        companyLogo,
        companyName,
        companyAddress,
        email,
        branchLocation,
      })
      .then((response) => {
        // Handle success, e.g., show a success message
        console.log('Settings saved successfully:', response.data);
        alert("organization data saved successfully");
      })
      
      .catch((error) => {
        // Handle error, e.g., show an error message
        console.error('Error saving settings:', error);
      });
  };

  const handleReset = () => {
    // Handle reset logic, e.g., reset form fields to the initial state
    setCompanyLogo(null);
    setCompanyName('');
    setCompanyAddress('');
    setEmail('');
    setBranchLocation('');
  };

  return (
    <>
      <div className="settings-container">
        {/* Left Sidebar */}
        <LeftSidebar activeItem={activeItem} handleItemClick={navigate} handleLogout={handleLogout} />

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
            <h2>Organization Data</h2>

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
                <label htmlFor="companyName">
                  <h3>Company Name:</h3>
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="companyAddress">
                  <h3>Company Address:</h3>
                </label>
                <input
                  type="text"
                  id="companyAddress"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email">
                  <h3>Email</h3>
                </label>
                <input
                  type="text"
                  id="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="BranchLocation">
                  <h3>BranchLocation:</h3>
                </label>
                <input
                  type="text"
                  id="BranchLocation"
                  value={branchLocation}
                  onChange={(e) => setBranchLocation(e.target.value)}
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

export default Settings;
