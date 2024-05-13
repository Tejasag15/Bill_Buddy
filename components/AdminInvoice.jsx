import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import AdminNavbar from "./AdminNavbar";
const AdminInvoice = () => {
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust the number of items per page as needed

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admininvoice');
        setInvoiceDetails(response.data);
      } catch (error) {
        console.error('Error fetching invoice details:', error);
      }
    };

    fetchInvoiceDetails();
  }, []);

  const handleViewInvoice = (invoice) => {
    setExpandedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = invoiceDetails.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((invoiceDetails.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="admin-invoice">
      <AdminNavbar/>
      <h2>Invoice Details</h2>

      <table>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Invoice Number</th>
            <th>Issue Date</th>
            <th>Address</th>
            <th>Billed To</th>
            <th>View Invoice</th>
          </tr>
        </thead>
        <tbody>
          {currentInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.invoice_number}</td>
              <td>{invoice.issue_date}</td>
              <td>{invoice.address}</td>
              <td>{invoice.billed_to}</td>
              <td>
                {invoice.image_data && (
                  <FontAwesomeIcon
                    icon={faEye}
                    className="view-icon"
                    onClick={() => handleViewInvoice(invoice)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {invoiceDetails.length > itemsPerPage && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="View Invoice Modal"
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        <button className="close-modal-button" onClick={handleCloseModal}>
          <i className="fas fa-times"></i>
        </button>
        {expandedInvoice && expandedInvoice.image_data ? (
          <img
            src={`data:image/jpeg;base64,${expandedInvoice.image_data}`}
            alt={`Invoice ${expandedInvoice.invoice_number}`}
            className="modal-image"
          />
        ) : (
          <p>No image available for this invoice.</p>
        )}
      </Modal>
    </div>
  );
};

export default AdminInvoice;
