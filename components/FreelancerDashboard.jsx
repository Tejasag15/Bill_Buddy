import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../styles/FreelancerDashboard.css';
import { useNavigate } from 'react-router-dom';
import FreelancerLeftSideBar from './FreelancerLeftSideBar';
import RightSidebar from './RightSidebar';
import Footer from './Footer';

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');
  }, []);

  const activeItem = 'dashboard';

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
    navigate('/home');
    window.location.reload();
  };

  const handleViewProjects = () => {
    navigate('/create-invoice');
  };

  return (
    <>
      <div className="freelancer-dashboard">
        <FreelancerLeftSideBar activeItem={activeItem} handleItemClick={navigate} handleLogout={handleLogout} />

        <div className="freelancer-welcome-box">
          <p style={{ color: 'white' }}>
            <i className="fas fa-user-circle"></i> Welcome, {username}!
          </p>
          <button onClick={handleViewProjects}>
            <i className="fas fa-tasks"></i> Create Invoice
          </button>
        </div>

        <div className="freelancer-features-box">
          
          <h2>Freelancer Features</h2>
          <div className="features-grid">
            <div className="feature">
              <i className="fas fa-tasks"></i>
              <span>View Projects</span>
            </div>
            <div className="feature">
              <i className="fas fa-calendar-alt"></i>
              <span>Manage Deadlines</span>
            </div>
            <div className="feature">
              <i className="fas fa-file-alt"></i>
              <span>Submit Proposals</span>
            </div>
            <div className="feature">
              <i className="fas fa-envelope"></i>
              <span>Communication with Clients</span>
            </div>
          </div>
        </div>

        <RightSidebar username={username} />
        
      </div>
      <Footer />
    </>
  );
};

export default FreelancerDashboard;
