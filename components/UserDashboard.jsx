import React, { useState, useEffect } from 'react';
import '../styles/UserDashboard.css';
import { useNavigate } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Footer from './Footer';

const UserDashboard = () => {
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

  const handleUploadInvoice = () => {
    navigate('/upload-invoice');
  };

  return (
    <>
      <div className="user-dashboard">
        <LeftSidebar activeItem={activeItem} handleItemClick={navigate} handleLogout={handleLogout} />

        <div className="welcome-box">
          <p style={{ color: 'white' }}>
            <i className="fas fa-user-circle"></i> Welcome, {username}!
          </p>
          <button onClick={handleUploadInvoice}>
            <i className="fas fa-upload"></i> Upload Invoice
          </button>
        </div>

        {/* Organization Features box */}
        <div className="organization-features-box">
          <h1>BILL BUDDY SERVICES</h1>
          <h2>Organization Features</h2>
          <div className="features-grid">
            <div className="feature">
              <i className="fas fa-cloud-upload-alt"></i>
              <span>Upload Invoices</span>
            </div>
            <div className="feature">
              <i className="fas fa-envelope"></i>
              <span>Send Invoices via Email</span>
            </div>
            <div className="feature">
              <i className="fas fa-file-invoice"></i>
              <span>Invoice Management</span>
            </div>
            <div className="feature">
              <i className="fas fa-file-invoice"></i>
              <span>Invoice text extraction</span>
            </div>
          </div>
        </div>

        {/* Customer Features box */}
        <div className="customer-features-box">
        <h1>BILL BUDDY SERVICES</h1>
          <h2>Customer Features</h2>
          <div className="features-grid">
            <div className="feature">
              <i className="fas fa-eye"></i>
              <span>View Invoices</span>
            </div>
            <div className="feature">
              <i className="fas fa-calendar-alt"></i>
              <span>Track Invoices by Due Date</span>
            </div>
            <div className="feature">
              <i className="fas fa-calendar-alt"></i>
              <span>Track Invoices by Issue Date</span>
            </div>
            <div className="feature">
              <i className="fas fa-bell"></i>
              <span>Notification of invoices</span>
            </div>
            <div className="feature">
              <i className="fas fa-file-invoice"></i>
              <span>Invoice Management</span>
            </div>
          </div>
        </div>

        <RightSidebar username={username} />
        <Footer />
      </div>
    </>
  );
};

export default UserDashboard;
