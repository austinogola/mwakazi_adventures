import React from "react";
import "../styles/AdminInvoiceModal.css";

const InvoiceModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  return (
    <div className="invoice-modal-overlay">
      <div className="invoice-modal">
        <h2>Invoice Details</h2>
        <div className="invoice-modal-content">
          <p>
            <strong>Recipient Name:</strong> {invoice.recipientName}
          </p>
          <p>
            <strong>Recipient Email:</strong> {invoice.recipientEmail}
          </p>
          <p>
            <strong>Phone Number:</strong> {invoice.phoneNumber}
          </p>
          <p>
            <strong>Amount:</strong> {invoice.amount}
          </p>
          <p>
            <strong>Due Date:</strong>
            {new Date(invoice.dueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Subject:</strong> {invoice.subject}
          </p>
          <p>
            <strong>Description:</strong> {invoice.description}
          </p>
          <p>
            <strong>Status:</strong> {invoice.status}
          </p>
          <p>
            <strong>Installment:</strong> {invoice.installment}
          </p>
          <p>
            <strong>Reference Number:</strong> {invoice.referenceNumber}
          </p>
        </div>
        <button onClick={onClose} className="invoice-modal-close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default InvoiceModal;
