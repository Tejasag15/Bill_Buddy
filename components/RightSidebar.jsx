import React, { useState, useEffect } from 'react';
import '../styles/RightSidebar.css';
import Logo from '../assets/images/avatar.jpg';

const RightSidebar = ({ username, companyLogo }) => {
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    // Fetch the profile picture from local storage and set it in state
    const storedProfilePic = localStorage.getItem(`profilePic_${username}`);
    setProfilePic(storedProfilePic || null);
  }, [username]);

  // Listen for changes in companyLogo and update the profile picture
  useEffect(() => {
    if (companyLogo) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // Update the profile picture in local storage
        localStorage.setItem(`profilePic_${username}`, reader.result);
        setProfilePic(reader.result);
      };

      reader.readAsDataURL(companyLogo);
    }
  }, [companyLogo, username]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // Update the profile picture in local storage
        localStorage.setItem(`profilePic_${username}`, reader.result);
        setProfilePic(reader.result);
        document.dispatchEvent(new CustomEvent('updateProfilePic', { detail: { profilePic: reader.result } }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    document.getElementById('profile-pic-input').click();
  };

  return (
    <div className="right-sidebar">
      <div className="profile-info">
        <div className="avatar" onClick={handleClick}>
          <label htmlFor="profile-pic-input">
            <img src={profilePic || Logo} alt="" />
          </label>
          <input
            type="file"
            id="profile-pic-input"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
        <p className="username">{username}</p>
      </div>
      {/* Add other content or options here */}
    </div>
  );
};

export default RightSidebar;
