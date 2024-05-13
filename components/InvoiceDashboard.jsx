import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerLeftSideBar from './CustomerLeftSideBar';
import '../styles/Invoice.css';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import ReactPaginate from 'react-paginate';
import RightSidebar from './RightSidebar'; 

const InvoiceDashboard = () => {
  const navigate = useNavigate();
  const [userInvoices, setUserInvoices] = useState([]);
  const [username, setUsername] = useState('');
  const [expandedImage, setExpandedImage] = useState(null);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const invoicesPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/search-invoice', {
        username: username,
        invoiceNumber: searchTerm,
      });
  
      if (response.data.invoices && response.data.invoices.length > 0) {
        setUserInvoices([response.data.invoices[0]]);
        setSearchError('');
      } else {
        setUserInvoices([]);
        setSearchError('Invoice not found.');
      }
  
      console.log('Search Result:', response.data);
    } catch (error) {
      console.error('Error searching invoice:', error);
      setSearchError('Error searching for invoice.');
      alert('No invoice found with this number.'); 
    }
  };
  

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');

    if (storedUsername) {
      fetchUserInvoices(storedUsername);
    }

    const storedProfilePic = localStorage.getItem(`profilePic_${storedUsername}`);
    setProfilePic(storedProfilePic || null);
  }, [username]);

  const fetchUserInvoices = (username) => {
    axios
      .get(`http://localhost:5000/api/invoice?username=${username}`)
      .then((response) => {
        setUserInvoices(response.data.invoices);
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

  const activeItem = 'dashboard';

  const toggleStatusBar = async (id) => {
    try {
      const updatedInvoices = [...userInvoices];
      const invoice = updatedInvoices.find((invoice) => invoice.id === id);
      const newPaidStatus = invoice.payment_status === 'Paid' ? 'Not Paid' : 'Paid';

      await axios.put(`http://localhost:5000/api/update-payment-status`, {
        id: id,
        payment_status: newPaidStatus,
      });

      invoice.payment_status = newPaidStatus;
      setUserInvoices(updatedInvoices);

      console.log('Updated Invoices:', updatedInvoices);
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const getCurrentInvoices = () => {
    const startIndex = currentPage * invoicesPerPage;
    const endIndex = startIndex + invoicesPerPage;
    return userInvoices.slice(startIndex, endIndex);
  };

  useEffect(() => {
    // Update filtered invoices whenever user invoices change
    filterInvoices(filterOption);
  }, [userInvoices, filterOption]);
  
  const filterInvoices = (option) => {
    let filtered = userInvoices;
    if (option === 'all') {
      // No filter applied, display all invoices
      setFilteredInvoices(userInvoices);
    } else if (option === 'paid') {
      // Filter by paid invoices
      filtered = userInvoices.filter((invoice) => invoice.payment_status === 'Paid');
      setFilteredInvoices(filtered);
    } else if (option === 'unpaid') {
      // Filter by unpaid invoices
      filtered = userInvoices.filter((invoice) => invoice.payment_status !== 'Paid');
      setFilteredInvoices(filtered);
    } else if (option === 'issuedToday') {
      // Filter by invoices issued today
      const today = new Date().toISOString().slice(0, 10);
      filtered = userInvoices.filter((invoice) => invoice.issue_date === today);
      setFilteredInvoices(filtered);
    } else if (option === 'dueToday') {
      // Filter by invoices due today
      const today = new Date().toISOString().slice(0, 10);
      filtered = userInvoices.filter((invoice) => invoice.due_date === today);
      setFilteredInvoices(filtered);
    }
  };
  
  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };
  
  const handleApplyFilter = () => {
    // Redirect based on the selected filter option
    if (filterOption === 'all') {
      navigate('/invoicedashboard');
    } else if (filterOption === 'paid') {
      navigate('/paidinvoice');
    } else if (filterOption === 'unpaid') {
      navigate('/unpaidinvoice');
    } else if (filterOption === 'issuedToday') {
      // Handle redirection for invoices issued today
      navigate('/issueinvoice');
    } else if (filterOption === 'dueToday') {
      // Handle redirection for invoices due today
      navigate('/dueinvoice');
    }
  };
  

 
  return (
    <>
      <div className="Invoice-dashboard">
        <CustomerLeftSideBar activeItem={activeItem} handleItemClick={navigate} handleLogout={handleLogout} />
        <div>
        <div className="search-bar">
          <div className="search-input-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search Invoice No"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="search-button">
              <button onClick={handleSearch}>Search</button>
          </div>
          </div>
          <div className="filter-options">Invoice Status
          <select className="filter-dropdown" value={filterOption} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="issuedToday">Invoice Issued Today</option>
          <option value="dueToday">Invoice Due Today</option>
          </select>
          
          <button className="apply-button" onClick={handleApplyFilter}>Apply</button>

        </div>
          
        <div className="invoice-container">
          <div className="table">
            <h2>Your Invoices</h2>
            <table>
              <thead>
                <tr>
                  <th>Invoice Id</th>
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
                {getCurrentInvoices().map((invoice, index) => (
                  <tr key={invoice.id}>
                    <td className="table-td">{invoice.id}</td>
                    <td className="table-td">{invoice.invoice_number}</td>
                    <td className="table-td">{invoice.billed_to}</td>
                    <td className="table-td">{invoice.address}</td>
                    <td className="table-td">{invoice.phone}</td>
                    <td className="table-td">{invoice.issue_date}</td>
                    <td className="table-td">{invoice.due_date}</td>
                    <td className="table-td">{invoice.total}</td>
                    <td>
                      <label className="toggle">
                        <input
                          className="toggle-input"
                          type="checkbox"
                          checked={invoice.payment_status === 'Paid'}
                          onChange={() => toggleStatusBar(invoice.id)}
                        />
                        <span className="toggle-label" data-off="Not Paid" data-on="Paid"></span>
                        <span className="toggle-handle"></span>
                      </label>
                    </td>
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

export default InvoiceDashboard;
