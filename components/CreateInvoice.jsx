import React, { useState, useEffect, useRef } from 'react';
import '../styles/invoicegenerator.css';
import InvoiceDetails from './InvoiceDetails';
import InvoiceItems from './InvoiceItems';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import FreelancerLeftSideBar from './FreelancerLeftSideBar';
import RightSidebar from './RightSidebar';
import Footer from './Footer';
import axios from 'axios';

function CreateInvoice() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const invoiceRef = useRef(null);
    const [clientImage, setClientImage] = useState(null);
    const [invoiceData, setInvoiceData] = useState({
        clientName: "",
        clientAddress: "",
        invoiceNumber: "",
        invoiceDate: "",
        items: [],
        paymentType: "", // Initialize paymentType to a default value
        otherPayment: "",
        clientPhone: ""
    });
    const [previewActive, setPreviewActive] = useState(false);
    const [previewContent, setPreviewContent] = useState(null);
    const [isButtonVisible, setButtonVisible] = useState(true);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername || '');
    }, []);

    const updateClientImage = () => {
        const storedImage = localStorage.getItem('clientImage');
        if (storedImage) {
            setClientImage(storedImage);
            console.log('Updated client image:', storedImage);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authenticated');
        localStorage.removeItem('username');
        navigate('/home');
        window.location.reload();
    };

    useEffect(() => {
        if (previewActive) {
            generatePreviewContent();
        }
    }, [previewActive, invoiceData]);

    const generatePDF = () => {
        setButtonVisible(false);
    
        const allInputElem = document.querySelectorAll("input");
        allInputElem.forEach(elem => {
            elem.style.border = 'none';
            elem.style.pointerEvents = 'none';
            elem.style.padding = '10px 0';
        });
    
        const btnAddElem = document.querySelector(".btn-add");
        if (btnAddElem) {
            btnAddElem.style.display = 'none';
        }
    
        const allElem = document.querySelectorAll(".btn-p");
        allElem.forEach(elem => {
            elem.style.display = 'none';
        });
    
        const element = invoiceRef.current;
    
        const pdfConfig = {
            margin: 10,
            filename: 'invoice.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
    
        html2pdf().from(invoiceRef.current).set(pdfConfig).save().then((pdf) => {
            // Convert the generated PDF to a blob
            pdf.output('blob').then((blob) => {
                // Create FormData object to send the PDF file
                const formData = new FormData();
                formData.append('pdf', blob, 'invoice.pdf');
    
                // Append image data to the FormData
                formData.append('clientImage', clientImage);
    
                // Append the invoiceId to the FormData
                formData.append('invoiceId', sessionStorage.getItem('invoiceId'));
    
                // Send the PDF file, image data, and invoiceId to the backend
                axios.post('/api/invoice_generator1', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => {
                    // Handle success response from the server
                    console.log('PDF and image saved to database:', response.data);
                }).catch((error) => {
                    console.error('Error saving PDF and image to database:', error);
                    // Handle error response from the server
                }).finally(() => {
                    // Re-enable the button after PDF generation and processing is complete
                    setButtonVisible(true);
                });
            });
        });
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setClientImage(imageUrl); // Update the client image state
            // Store the image URL in localStorage
            localStorage.setItem('clientImage', imageUrl);
        }
    };

    const switchTab = (tabId) => {
        if (tabId === 'preview-tab') {
            setPreviewActive(true);
            generatePreviewContent();
            updateClientImage();
        } else {
            setPreviewActive(false);
        }
    };

    const generatePreviewContent = () => {
        const previewContent = (
            <div id="invoice-preview">
                <div id="invoice-details">
                    <div id="client-details">
                        {clientImage && <img id="client-preview" alt="Client Preview" src={clientImage} />}
                        <h3>Client Information</h3>
                        <div><strong>Client Name:</strong> {invoiceData.clientName}</div>
                        <div><strong>Client Address:</strong> {invoiceData.clientAddress}</div>
                        <div><strong>Client Email Address:</strong> {invoiceData.clientEmail}</div>
                        <div><strong>client Phone</strong> {invoiceData.clientPhone}</div>
                        <div><strong>Country:</strong> {invoiceData.clientCountry}</div>
                    </div>
                    <div id="invoice-info">
                        <h3>Invoice Information</h3>
                        <div><strong>Invoice Number:</strong> {invoiceData.invoiceNumber}</div>
                        <div><strong>Invoice Issue Date:</strong> {invoiceData.invoiceDate}</div>
                        <div><strong>Invoice Due Date:</strong> {invoiceData.invoiceDueDate}</div>
                    </div>
                    <div id="payment-info">
                        <h3>Payment information</h3>
                        <div><strong>Payment Method:</strong> {invoiceData.paymentType}</div>
                        {/* Conditionally render other payment information */}
                        {invoiceData.paymentType !== 'Cash' && (
                            <div><strong>Other Payment Information:</strong> {invoiceData.otherPayment}</div>
                        )}
                    </div>
                </div>
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceData.items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.description}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unitPrice}</td>
                                <td>{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div id="invoice-total">
                    <strong>Total Amount:</strong> {calculateTotalAmount().toFixed(2)}
                </div>
                <div><strong>Note</strong> {invoiceData.note}</div>
            </div>
        );
        setPreviewContent(previewContent);
    };

    const calculateTotalAmount = () => {
        return invoiceData.items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
    };

    return (
        <>
            <div className="invoice-dashboard">
                <FreelancerLeftSideBar activeItem="createInvoice" handleItemClick={navigate} handleLogout={handleLogout} />
                <div>
                    <div className="tab-switch">
                        <button className={`edit btn-cmn ${!previewActive ? 'active' : ''}`} onClick={() => switchTab('edit-tab')}>Edit Invoice</button>
                        <button className={`preview btn-cmn ${previewActive ? 'active' : ''}`} onClick={() => switchTab('preview-tab')}>Preview</button>
                        {isButtonVisible && (
                            <button className="generate btn-cmn" onClick={generatePDF}>Download PDF</button>
                        )}
                    </div>
                    <div id="invoice" ref={invoiceRef}>
                        <h2>Invoice</h2>
                        {previewActive ? (
                            <>
                                {/* Render the preview content */}
                                {previewContent}
                            </>
                        ) : (
                            <>
                                {/* Render the InvoiceDetails and InvoiceItems components for editing */}
                                <InvoiceDetails invoiceData={invoiceData} setInvoiceData={setInvoiceData} clientImage={clientImage} />
                                <InvoiceItems invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
                            </>
                        )}
                    </div>
                </div>
                
            </div>
            <RightSidebar username={username} />
                <Footer />
        </>
    );
}

export default CreateInvoice;
