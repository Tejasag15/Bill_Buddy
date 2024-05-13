import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/UploadInvoice.css";
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Footer from './Footer';
import axios from 'axios';
import successImage from "../assets/images/SuccessImage.png"; 



const UploadInvoice = () => {
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [username, setUsername] = useState('');
  const [uploadFailed, setUploadFailed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the username from local storage and set it in state
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
    navigate('/home');
    window.location.reload();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInvoiceFile(file);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('invoice_image', invoiceFile);
      formData.append('username', username);
      const response = await axios.post('http://localhost:5000/extract_invoice_text', formData);
  
      const result = response.data;
      console.log(result);

      setUploadSuccess(true);
      setUploadFailed(false);
    } catch (error) {
      console.error('Error:', error.response || error.message || error);
      setUploadSuccess(false);
      setUploadFailed(true);
    }
  };

  const handleOkButtonClick = () => {
    // Handle the "OK" button click (e.g., navigate back to the main page)
    setUploadSuccess(false);
    setUploadFailed(false);
  };

  const activeItem = 'uploadInvoice';

  return (
    <>
      <div className="upload-invoice-container">
        <LeftSidebar
          activeItem={activeItem}
          handleItemClick={navigate}
          handleLogout={handleLogout}
        />
        <div className="upload-invoice-page">
          <div className="content1">
            {!uploadSuccess && !uploadFailed ? (
              <>
                <h2>Upload Your Invoice</h2>
                <p>Choose your invoice file and click the upload button.</p>
                <input
                  type="file"
                  accept=".pdf, .doc, .docx,.png,.jpg,.webp,.jpeg"
                  onChange={handleFileChange}
                />
                <button onClick={handleUpload}>Upload</button>
              </>
            ) : uploadSuccess ? (
              <>
                {/* Display Success Popup */}
                <div className="success-popup">
                <img src={successImage} alt="Success" />
                  <h2>Upload Successful</h2>
                  <p>Your invoice has been uploaded successfully!!🎉
                  </p>
                  <button onClick={handleOkButtonClick}>OK</button>
                </div>
              </>
            ) : (
              <>
              <div className="success-popup">
                <h2>Failed to Upload</h2>
                <p>There was an error uploading your invoice. Please try again.</p>
                <img src={successImage} alt="Success" />
                <button onClick={handleOkButtonClick}>OK</button>
                </div>
                
              </>
            )}
          </div>
        </div>
      </div>
      <RightSidebar username={username} />
      <Footer />
    </>
  );
};

export default UploadInvoice;