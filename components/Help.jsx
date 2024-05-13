import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RightSidebar from './RightSidebar';
import CustomerLeftSidebar from './CustomerLeftSideBar';
import Footer from '../components/Footer';
import '../styles/Help.css';

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
        <CustomerLeftSidebar activeItem={activeItem} handleItemClick={navigate} handleLogout={handleLogout} />

        {/* Main Content for Help Page */}
        <div className="help-content">
          {/* Container 1 */}
          <div className="help-sub-container-a">
            <h2>Dashboard</h2>
            <p>The main section displays personalized greetings and important information about your invoices. The 'You have' sections provide a snapshot of your total invoices, both paid and unpaid, along with convenient links to view them. Stay informed about invoices due today and those issued today with dedicated sections, each accompanied by a quick link for more details. We hope this dashboard makes managing your invoices a breeze! If you have any questions or need assistance, feel free to explore the Help section for more information."</p>
          </div>

          {/* Container 2 */}
          <div className="help-sub-container-b">
            <h2>Invoices</h2>
            <p>The "Invoices" component manages client information, allowing the user to send invoices via email. It fetches client data, displays a table of clients with issued invoices, and triggers a popup to compose and send invoices. The popup includes fields for email, subject, and body. Additionally, it provides an option to send a BCC copy. Users can preview attached invoices and receive success notifications upon successful email delivery. The component ensures a seamless experience for managing and communicating invoices with clients.</p>
          </div>

          {/* Container 3 */}
          <div className="help-sub-container-c">
            <h2>Settings</h2>
            <p>The "Settings" component tailored for customer data management in your application provides an intuitive interface for users to upload a logo and input customer details such as name, contact number, and email. Users can easily save or reset their customer data. This component ensures a seamless experience for customers to maintain and update their information, enhancing overall usability.</p>
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