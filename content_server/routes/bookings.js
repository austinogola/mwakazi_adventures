const express = require("express");
const Trip = require("../models/Trip");
const NewTrip = require("../models/NewTrip");
const Booking = require("../models/Booking"); // Import the Booking model
const Accommodation = require("../models/Accommodation"); // Import the Accommodation model
const { verifyToken, isAdmin } = require("../middleware/auth"); // Authentication middleware
const nodemailer = require("nodemailer");
const router = express.Router();
const {
  registerIPN,
  getAuthToken,
  startPaymentFlow,
  getOrderStatus,
} = require("../modules/pesapal");

// Get all bookings (Admin only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  // console.log('Initiated',req)
  try {
    const bookings = await Booking.find().populate("account").populate("trip");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});

// Get a specific booking by ID (Admin only)
router.get("/:id", verifyToken, isAdmin, async (req, res) => {
  console.log("Initiated", req);
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error });
  }
});

// Create a new booking (Authenticated users)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { trip, accommodation, price, isPaid, credentials } = req.body;
    let newBooking;

    if (trip) {
      const theTrip = await NewTrip.findById(trip);
      newBooking = new Booking({
        account: req.user.id, // Use the authenticated user's account ID
        trip,
        price,
        isPaid,
        amount: theTrip.price,
      });
    } else if (accommodation) {
      const theAccommodation = await Accommodation.findById(accommodation);
      newBooking = new Booking({
        account: req.user.id, // Use the authenticated user's account ID
        accommodation,
        price,
        isPaid,
        amount: theAccommodation.dailyRate,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Trip or Accommodation must be provided" });
    }

    await newBooking.save();
    startPaymentFlow(newBooking);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
});

router.post("/init", async (req, res) => {
  try {
    const { isPaid, customer, itemDetails } = req.body;
    console.log("Payment info received:", req.body);

    let newBooking;

    if (itemDetails.bookingType === "trip") {
      newBooking = await createTripBooking(itemDetails, customer, isPaid);
    } else if (itemDetails.bookingType === "accommodation") {
      newBooking = await createAccommodationBooking(
        itemDetails,
        customer,
        isPaid
      );
    } else {
      return res
        .status(400)
        .json({ message: "Trip or Accommodation must be provided" });
    }

    await newBooking.save();

    let pesaPalFdBack = await startPaymentFlow(newBooking);
    if (pesaPalFdBack.error) {
      return res
        .status(500)
        .json({ message: "Order could not be made", status: "fail" });
    }

    newBooking.orderId = pesaPalFdBack.order_tracking_id;
    await newBooking.save();
    await sendReceiptEmail(customer, itemDetails, isPaid);

    return res.status(200).json({
      message: "Booking made",
      status: "success",
      newBooking,
      payment_obj: pesaPalFdBack,
    });
  } catch (error) {
    console.error("Error processing request:", error.message);
    return res.status(500).json({
      message: "Error processing request",
      error: error.message,
    });
  }
});

async function createTripBooking(itemDetails, customer, isPaid) {
  const theTrip = await NewTrip.findById(itemDetails._id);
  return new Booking({
    trip: theTrip,
    item_details: {
      type: "trip",
      title: `${itemDetails.title} for ${itemDetails.guests}`,
      guests: itemDetails.guests,
      total_price: itemDetails.paymentAmount,
    },
    customer,
    amount: itemDetails.paymentAmount,
    currency: "USD",
    created_at: new Date().getTime(),
    isPaid,
  });
}

async function createAccommodationBooking(itemDetails, customer, isPaid) {
  const theAccommodation = await Accommodation.findById(itemDetails._id);
  return new Booking({
    accommodation: theAccommodation,
    item_details: {
      type: "accommodation",
      title: `Accommodation at ${theAccommodation.location} for ${itemDetails.days} days`,
      days: itemDetails.days,
      total_price: itemDetails.paymentAmount,
      startDate: customer.startDate,
      endDate: customer.endDate,
    },
    isPaid,
    amount: itemDetails.paymentAmount,
    currency: "USD",
    created_at: new Date().getTime(),
    customer,
  });
}

