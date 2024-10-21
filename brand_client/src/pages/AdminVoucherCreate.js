import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminVoucherCreate.css";
import SideMenu from "../components/SideMenu";
import VoucherCard from "./VocherCard";

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/v1/vouchers`);
        setVouchers(response.data);
      } catch (error) {
        setError("Error fetching vouchers");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  if (loading) {
    return <div className="vouchers__loading">Loading vouchers...</div>;
  }

  if (error) {
    return <div className="vouchers__error">{error}</div>;
  }

  return (
    <div className="vouchers__container">
      <h2 className="vouchers__title">Available Vouchers</h2>
      <table className="vouchers__table">
        <thead className="vouchers__thead">
          <tr>
            <th className="vouchers__th">Voucher Number</th>
            <th className="vouchers__th">Code</th>
            <th className="vouchers__th">Amount</th>
            <th className="vouchers__th">Expiry Date</th>
            <th className="vouchers__th">Created At</th>
          </tr>
        </thead>
        <tbody className="vouchers__tbody">
          {vouchers.map((voucher) => (
            <tr key={voucher.voucherNumber} className="vouchers__row">
              <td className="vouchers__td">{voucher.voucherNumber}</td>
              <td className="vouchers__td">{voucher.code}</td>
              <td className="vouchers__td">${voucher.amount.toFixed(2)}</td>
              <td className="vouchers__td">
                {new Date(voucher.expiry).toLocaleDateString()}
              </td>
              <td className="vouchers__td">
                {new Date(voucher.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminCreateVoucher = () => {
  const [amount, setAmount] = useState("");
  const [code, setCode] = useState("");
  const [expiry, setExpiry] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const voucherData = {
      amount,
      code,
      expiry,
    };

    try {
      const response = await axios.post(
        `${serverUrl}/api/v1/vouchers/create`,
        voucherData
      );

      if (response.status === 201) {
        setAmount("");
        setCode("");
        setExpiry("");
        setMessage("Voucher created successfully!");
        setMessageType("success");
      }
    } catch (error) {
      setMessage("Error creating voucher. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminVoucher-parentDiv">
      <SideMenu activeLink="vouchers" admin={true} />
      <div className="admin-voucher-container">
        <h2>Create a Voucher</h2>

        {message && (
          <p className={`voucher-message ${messageType}`}>{message}</p>
        )}

        <form onSubmit={handleSubmit} className="admin-voucher-form">
          <label htmlFor="amount">Voucher Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <label htmlFor="code">Voucher Code:</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <label htmlFor="expiry">Expiry Date:</label>
          <input
            type="date"
            id="expiry"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            required
          />

          <button
            type="submit"
            className="voucher-submit-btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Voucher"}
          </button>
        </form>

        <Vouchers />

        <VoucherCard />
      </div>
    </div>
  );
};

export default AdminCreateVoucher;
