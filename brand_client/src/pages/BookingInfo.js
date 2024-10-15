import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCookies } from 'react-cookie'

const styles = `
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  .success-message {
    background-color: #d4edda;
    border-left: 5px solid #28a745;
    color: #155724;
    padding: 15px;
    margin-bottom: 20px;
  }
  .error-message {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 4px;
  }
  .card {
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
    border-radius: 4px;
  }
  .field {
    margin-bottom: 15px;
  }
  .field-label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
    color: #555;
  }
  .field-value {
    color: #333;
  }
  @media (max-width: 480px) {
    .container {
      padding: 10px;
    }
    .card {
      padding: 15px;
    }
  }
`;

const BookingInfo = () => {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [errorMsg,setErrorMsg]=useState(null)

  const [cookies, setCookie, removeCookie] = useCookies(['ma_auth_token']);

  let ma_auth_token=cookies.ma_auth_token
  //  const serverUrl='http://localhost:5010'
  // const serverUrl='https://server.mwakaziadventures.com'
  const serverUrl=process.env.REACT_APP_SERVER_URL

  function formatEpochToDate(epoch) {
    // Create a new Date object from the epoch timestamp (in milliseconds)
    const date = new Date(epoch);
  
    // Get hours, minutes, day, month, and year
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
  
    // Determine AM or PM
    const ampm = hours >= 12 ? 'pm' : 'am';
  
    // Convert 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert hour '0' to '12'
  
    // Pad minutes with a leading zero if necessary
    const minutesPadded = minutes < 10 ? `0${minutes}` : minutes;
  
    // Format the final date string
    const formattedDate = `${day < 10 ? '0' + day : day} ${month}, ${year} - ${hours}:${minutesPadded}${ampm}`;
  
    return formattedDate;
  }

  useEffect(() => {
    const fetchPaymentData = async () => {
      const bookingId = searchParams.get('id');
      const trackingId=searchParams.get("OrderTrackingId")
      if (!bookingId) {
        setError('No booking provided');
        setLoading(false);
        return;
      }

      try {
        // Replace this with your actual API call
        const response = await fetch(`${serverUrl}/api/v1/bookings/status/${bookingId}`,{
            headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${ma_auth_token}`
        },
        });
        console.log(response)
        // if (!response.ok) {
        //   throw new Error('Failed to fetch booking data');
        // }
        const data = await response.json();
        const {theBooking}=data
        setIsPaid(theBooking.isPaid)
        console.log(theBooking)
        setPaymentData(theBooking);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [searchParams]);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <strong>Error!</strong> {error}
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="container">
        <div className="error-message">
          <strong>Payment Not Found!</strong> The requested payment could not be found.
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="container">
      {isPaid?<div className="success-message">
          <strong>Payment Received</strong>
          <p>Thank you! Your payment has been received successfully.</p>
        </div>:<div className="error-message">
          <strong>Payment Cancelled</strong> 
        </div>}
        
        
        <div className="card">
          <div className="field">
            <span className="field-label">Name:</span>
            <p className="field-value">{paymentData.customer.firstName} {paymentData.customer.lastName}</p>
          </div>
          <div className="field">
            <span className="field-label">Item:</span>
            <p className="field-value">{paymentData.item_details.title}</p>
          </div>
          <div className="field">
            <span className="field-label">Amount:</span>
            <p className="field-value">{paymentData.amount}</p>
          </div>
          {/* <div className="field">
            <span className="field-label">Merchant Ref</span>
            <p className="field-value">{paymentData.orderId}</p>
          </div> */}
          <div className="field">
            <span className="field-label">Tracking Id:</span>
            <p className="field-value">{paymentData.orderId}</p>
          </div>
          
          {/* <div className="field">
            <span className="field-label">Payment Method</span>
            <p className="field-value">{paymentData.payment_method}</p>
          </div> */}
          <div className="field">
            <span className="field-label">Initiated:</span>
            <p className="field-value">{formatEpochToDate(paymentData.created_at)}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingInfo;