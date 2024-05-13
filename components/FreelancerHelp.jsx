import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RightSidebar from './RightSidebar';
import Footer from '../components/Footer';
import '../styles/Help.css';
import FreelancerLeftSideBar from './FreelancerLeftSideBar';

const Help = () => {
  const navigate = useNavigate(); // Add the useNavigate hook
  const [username, setUsername] = useState('');

  // Example state for form fields
  const [companyLogo, setCompanyLogo] = useState(null);
  // Define or initialize the variables used as props
  const activeItem = 'help'; // Set the appropriate value for activeItem
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername || '');

        

       
      } catch (error) {
        console.error('Error fetching user invoices:', error);
      }
    };

    fetchData();
  }, []);
  const handleLogout = () => {
    // Add logic to handle logout (e.g., clear authentication state)
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
    navigate('/home');
    window.location.reload();
  };
  return (
    <>
      <div className="help-container">
        <FreelancerLeftSideBar activeItem={activeItem} handleItemClick={navigate} handleLogout={handleLogout} />

        {/* Main Content for Help Page */}
        <div className="help-content">
        {/* Container 1 */}
        <div className="help-sub-container-a">
            <h2>Dashboard</h2>
            <p>Dashboard provides a overview which will help freelancers to understand how to perform the tasks based on their needs.The main section displays personalized greetings and important information regarding what you can do. It tells about various features and services of a freelancer like you can generate invoices and send those invoices to the organization.</p>
        </div>

        {/* Container 2 */}
        <div className="help-sub-container-b">
            <h2>Invoice Generation and Management</h2>
            <p>The "Invoices" component facilitates the generation and management of invoices. It allows users to create new invoices, specify invoice details such as client information, billing items, and amounts. Users can also view a list of issued invoices, track payment status, and mark invoices as paid.</p>
        </div>

        {/* Container 3 */}
        <div className="help-sub-container-c">
            <h2>Send Invoice</h2>
            <p>The "Send Invoice" feature enables users to send generated invoices to clients via email. Upon selecting an invoice to send, the component triggers a popup window where users can compose the email. The popup includes fields for recipient email address, subject, and body of the email. Additionally, users have the option to send a blind carbon copy (BCC) of the invoice to themselves for record-keeping purposes. Upon successful delivery, users receive a notification confirming the email sent.</p>
        </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar username={username} companyLogo={companyLogo} />
      </div>
      <Footer />
    </>
  );
};

export default Help;