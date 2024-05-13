import React, { useState, useEffect } from 'react';
import axios from 'axios';

const countries = [
    'Select a country',
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

function InvoiceDetails({ invoiceData, setInvoiceData}) {
    const [paymentType, setPaymentType] = useState('Cash');
    const [otherPayment, setOtherPayment] = useState('');
    const [clientImage, setClientImage] = useState(null);
    const [username, setUsername] = useState('');
    const [invoiceId, setInvoiceId] = useState(null);
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setInvoiceData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername || '');
      }, []);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setClientImage(imageUrl); // Call setClientImage to update the client image
            // Store the image URL in localStorage
            localStorage.setItem('clientImage', imageUrl);
        }
    };
    
    const generateInvoiceId = async () => {
        let unique = false;
        let newInvoiceId = '';
    
        while (!unique) {
            newInvoiceId = Math.random().toString(36).substr(2, 9);
            // Check if the generated invoiceId already exists in the database
            const response = await axios.get(`http://localhost:5000/api/check_invoice_id/${newInvoiceId}`);
            if (!response.data.exists) {
                unique = true;
            }
        }
    
        return newInvoiceId;
    };

    useEffect(() => {
        const fetchInvoiceId = async () => {
            // Generate invoiceId and store it in session storage
            const id = await generateInvoiceId(); // Wait for the promise to resolve
            setInvoiceId(id);
            sessionStorage.setItem('invoiceId', id);
        };
    
        fetchInvoiceId(); // Call the async function
    }, []);
    
    // Add useEffect to retrieve the client image from localStorage on component mount
    useEffect(() => {
        const storedImage = localStorage.getItem('clientImage');
        if (storedImage) {
            setClientImage(storedImage);
        }
    }, []);
    
    

    const handlePaymentTypeChange = (e) => {
        const { value } = e.target;
        setInvoiceData(prevData => ({
            ...prevData,
            paymentType: value,
            // Reset otherPayment if paymentType is changed to 'Cash'
            otherPayment: value === 'Cash' ? '' : prevData.otherPayment 
        }));
    };
    
    const handleOtherPaymentChange = (e) => {
        const { value } = e.target;
        setInvoiceData(prevData => ({
            ...prevData,
            otherPayment: value
        }));
    };
    
    const saveInvoiceToDatabase = () => {
        // Retrieve the clientImage from localStorage
        // const clientImage = localStorage.getItem('clientImage');
        
        // Include clientImage data within invoiceData
        const dataToSend = {
            ...invoiceData,
            clientImage:clientImage,
            storedUsername: username,invoiceId: invoiceId 
        };
        
        // Send invoice data to backend server
        axios.post('http://localhost:5000/api/invoice_generator', dataToSend)
            .then(response => {
                console.log('Invoice saved successfully:', response.data);
                // Optionally, you can handle success response here
            })
            .catch(error => {
                console.error('Error saving invoice:', error);
                // Optionally, you can handle error response here
            });
    };
    
    console.log('Client Image Data:', clientImage);
    
    

    return (
        <>
        <div id="invoice-details">
            <div id="client-details">
                <h3>Client Information</h3>
                <input type="file" className="cmn-input" id="client-image" accept="image/*" onChange={handleImageChange} />
                {clientImage && <img id="client-preview" alt="Client Preview" src={clientImage} />}

                <label htmlFor="client-name">Client Name</label>
                <input type="text" className="cmn-input" id="clientName" value={invoiceData.clientName} onChange={handleInputChange} />

                <label htmlFor="client-address">Client Address</label>
                <input type="text" className="cmn-input" id="clientAddress" value={invoiceData.clientAddress} onChange={handleInputChange} />

                <label htmlFor="client-email">Client Email</label>
                <input type="email" className="cmn-input" id="clientEmail" value={invoiceData.clientEmail} onChange={handleInputChange} />

                <label htmlFor="client-phone">Phone</label>
                <input type="text" className="cmn-input" id="clientPhone" value={invoiceData.clientPhone} onChange={handleInputChange} />

                <label htmlFor="client-country">Client Country</label>
                <select id="clientCountry" className="cmn-input" value={invoiceData.clientCountry} onChange={handleInputChange}>
                    {countries.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                    ))}
                </select>

               
            </div>
            <div id="invoice-info">
                <h3>Invoice Information</h3>
                <label htmlFor="invoice-number">Invoice Number</label>
                <input type="text" className="cmn-input" id="invoiceNumber" value={invoiceData.invoiceNumber} onChange={handleInputChange} />

                <label htmlFor="issue_date">Issue Date</label>
                <input type="text" className="cmn-input" id="invoiceDate" value={invoiceData.invoiceDate} onChange={handleInputChange} />

                <label htmlFor="due_date">Due Date</label>
                <input type="text" className="cmn-input" id="invoiceDueDate" value={invoiceData.invoiceDueDate} onChange={handleInputChange} />
            </div>
            <div id="payment-info">
                <h3>Payment Type</h3>
                <label htmlFor="paymentType">Payment Type</label>
                <select id="paymentType" className="cmn-input" value={invoiceData.paymentType} onChange={handlePaymentTypeChange}>
                    <option value="Cash">Cash</option>
                    <option value="Other">Other</option>
                </select>

                {invoiceData.paymentType === 'Other' && (
                        <div>
                            <label htmlFor="otherPayment">Payment Information</label>
                            <input type="text" id="otherPayment" className="cmn-input" value={invoiceData.otherPayment} onChange={handleInputChange} />
                        </div>
                    )}


                
            </div>
        </div>
        <button onClick={saveInvoiceToDatabase}>Save Invoice</button>
        </>
    );
}

export default InvoiceDetails;
