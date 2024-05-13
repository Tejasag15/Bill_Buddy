import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import '../styles/Invoices.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import successImage from '../assets/images/Confirmed-bro.png';

const Invoices = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [clientData, setClientData] = useState([]);
  const [isSendInvoicePopupOpen, setIsSendInvoicePopupOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [invoices, setInvoices] = useState('');
  const [body, setBody] = useState('');
  const [sendBccCopy, setSendBccCopy] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [imageDataArray, setImageDataArray] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null); 
  const [previewEnabled, setPreviewEnabled] = useState(false);// Track the selected invoice for preview
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil((clientData.length || 0) / itemsPerPage);

  const handleTogglePreview = () => {
    setPreviewEnabled(!previewEnabled);
  };

  const handleDeleteInvoice = (clientName, issueDate) => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this invoice?');
  
    if (isConfirmed) {
      // User clicked "OK" in the confirmation dialog
      deleteInvoice(clientName, issueDate);
    } else {
      // User clicked "Cancel" in the confirmation dialog
      console.log('Deletion canceled');
    }
  };
  
  const deleteInvoice = async (clientName, issueDate) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete-invoice/${clientName}/${issueDate}`);
      if (response.status === 200) {
        // Update the client data after deletion
        fetchClientData();
        console.log('Invoice deleted successfully');
        alert("Invoiced Deleted Successsfully");
      } else {
        console.error('Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };
  
  const fetchClientData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/invoices');
      const responseData = response.data;
      setClientData(responseData);
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');
    fetchClientData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
    navigate('/home');
    window.location.reload();
  };

  const handleSendInvoiceClick = async (clientName, issueDate) => {
    try {
      const response = await axios.post('http://localhost:5000/get-client-invoices', {
        clientName,
        issueDate,
      });

      if (response.status === 200) {
        const { email, invoices, invoiceCount } = response.data;

        setEmail(email);
        setSubject(`${invoiceCount} Invoices Issued`);
        setInvoices(invoices);

        const invoiceNumbers = invoices.map((invoice) => invoice.invoiceNumber).join(',');

        setBody(
          `Hi ${clientName},\n\n${invoiceCount} invoices have been issued.` +
          `\n\nThank you for the business.` +
          `\n\nAttached are your invoices: ${invoiceNumbers}`
        );

        // Populate imageDataArray using a Promise to wait for asynchronous operations
        const imageDataArray = await Promise.all(
          invoices.map(async (invoice) => {
            try {
              const imageResponse = await axios.get(
                `http://localhost:5000/api/invoices/${invoice.invoiceNumber}`
              );

              // Check if the response contains the expected properties
              if (imageResponse.data && imageResponse.data.image_data) {
                return {
                  invoiceNumber: invoice.invoiceNumber,
                  imageData: imageResponse.data.image_data,
                };
              } else {
                // Handle the case where invoice data is not found
                throw new Error('Invoice data not found');
              }
            } catch (error) {
              console.error(
                `Error fetching image data for invoice ${invoice.invoiceNumber}:`,
                error
              );
              alert(
                `Error fetching image data for invoice ${invoice.invoiceNumber}: ${error.message}`
              );
              // Handle the error as needed
              throw error;
            }
          })
        );

        // Set the imageDataArray state
        setImageDataArray(imageDataArray);

        // Open the send invoice popup
        setIsSendInvoicePopupOpen(true);

        // Select the first invoice for preview by default
        if (imageDataArray.length > 0) {
          setSelectedInvoice(imageDataArray[0]);
        }
      } else {
        console.error('Failed to fetch client invoices');
      }
    } catch (error) {
      console.error('Error fetching client invoices:', error);
    }
  };

  const handleSendInvoice = async () => {
    try {
      console.log('Image Data Array:', imageDataArray);

      // Create an array to store attachments
      const attachments = imageDataArray.map((data) => ({
        filename: `invoice_${data.invoiceNumber}.png`,
        content: data.imageData, // Assuming image data is base64 encoded
        encoding: 'base64',
      }));

      const bccRecipients = [];

      // Add the sender's email to BCC if the checkbox is checked
      if (sendBccCopy) {
        bccRecipients.push({ address: 'billbuddy002@gmail.com' }); // Replace with the actual sender's email
      }

      const postData = {
        email,
        subject,
        body,
        attachments,
        bcc: bccRecipients,
      };

      // Make sure this data is sent in your axios.post request
      const response = await axios.post('http://localhost:5000/send-email', postData);

      if (response.status === 200) {
        console.log('Email sent successfully');
        setIsSendInvoicePopupOpen(false);
        setSendSuccess(true);
      } else {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleOkButtonClick = () => {
    setSendSuccess(false);
  };

  const handlePreviewInvoice = (invoiceNumber) => {
    const selectedInvoiceData = invoices.find(
      (invoice) => invoice.invoiceNumber === invoiceNumber
    );
    setSelectedInvoice(selectedInvoiceData);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <>
      <div className={`user-dashboard ${isSendInvoicePopupOpen ? 'popup-open' : ''}`}>
        <LeftSidebar activeItem="invoices" handleItemClick={navigate} handleLogout={handleLogout} />

        <RightSidebar username={username} />

        {/* Client Information Table */}
        <div className="client-box">
          <h2>Client Information</h2>
          <table className="client-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Issue Date</th>
                <th>No Of Invoices Issued</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* {clientData.map((client, index) => ( */}
              {/* {clientData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((client, index) => ( */}
              {clientData
              .filter((client) => client.username === localStorage.getItem('username'))
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((client, index) => (
                <tr key={index}>
                  <td>{client.billed_to}</td>
                  <td>{client.issue_date}</td>
                  <td>{client.invoice_count}</td>
                  <td>
                    <button
                      className="send-invoice-button"
                      onClick={() => handleSendInvoiceClick(client.billed_to, client.issue_date)}
                    >
                      <i className="fas fa-envelope"></i> Send Invoice
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteInvoice(client.billed_to, client.issue_date)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          {clientData.length > itemsPerPage && (
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
        </div>

        {isSendInvoicePopupOpen && (
          <div className="send-invoice-container">
            <div className="send-invoice-content">
              <span className="close-popup" onClick={() => setIsSendInvoicePopupOpen(false)}>
                &times;
              </span>
              <h2>Send Invoice</h2>
              <div className="form-group">
                <label>Email:</label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Subject:</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="form-group" >
                <label>Body:</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)}/>
              </div>
             

         {/* Invoice Preview Section */}
         <div className="form-group">
          <label>
            Attachments Preview:
            <button
              onClick={handleTogglePreview}
              disabled={!selectedInvoice || !selectedInvoice.imageData}
            >
              <FontAwesomeIcon icon={previewEnabled ? faEyeSlash : faEye} /> View
            </button>
          </label>
          <div className="attachments-preview">
            {selectedInvoice && previewEnabled && imageDataArray.length > 0 ? (
              <div>
                <h3>Invoice Preview</h3>
                {/* Display all invoices in the preview */}
                {imageDataArray.map((invoiceData) => (
                  <div key={invoiceData.invoiceNumber}>
                    <img
                      src={`data:image/png;base64,${invoiceData.imageData}`}
                      alt={`Invoice ${invoiceData.invoiceNumber}`}
                    />
                    <p>Invoice Number: {invoiceData.invoiceNumber}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No invoices to preview</p>
            )}
          </div>
        </div> 
          <div className="form-group">
                <input
                  type="checkbox"
                  id="sendBccCopy"
                  checked={sendBccCopy}
                  onChange={() => setSendBccCopy(!sendBccCopy)}
                />
                <label htmlFor="sendBccCopy">Send a BCC Copy to me</label>
              </div>

              <button onClick={handleSendInvoice}>Send</button>
            </div>
          </div>
        )}

        {sendSuccess && (
          <div className="success-popup">
            <img src={successImage} alt="Success" />
            <h2>Email Sent Successfully</h2>
            <p>Your invoice has been sent successfully!!🎉</p>
            <button onClick={handleOkButtonClick}>OK</button>
          </div>
        )}
      </div>

      <Footer />
    </> 
  );
};

export default Invoices;
