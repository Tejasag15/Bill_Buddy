import React from 'react';
import axios from 'axios'; // Don't forget to import axios

function InvoiceItems({ invoiceData, setInvoiceData }) {
    const addRow = () => {
        setInvoiceData(prevData => ({
            ...prevData,
            items: [...prevData.items, { description: "", quantity: 0, unitPrice: 0 }]
        }));
    };

    const removeRow = (index) => {
        setInvoiceData(prevData => ({
            ...prevData,
            items: prevData.items.filter((_, i) => i !== index)
        }));
    };

    const handleNoteChange = (e) => {
        const { value } = e.target;
        setInvoiceData(prevData => ({
            ...prevData,
            note: value
        }));
    };

    const handleItemChange = (e, index, field) => {
        const { value } = e.target;
        setInvoiceData(prevData => ({
            ...prevData,
            items: prevData.items.map((item, i) => {
                if (i === index) {
                    return {
                        ...item,
                        [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) : value
                    };
                }
                return item;
            })
        }));
    };

    const saveInvoiceToDatabase = () => {
        // Send invoice data to backend server including items array
        axios.post('http://localhost:5000/api/invoice_generator', {
            ...invoiceData,
            items: invoiceData.items
        })
        .then(response => {
            console.log('Invoice saved successfully:', response.data);
            // Optionally, you can handle success response here
        })
        .catch(error => {
            console.error('Error saving invoice:', error);
            // Optionally, you can handle error response here
        });
    };

    return (
        <div>
            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th className="btn-p">Action</th>
                    </tr>
                </thead>
                <tbody id="invoice-items">
                    {invoiceData.items.map((item, index) => (
                        <tr key={index}>
                            <td><input type="text" className="description cmn-input" value={item.description} onChange={(e) => handleItemChange(e, index, 'description')} /></td>
                            <td><input type="number" className="quantity cmn-input" value={item.quantity} onChange={(e) => handleItemChange(e, index, 'quantity')} /></td>
                            <td><input type="number" className="unit-price cmn-input" value={item.unitPrice.toFixed(2)} onChange={(e) => handleItemChange(e, index, 'unitPrice')} /></td>
                            <td><input type="text" className="total cmn-input" value={(item.quantity * item.unitPrice).toFixed(2)} readOnly /></td>
                            <td className="btn-p"><button className="btn-rmv" onClick={() => removeRow(index)}>Remove</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div id="invoice-total">
                <label htmlFor="total-amount">Total Amount</label>
                <input type="text" className="total-input" id="total-amount" value={(invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0)).toFixed(2)} readOnly />
            </div>
            <button className="btn-add" onClick={addRow}>Add More Item</button>
            <div>
                <label htmlFor="note">Note</label>
                <input type="text" className="cmn-input" id="note" value={invoiceData.note} onChange={handleNoteChange} placeholder='Note' />
            </div>
            {/* <button onClick={saveInvoiceToDatabase}>Save Invoice</button> */}
        </div>
    );
}

export default InvoiceItems;
