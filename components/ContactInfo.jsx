import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ContactInfo.css';
import AdminNavbar from "./AdminNavbar";
const ContactInfo = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/contact-us');
        console.log('API Response:', response.data);
        setData(response.data.contactUsMessages);
      } catch (error) {
        console.error('Error fetching contact us messages:', error);
      }
    };

    fetchData();
  }, []);

  // Move the following code inside the useEffect to set currentItems after fetching data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((data.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="Contact">
      <AdminNavbar/>
      <div className="centre-table">
        <h1>Contact Us Information</h1>
        <div className="contact-info-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {/* Pagination */}
          {data.length > itemsPerPage && (
            <div className="pagination1">
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
    </div>
  );
};

export default ContactInfo;
