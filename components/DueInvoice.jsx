import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerLeftSideBar from './CustomerLeftSideBar';
import '../styles/Invoice.css';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import RightSidebar from './RightSidebar'; 
import ReactPaginate from 'react-paginate';
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date.toLocaleDateString(undefined, options);
};
const activeItem='dueinvoice';

const DueInvoice = () => {
  const navigate = useNavigate();
  const [userInvoices, setUserInvoices] = useState([]);
  const [username, setUsername] = useState('');
  const [expandedImage, setExpandedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const Logo = 'path-to-your-logo'; // Replace with the actual path or import statement for your logo image
  const [currentPage, setCurrentPage] = useState(0);
  const invoicesPerPage = 10;
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');

    if (storedUsername) {
      fetchUserInvoices(storedUsername);
    }
    const storedProfilePic = localStorage.getItem(`profilePic_${username}`);
    setProfilePic(storedProfilePic || null);
  }, [username]);

  const fetchUserInvoices = (username) => {
    axios.get(`http://localhost:5000/api/invoice?username=${username}`)
      .then(response => {
        setUserInvoices(response.data.invoices);
      })
      .catch(error => {
        console.error('Error fetching user invoices:', error);
      });
  };

  const todayInvoices = userInvoices.filter((invoice) => {
    const formattedIssueDate = formatDate(invoice.due_date);
    const formattedToday = formatDate(new Date().toISOString());

    return formattedIssueDate === formattedToday;
  });

  const handleViewImage = (invoice) => {
    setExpandedImage(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const activeItem = 'dashboard';

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
    navigate('/home');
  };
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <div className="Invoice-dashboard">
      <CustomerLeftSideBar activeItem={activeItem} handleItemClick={navigate} handleLogout={handleLogout} />
      
      
        
           
        {todayInvoices.length > 0 ? (
          <div>
          <div className="invoice-container">
          <div className="table">
            <h2>Your Invoices</h2>
            <table>
              <thead>
              <tr>
                    <th>Invoice Number</th>
                    <th>Billed To</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Total</th>
                    <th>Payment status</th>
                    <th>Image</th>
                  </tr>
              </thead>
              <tbody>
                {todayInvoices.map((invoice, index) => (
                  <tr key={index}>
                    <td>{invoice.invoice_number}</td>
                      <td>{invoice.billed_to}</td>
                      <td>{invoice.address}</td>
                      <td>{invoice.phone}</td>
                      <td>{invoice.issue_date}</td>
                      <td>{invoice.due_date}</td>
                      <td>{invoice.total}</td>
                      <td>{invoice.payment_status}</td>
                      <td>
                        {invoice.image_data && (
                          <div className="image-cell">
                            <span className="view-icon" onClick={() => handleViewImage(invoice)}>
                              <i className="fas fa-eye"></i> View
                            </span>
                          </div>
                        )}
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              pageCount={Math.ceil(userInvoices.length / invoicesPerPage)}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </div>
          </div>
          </div>
        ) : (
          <div className="no-invoice-message">
            <p>No invoices issued today.</p>
          </div>
        )}
       <RightSidebar username={username} />
      </div>

      <Footer />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="View Image Modal"
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        <button className="close-modal-button" onClick={handleCloseModal}>
          <i className="fas fa-times"></i>
        </button>
        {expandedImage && (
          <img
            src={`data:image/jpeg;base64,${expandedImage.image_data}`}
            alt={`Invoice ${expandedImage.invoice_number}`}
            className="modal-image"
          />
        )}
      </Modal>
    </>
  );
};

export default DueInvoice;
