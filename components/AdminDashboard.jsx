import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css'; // Import your custom styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faStar, faEnvelope, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import Footer from "./Footer";
import AdminNavbar from "./AdminNavbar";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const navigateToUserRegistration = () => {
    navigate('/user-registration'); // Update with the actual path of your UserRegistration component
  };
  const navigateToContactInfo = () => {
    navigate('/contact-information'); // Update with the actual path of your UserRegistration component
  };
  const navigateToAdminInvoice = () => {
    navigate('/admin-invoice'); // Update with the actual path of your UserRegistration component
  };
  const navigateToAdminReviews = () => {
    navigate('/admin-reviews'); // Update with the actual path of your UserRegistration component
  };

  return (
    <>
    <AdminNavbar/>
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="card-row">
        {/* User Details */}
        <div className="dashboard-card user-card" onClick={navigateToUserRegistration}>
          <FontAwesomeIcon icon={faUsers} size="3x" />
          <div className="card-title">User Details</div>
        </div>

        {/* Reviews */}
        <div className="dashboard-card review-card" onClick={navigateToAdminReviews}>
          <FontAwesomeIcon icon={faStar} size="3x" />
          <div className="card-title">Reviews</div>
        </div>
      </div>

      <div className="card-row">
        {/* Contact Us Messages */}
        <div className="dashboard-card contact-card" onClick={navigateToContactInfo}>
          <FontAwesomeIcon icon={faEnvelope} size="3x" />
          <div className="card-title">Contact Us Messages</div>
        </div>

        {/* Invoice Processed */}
        <div className="dashboard-card invoice-card" onClick={navigateToAdminInvoice}>
          <FontAwesomeIcon icon={faFileInvoice} size="3x" />
          <div className="card-title">Invoices</div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default AdminDashboard;