async function sendReceiptEmail(customer, itemDetails, isPaid) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const emailContent = generateEmailContent(customer, itemDetails, isPaid);
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: customer.email,
    subject: `Receipt for your booking`,
    html: emailContent,
  };

  return transporter.sendMail(mailOptions).catch((err) => {
    console.error("Error sending receipt email:", err.message);
    throw new Error("Error sending receipt email");
  });
}

function generateEmailContent(customer, itemDetails, isPaid) {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px;">
          <h2 style="color: #4CAF50; text-align: center;">Booking Confirmation Receipt</h2>
          <p>Dear ${customer.firstName} ${customer.lastName},</p>
          <p>Thank you for your purchase! Here are the details of your ${
            itemDetails.bookingType
          } booking:</p>
          <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 10px; margin: 10px 0;">
              <h3 style="color: #333;">Booking Details</h3>
              <p><strong>Type:</strong> ${
                itemDetails.bookingType === "trip" ? "Trip" : "Accommodation"
              }</p>
              ${
                itemDetails.bookingType === "trip"
                  ? `<p><strong>Trip Title:</strong> ${itemDetails.title} for ${itemDetails.guests} guests</p>`
                  : `<p><strong>Accommodation Location:</strong> ${itemDetails.destination}</p>`
              }
              <p><strong>Start Date:</strong> ${customer.startDate}</p>
              <p><strong>End Date:</strong> ${customer.endDate}</p>
          </div>
          <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 10px; margin: 10px 0;">
              <h3 style="color: #333;">Payment Information</h3>
              <p><strong>Payment Status:</strong> ${
                isPaid ? "Paid" : "Pending"
              }</p>
              <p><strong>Total Amount:</strong> $${itemDetails.totalAmount.toFixed(
                2
              )}</p>
              <p><strong>Paid:</strong> $${itemDetails.paymentAmount.toFixed(
                2
              )}</p>
              <p><strong>Balance:</strong> $${itemDetails.balance.toFixed(
                2
              )}</p>
              <p><strong>Payment Method:</strong> ${
                itemDetails.formDataBooking.payment || "Not provided"
              }</p>
          </div>
          <p>We hope you have a wonderful experience!</p>
          <p>If you have any questions, feel free to contact us at <a href="mailto:support@gazeguard.io">support@gazeguard.io</a>.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <footer style="text-align: center;">
              <p style="font-size: 12px; color: #888;">Gazeguard.io | Booking Services</p>
              <p style="font-size: 12px; color: #888;">For any inquiries, email us at <a href="mailto:support@gazeguard.io" style="color: #4CAF50;">support@gazeguard.io</a>.</p>
          </footer>
      </div>`;
}

router.get("/status/:id", async (req, res) => {
  const { id } = req.params;
  const theBooking = await Booking.findById(id);
  const theTrip = await NewTrip.findById(theBooking.trip);
  // let status=await getOrderStatus(theBooking.orderId)
  // console.log(status)
  console.log(theTrip);

  // theBooking.amount=theTrip.price

  res.status(200).json({ theBooking, status: "success" });
});

router.post("/status/:id", async (req, res) => {
  const { OrderTrackingId, OrderMerchantReference } = req.body;
  let status = await getOrderStatus(OrderTrackingId);
  console.log(status);
  let { payment_method, payment_status_description, error } = status;

  let isPaid = false;
  let updatedBooking;
  console.log(payment_method, payment_status_description, error);
  if (!error) {
    isPaid = true;
    updatedBooking = await Booking.findByIdAndUpdate(
      OrderMerchantReference,
      { isPaid, payment_method, payment_status: payment_status_description },
      { new: true }
    );
  } else {
    let payment_status = error.message;
    updatedBooking = await Booking.findByIdAndUpdate(
      OrderMerchantReference,
      { isPaid, payment_method, payment_status },
      { new: true }
    );
  }
  updatedBooking.save();
  // console.log(OrderTrackingId,OrderMerchantReference,payment_method,payment_status_description)

  console.log(updatedBooking);

  res.status(200).json({ theBooking: updatedBooking });
});

// Update booking payment status (Admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  console.log("Initiated", req);
  try {
    const { isPaid } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { isPaid },
      { new: true }
    );
    if (!updatedBooking)
      return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error });
  }
});

// Delete a booking (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking)
      return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error });
  }
});

module.exports = router;
