import React, { useEffect, useState } from "react";
import "../styles/AdminInvoices.css";
import SideMenu from "../components/SideMenu";
import axios from "axios";

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/v1/invoices`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch invoices");
        }
        const data = await response.json();
        console.log(data);
        setInvoices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [serverUrl]);

  if (loading) {
    return <div className="loading-message">Loading invoices...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="invoices-list-container">
      <h1 className="invoices-title">Invoices</h1>
      <div className="invoices-grid">
        {invoices.map((invoice) => (
          <div className="invoice-card" key={invoice._id}>
            <h2 className="invoice-recipient">{invoice.recipientName}</h2>
            <p className="invoice-email">{invoice.recipientEmail}</p>
            <p className="invoice-total">
              Total: <strong>${invoice.totalAmount.toFixed(2)}</strong>
            </p>
            <p className="invoice-total">
              Balance: <strong>${invoice.balance.toFixed(2)}</strong>
            </p>
            <button
              className="toggle-installments-button"
              onClick={() =>
                document.getElementById(invoice._id).classList.toggle("hidden")
              }
            >
              {document
                .getElementById(invoice._id)
                ?.classList.contains("hidden")
                ? "Show Installments"
                : "Hide Installments"}
            </button>
            <div id={invoice._id} className="installments-section hidden">
              <h3 className="installments-title">Installments</h3>
              <ul className="installments-list">
                {invoice.installment.map((inst, index) => (
                  <li key={index} className="installment-item">
                    <span>Payment Method: {inst.paymentMethod}</span>
                    <span>Payment percentage: {inst.percentage}% </span>
                    <span>
                      Payable Amount: ${inst.payableAmount.toFixed(2)}
                    </span>
                    <span className={inst.isPaid ? "paid" : "unpaid"}>
                      Status: {inst.isPaid ? "Paid" : "Unpaid"}
                    </span>
                    <span>
                      Date Created:{" "}
                      {new Date(inst.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InvoiceForm = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [invoiceData, setInvoiceData] = useState({
    bookingType: "trip",
    title: "",
    guests: 1,
    tripCost: "",
    dailyRate: "",
    days: 1,
    startDate: "",
    endDate: "",
    paymentMethod: "",
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    percentage: "100",
  });

  const [payableAmount, setPayableAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    calculateAmounts();
  }, [
    invoiceData.bookingType,
    invoiceData.guests,
    invoiceData.tripCost,
    invoiceData.dailyRate,
    invoiceData.days,
    invoiceData.percentage,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateAmounts = () => {
    let total = 0;

    if (invoiceData.bookingType === "trip") {
      total =
        parseInt(invoiceData.guests) * (parseFloat(invoiceData.tripCost) || 0);
    } else if (invoiceData.bookingType === "accommodation") {
      total =
        (parseFloat(invoiceData.dailyRate) || 0) *
        (parseInt(invoiceData.days) || 1);
    }

    const percentagePaid = parseFloat(invoiceData.percentage) || 0;
    const percentageAmount = (total * percentagePaid) / 100;
    const balance = total - percentageAmount;

    setTotalAmount(total);
    setPayableAmount(percentageAmount);
    setBalance(balance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      ...invoiceData,
      totalAmount,
      payableAmount,
      balance,
    };

    try {
      const response = await axios.post(
        `${serverUrl}/api/v1/invoices/create-invoice`,
        formData
      );

      if (response.status === 201 || response.status === 200) {
        setSuccessMessage("Invoice created successfully!");
        setInvoiceData({
          bookingType: "trip",
          title: "",
          guests: 1,
          tripCost: "",
          dailyRate: "",
          days: 1,
          startDate: "",
          endDate: "",
          paymentMethod: "",
          recipientName: "",
          recipientEmail: "",
          recipientPhone: "",
          percentage: "100",
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
    <div className="createInvoice-parentDiv">
      <SideMenu activeLink="invoices" admin={true} />
      <div className="invoice-form-container">
        <h2 className="invoice-form-title">Create Invoice</h2>
        <form onSubmit={handleSubmit} className="invoice-form">
          <div className="invoice-form-group">
            <label htmlFor="recipientName" className="invoice-form-label">
              Recipient Name
            </label>
            <input
              id="recipientName"
              name="recipientName"
              type="text"
              value={invoiceData.recipientName}
              onChange={handleInputChange}
              className="invoice-form-input"
              required
            />
          </div>

          <div className="invoice-form-group">
            <label htmlFor="recipientEmail" className="invoice-form-label">
              Recipient Email
            </label>
            <input
              id="recipientEmail"
              name="recipientEmail"
              type="email"
              value={invoiceData.recipientEmail}
              onChange={handleInputChange}
              className="invoice-form-input"
              required
            />
          </div>

          <div className="invoice-form-group">
            <label htmlFor="recipientPhone" className="invoice-form-label">
              Recipient Phone
            </label>
            <input
              id="recipientPhone"
              name="recipientPhone"
              type="text"
              value={invoiceData.recipientPhone}
              onChange={handleInputChange}
              className="invoice-form-input"
              required
            />
          </div>

          <div className="invoice-form-group">
            <label htmlFor="bookingType" className="invoice-form-label">
              Booking Type
            </label>
            <select
              id="bookingType"
              name="bookingType"
              value={invoiceData.bookingType}
              onChange={handleInputChange}
              className="invoice-form-input"
              required
            >
              <option value="trip">Trip</option>
              <option value="accommodation">Accommodation</option>
            </select>
          </div>

          <div className="invoice-form-group">
            <label htmlFor="title" className="invoice-form-label">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={invoiceData.title}
              onChange={handleInputChange}
              className="invoice-form-input"
              required
            />
          </div>

          {invoiceData.bookingType === "trip" && (
            <>
              <div className="invoice-form-group">
                <label htmlFor="guests" className="invoice-form-label">
                  Guests
                </label>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  value={invoiceData.guests}
                  onChange={handleInputChange}
                  className="invoice-form-input"
                  min="1"
                  required
                />
              </div>

              <div className="invoice-form-group">
                <label htmlFor="tripCost" className="invoice-form-label">
                  Trip Cost (per guest)
                </label>
                <input
                  id="tripCost"
                  name="tripCost"
                  type="number"
                  value={invoiceData.tripCost}
                  onChange={handleInputChange}
                  className="invoice-form-input"
                  required
                />
              </div>
            </>
          )}

          {invoiceData.bookingType === "accommodation" && (
            <>
              <div className="invoice-form-group">
                <label htmlFor="dailyRate" className="invoice-form-label">
                  Daily Rate
                </label>
                <input
                  id="dailyRate"
                  name="dailyRate"
                  type="number"
                  value={invoiceData.dailyRate}
                  onChange={handleInputChange}
                  className="invoice-form-input"
                  required
                />
              </div>

              <div className="invoice-form-group">
                <label htmlFor="days" className="invoice-form-label">
                  Days
                </label>
                <input
                  id="days"
                  name="days"
                  type="number"
                  value={invoiceData.days}
                  onChange={handleInputChange}
                  className="invoice-form-input"
                  min="1"
                  required
                />
              </div>
            </>
          )}

          <div className="invoice-form-group">
            <label htmlFor="percentage" className="invoice-form-label">
              Percentage Paid
            </label>
            <select
              id="percentage"
              name="percentage"
              value={invoiceData.percentage}
              onChange={handleInputChange}
              className="invoice-form-input"
              required
            >
              <option value="100">100% (Full Payment)</option>
              <option value="75">75%</option>
              <option value="50">50%</option>
              <option value="25">25%</option>
            </select>
          </div>

          <div className="invoice-form-group">
            <label htmlFor="paymentMethod" className="invoice-form-label">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={invoiceData.paymentMethod}
              onChange={handleInputChange}
              className="invoice-form-input"
              required
            >
              <option value="">Select a payment method</option>
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
              <option value="paypal">Paypal</option>
              <option value="mpesa">Mpesa</option>
            </select>
          </div>

          <div className="invoice-form-group">
            <label htmlFor="startDate" className="invoice-form-label">
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={invoiceData.startDate}
              onChange={handleInputChange}
              className="invoice-form-input"
              required
            />
          </div>

          <div className="invoice-form-group">
            <label htmlFor="endDate" className="invoice-form-label">
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={invoiceData.endDate}
              onChange={handleInputChange}
              className="invoice-form-input"
              required
            />
          </div>

          <div className="invoice-summary">
            <p>Total Amount: USD {totalAmount.toFixed(2)}</p>
            <p>Payable Amount: USD {payableAmount.toFixed(2)}</p>
            <p>Balance: USD {balance.toFixed(2)}</p>
          </div>
          {successMessage && (
            <p className="invoice-form-success">{successMessage}</p>
          )}

          {errorMessage && <p className="invoice-form-error">{errorMessage}</p>}
          <button
            type="submit"
            className="invoice-form-submit"
            disabled={loading}
          >
            {loading ? "Creating Invoice..." : "Create Invoice"}
          </button>
        </form>

        <InvoicesList />
      </div>
    </div>
  );
};

export default InvoiceForm;
