import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import '../styles/BookingPage.css';
import { useCookies } from 'react-cookie';

const PESAPAL_IFRAME_URL = 'https://demo.pesapal.com/api/PostPesapalDirectOrderV4';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState(null);
  const [details, setDetails] = useState(null);
  const [bookingType, setBookingType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    guests: 1,
    payment: ''
  });

  const [searchParams] = useSearchParams();
  const _id = searchParams.get('id');

  const bounceUrl = `/signup?bounce=booking?id=${_id}`;
  
  const [showPesapalIframe, setShowPesapalIframe] = useState(false);
  const [pesapalIframeUrl, setPesapalIframeUrl] = useState('');

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let response = await fetch(`${serverUrl}/api/v1/trips/${_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        let data = await response.json();

        if (!response.ok || !data._id) {
          response = await fetch(`${serverUrl}/api/v1/accommodations/${_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          data = await response.json();
        }

        console.log(data)
        if (data._id) {
          setBookingType(data.duration ? 'trip' : 'accommodation');
          setDetails(data);
        } else {
          setErrorMsg('Details not found');
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchDetails();
  }, [_id, serverUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const generatePesapalIframeUrl = () => {
    const amount = 100;
    const description = `Booking for ${bookingType === 'trip' ? 'Trip' : 'Accommodation'}: ${details.title}`;
    const type = 'MERCHANT';
    const reference = `BOOKING-${Date.now()}`;
    const firstName = formData.name.split(' ')[0];
    const lastName = formData.name.split(' ').slice(1).join(' ');
    const email = formData.email;
    
    const params = new URLSearchParams({
      'pesapal_merchant_reference': reference,
      'pesapal_transaction_amount': amount,
      'pesapal_description': description,
      'pesapal_type': type,
      'pesapal_first_name': firstName,
      'pesapal_last_name': lastName,
      'pesapal_email': email
    });

    return `${PESAPAL_IFRAME_URL}?${params.toString()}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/booking/proceed`, { 
      state: { 
        itemDetails: {...details,guests: formData.guests,days: formData.days || 1,bookingType},
        
      } 
    });
  };

  if (!details) {
    return <div className="loading">Loading details...</div>;
  }

  return (
    <div className="booking-container">
      <header className="booking-header">
        <h1>{bookingType === 'trip' ? 'Trip Booking' : 'Accommodation Booking'}</h1>
      </header>
      <main className="booking-main">
        <section className="trip-details">
          <h2>{details.title || details.description}</h2>
          <div className="trip-info">
            <img src={details.images[0]} alt={details.title || details.description} className="trip-image" />
            <div className="trip-text">
              {details.category && <p>Category: {details.category}</p>}
              {details.rating && <p>Rating: {details.rating} / 5</p>}
            </div>
          </div>
        </section>
        <section className="booking-form">
          <h2>Book Your {bookingType === 'trip' ? 'Trip' : 'Accommodation'}</h2>
          <div className="booking-summary">
            <span style={{marginRight:'20px',fontWeight:'bold'}}>Rate: </span><span>{details.price || details.dailyRate} USD</span>
            {bookingType === 'accommodation' && (
              <>
                <br/><span style={{marginRight:'20px',fontWeight:'bold'}}>Days: </span>
                <input
                  type="number"
                  id="days"
                  name="days"
                  value={formData.days}
                  min={1}
                  onChange={handleInputChange}
                  required
                  style={{ width: '50px', display: 'inline-block' ,marginBottom:'20px'}}
                />
              </>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            {bookingType === 'trip' && (
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label htmlFor="guests" style={{ marginRight: '10px' }}>Guests</label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  required
                  min={1}
                  style={{ width: '50px' }}
                />
              </div>
            )}
            
            <span style={{ marginBottom: '100px',fontWeight:'bold' }}>
              <span style={{ marginRight: '10px' }}>Total: </span>
              <span>{(details.price || details.dailyRate) * (formData.days || 1) * (bookingType === 'trip' ? formData.guests : 1)} USD</span>
            </span>

            <div className="form-group">
              <label htmlFor="payment">Payment Method</label>
              <select
                id="payment"
                name="payment"
                value={formData.payment}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a payment method</option>
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="paypal">Paypal</option>
                <option value="mpesa">Mpesa</option>
              </select>
            </div>
            <button type="submit" className="btn-book">Book Now</button>
          </form>
        </section>
      </main>
      {showPesapalIframe && (
        <div className="pesapal-iframe-container">
          <iframe
            src={pesapalIframeUrl}
            width="100%"
            height="700px"
            scrolling="no"
            frameBorder="0"
            title="Pesapal Payment"
          >
            <p>Your browser does not support iframes.</p>
          </iframe>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
