import React, { useState } from "react";
import "../styles/AdminInvoices.css";
import SideMenu from "../components/SideMenu";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import InvoiceList from "./AdminAllInvoices";

const AdminInvoices = () => {
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    phoneNumber: "",
    amount: "",
    dueDateType: "By Period",
    dueDate: "",
    subject: "",
    description: "",
    installment: "Pay Full Amount",
    referenceNumber: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${serverUrl}/api/v1/invoices/create-invoice`,
        formData
      );

      if (response.status === 201) {
        setSuccessMessage("Invoice created successfully!");

        setFormData({
          recipientName: "",
          recipientEmail: "",
          phoneNumber: "",
          amount: "",
          dueDateType: "By Period",
          dueDate: "",
          subject: "",
          description: "",
          installment: "Pay Full Amount",
          referenceNumber: "",
        });

        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 3000);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message || "Error creating invoice"
        );
      } else {
        setErrorMessage("Network error or server unreachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminInvoices_parentDiv">
      <SideMenu activeLink="invoices" admin={true} />
      <div className="InvoicesParentDiv">
        <div className="adminInvoices-container">
          <h2>Create New Invoice</h2>
          {loading && (
            <ClipLoader size={35} color={"#123abc"} loading={loading} />
          )}
          {loading && <div className="overlay"></div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="adminInvoices-form-group">
              <label>
                Recipient Name<span>*</span>
              </label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="adminInvoices-form-group">
              <label>
                Recipient Email<span>*</span>
              </label>
              <input
                type="email"
                name="recipientEmail"
                value={formData.recipientEmail}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="adminInvoices-form-group">
              <label>Phone number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="adminInvoices-form-group">
              <label>
                Amount<span>*</span>
              </label>
              <div className="adminInvoices-amount">
                <select name="currency" required>
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                </select>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="adminInvoices-form-group">
              <label>
                Due Date<span>*</span>
              </label>
              <div className="adminInvoices-due-date">
                <select
                  name="dueDateType"
                  value={formData.dueDateType}
                  onChange={handleInputChange}
                >
                  <option value="By Period">By Period</option>
                  <option value="Specific Date">Specific Date</option>
                </select>
                <span>OR</span>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="adminInvoices-form-group">
              <label>
                Subject<span>*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="adminInvoices-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="adminInvoices-form-group">
              <label>Installment</label>
              <select
                name="installment"
                value={formData.installment}
                onChange={handleInputChange}
              >
                <option value="Pay Full Amount">Pay Full Amount</option>
                <option value="Installment 1">Installment 1</option>
              </select>
            </div>

            <button type="submit" className="adminInvoices-generate-btn">
              Generate Invoice
            </button>
          </form>
        </div>
        <InvoiceList />
      </div>
    </div>
  );
};

export default AdminInvoices;
