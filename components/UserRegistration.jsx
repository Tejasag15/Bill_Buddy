import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/UserRegistration.css";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";
const UserRegistration = () => {
  const [organizationDetails, setOrganizationDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [freelancerDetails, setFreelancerDetails] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [companyNames, setCompanyNames] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [branchLocations, setBranchLocations] = useState([]);
  const [companyLocation, setCompanyLocation] = useState(''); 
  const [selectedBranch, setSelectedBranch] = useState('');
  const [displayOrganizationDetails, setDisplayOrganizationDetails] = useState(false);
  const [submitDetails, setSubmitDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const organizationColumnOrder = ['company_name', 'company_establishment_date', 'phone_number', 'email', 'company_address', 'branch_location'];
  const customerColumnOrder = ['customer_name', 'customer_contact_number', 'customer_email'];
  const freelancerColumnOrder = ['freelancer_name', 'freelancer_contact_number', 'freelancer_email'];
  const totalPages = Math.ceil((submitDetails?.length || 0) / itemsPerPage);

  useEffect(() => {
    if (selectedType === 'organization') {
      fetchCompanyNames();
    } else if (selectedType === 'customer') {
      fetchCustomerDetails();
    }else if (selectedType === 'freelancer') { // Fetch freelancer details when selected type is freelancer
      fetchFreelancerDetails();
    }
  }, [selectedType]);

  const fetchFreelancerDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-freelancer-details');
      setFreelancerDetails(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompanyNames = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-company-names');
      const uniqueCompanyNames = [...new Set(response.data.companyNames || [])];
      setCompanyNames(uniqueCompanyNames);
      setDisplayOrganizationDetails(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedCompany('');
    setCompanyLocation('');
    setBranchLocations([]);
    setSubmitDetails(null);

    if (e.target.value === 'organization') {
      fetchCompanyNames();
    }
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
    setCompanyLocation('');
    setSubmitDetails(null);
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/get-details-by-company', {
        company: selectedCompany,
        type: selectedType,
        branch: selectedBranch,
      });

      setSubmitDetails(response.data.details || null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      fetchBranchLocations();
    }
  }, [selectedCompany]);

  const fetchBranchLocations = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get-branch-locations?company=${selectedCompany}`);
      setBranchLocations(response.data.branchLocations || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-customer-details');
      setCustomerDetails(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderTable = (details, columnOrder) => {
    if (!details || details.length === 0) {
      return null;
    }

    const paginatedDetails = details.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div>

        <table>
          <thead>
            <tr>
              {columnOrder.map((key) => (
                <th key={key}>{key.replace(/_/g, ' ')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedDetails.map((entry, index) => (
              <tr key={index}>
                {columnOrder.map((key) => (
                  <td key={key}>{entry[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {details.length > itemsPerPage && (
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
    );
  };

  const renderCustomerTable = () => {
    return renderTable(customerDetails, customerColumnOrder);
  };
  
  const renderFreelancerTable = () => {
    return renderTable(freelancerDetails, freelancerColumnOrder);
  };
  return (
    <><AdminNavbar/>
    <div className="details">
      
      <h2>User Registration Details</h2>

      <div className="filters">
        <label htmlFor="organizationType">Type of Organization:</label>
        <select id="organizationType" value={selectedType} onChange={handleTypeChange}>
          <option value="">Select Type</option>
          <option value="organization">Organization</option>
          <option value="customer">Customer</option>
          <option value="freelancer">Freelancer</option>
        </select>

        {selectedType === 'organization' && displayOrganizationDetails && (
          <>
            {Array.isArray(companyNames) && (
              <>
                <select id="companyName" onChange={handleCompanyChange}>
                  <option value="">Select Company</option>
                  {companyNames.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>

                {selectedCompany && (
                  <>
                    <select id="branchLocation" onChange={handleBranchChange}>
                      <option value="">Select Branch Location</option>
                      {branchLocations.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>

                    <button onClick={handleSubmit}>Submit</button>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      {selectedType === 'organization' && renderTable(organizationDetails, organizationColumnOrder)}
      {selectedType === 'customer' && customerDetails && renderCustomerTable()}
      {selectedType === 'freelancer' && freelancerDetails && renderFreelancerTable()}
      {renderTable(submitDetails, organizationColumnOrder)}
    </div>
    <Footer/>
    </>
  );
};

export default UserRegistration;
