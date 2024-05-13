import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FreelancerLeftSideBar from './FreelancerLeftSideBar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import ReactPaginate from 'react-paginate';
import RightSidebar from './RightSidebar'; 
import '../styles/Invoice_dashboard.css';

const ViewInvoice = () => {
  const navigate = useNavigate();
  const [userInvoices, setUserInvoices] = useState([]);
  const [username, setUsername] = useState('');
  const [expandedImage, setExpandedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const invoicesPerPage = 3;

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');

    if (storedUsername) {
      fetchUserInvoices(storedUsername);
    }
  }, []);

  useEffect(() => {
    console.log('User Invoices:', userInvoices);
  }, [userInvoices]);

  const fetchUserInvoices = (username) => {
    axios.get(`http://localhost:5000/api/invoice_generator?username=${username}`)
      .then((response) => {
        setUserInvoices(response.data.invoices || []); 
      })
      .catch((error) => {
        console.error('Error fetching user invoices:', error);
      });
  };

  const handleViewImage = (invoice) => {
    setExpandedImage(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
    navigate('/home');
    window.location.reload();
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const getCurrentInvoices = () => {
    const startIndex = currentPage * invoicesPerPage;
    const endIndex = startIndex + invoicesPerPage;
    return userInvoices.slice(startIndex, endIndex);
  };

  return (
    <>
      <div className="Invoice-dashboard">
        <FreelancerLeftSideBar activeItem="viewInvoice" handleItemClick={navigate} handleLogout={handleLogout} />
      <div>
        <div className="invoice-container1">
          <h2>Your Invoices</h2>
          <table>
            <thead>
              <tr>
                <th className="table-th">Invoice Id</th>
                <th className="table-th">Invoice Number</th>
                <th className="table-th">Client Name</th>
                <th className="table-th">Client Address</th>
                <th className="table-th">Client Phone</th>
                <th className="table-th">Client Email</th>
                <th className="table-th">Client Country</th>
                <th className="table-th">Issue Date</th>
                <th className="table-th">Due Date</th>
                <th className="table-th">Payment method</th>
                <th className="table-th">Items Issued</th>
                <th className="table-th">Total</th>
                
              </tr>
            </thead>
            <tbody>
              {getCurrentInvoices().map((invoice, index) => (
                <tr key={invoice.id}>
                  <td className="table-td">{invoice.id}</td>
                  <td className="table-td">{invoice.invoice_number}</td>
                  <td className="table-td">{invoice.client_name}</td>
                  <td className="table-td">{invoice.client_address}</td>
                  <td className="table-td">{invoice.client_phone}</td>
                  <td className="table-td">{invoice.client_email}</td>
                  <td className="table-td">{invoice.country}</td>
                  <td className="table-td">{invoice.issue_date}</td>
                  <td className="table-td">{invoice.due_date}</td>
                  <td className="table-td">{invoice.payment_method}</td>
                  <td className="table-td">{invoice.item}</td>
                  <td className="table-td">{invoice.total}</td>
                  
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
        <RightSidebar username={username} />
      </div>

      <Footer />
      
      
    </>
  );
};

export default ViewInvoice;
