import React, { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import "../styles/AdminAllInvoices.css";
import InvoiceModal from "./AdminInvoiceModal";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${serverUrl}/api/v1/invoices`);
        setInvoices(response.data);
        setLoading(false);
      } catch (error) {
        setErrorMessage(
          error.response
            ? error.response.data.message
            : "Error fetching invoices"
        );
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
  };

  return (
    <div className="invoiceList-container">
      <h2>Invoices</h2>
      {loading ? (
        <div className="spinner-container">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : invoices.length === 0 ? (
        <p>No invoices available.</p>
      ) : (
        <>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Recipient Name</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice._id}
                  onClick={() => handleInvoiceClick(invoice)}
                >
                  <td>{invoice.recipientName}</td>
                  <td>{invoice.recipientEmail}</td>
                  <td>{invoice.amount}</td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td>{invoice.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedInvoice && (
            <InvoiceModal invoice={selectedInvoice} onClose={closeModal} />
          )}
        </>
      )}
    </div>
  );
};

export default InvoiceList;
