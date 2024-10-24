const express = require("express");
const NewTrip = require("../models/NewTrip");
const Booking = require("../models/Booking");
const Invoice = require("../models/Invoices");
const Accommodation = require("../models/Accommodation");
const { verifyToken, isAdmin } = require("../middleware/auth");
const nodemailer = require("nodemailer");
const router = express.Router();
const {
  registerIPN,
  getAuthToken,
  startPaymentFlow,
  getOrderStatus,
} = require("../modules/pesapal");

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().exec();
    return res.status(200).json({
      message: "Bookings retrieved successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error retrieving bookings:", error.message);
    return res.status(500).json({
      message: "Error retrieving bookings",
      error: error.message,
    });
  }
});

router.post("/init", async (req, res) => {
  try {
    const { isPaid, customer, itemDetails } = req.body;
    console.log("Payment info received:", req.body);

    const existingInvoice = await findExistingInvoice(customer, itemDetails);
    if (existingInvoice) {
      return res.status(400).json({
        message:
          "An invoice already exists for this booking. Cannot create duplicate invoices.",
        invoiceId: existingInvoice._id,
      });
    }

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
      return res.status(400).json({
        message: "Trip or Accommodation must be provided",
      });
    }

    await newBooking.save();

    let pesaPalFdBack = await startPaymentFlow(newBooking);
    if (pesaPalFdBack.error) {
      return res.status(500).json({
        message: "Order could not be made",
        status: "fail",
      });
    }

    newBooking.orderId = pesaPalFdBack.order_tracking_id;
    await newBooking.save();

    const newInvoice = await createNewInvoice(customer, itemDetails);

    await Promise.all([
      sendReceiptEmail(customer, itemDetails, isPaid),
      sendInvoiceEmail(customer, newInvoice),
    ]);

    return res.status(200).json({
      message: "Booking made and invoice created",
      status: "success",
      newBooking,
      invoice: newInvoice,
      payment_obj: pesaPalFdBack,
    });
  } catch (error) {
    console.error("Error processing request:", error);
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
    startDate: itemDetails.startDate,
    endDate: itemDetails.endDate,
    amount: itemDetails.totalAmount,
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
    amount: itemDetails.totalAmount,
    currency: "USD",
    created_at: new Date().getTime(),
    customer,
  });
}

async function findExistingInvoice(customer, itemDetails) {
  return await Invoice.findOne({
    recipientEmail: customer.email,
    title: itemDetails.bookingType === "trip" ? itemDetails.title : undefined,
    destination:
      itemDetails.bookingType === "accommodation"
        ? itemDetails.destination
        : undefined,
    startDate: new Date(customer.startDate),
    endDate: new Date(customer.endDate),
  });
}

async function createNewInvoice(customer, itemDetails) {
  const newInvoiceData = {
    recipientEmail: customer.email,
    startDate: new Date(customer.startDate),
    endDate: new Date(customer.endDate),
    installment: [
      {
        paymentMethod: itemDetails.formDataBooking.paymentMethod,
        percentage: itemDetails.formDataBooking.depositPercentage,
        payableAmount: itemDetails.paymentAmount,
        isPaid: false,
      },
    ],
    title: itemDetails.title,
    totalAmount: itemDetails.totalAmount,
    recipientFirstName: customer.firstName,
    recipientLastName: customer.lastName,
    recipientPhone: customer.phone,
  };

  if (itemDetails.bookingType === "trip") {
    newInvoiceData.guests = itemDetails.formDataBooking.guests;
    newInvoiceData.tripCost = itemDetails.price;
  } else {
    newInvoiceData.days = itemDetails.formDataBooking.days;
    newInvoiceData.dailyRate = itemDetails.dailyRate;
  }

  const newInvoice = new Invoice(newInvoiceData);
  await newInvoice.save();
  return newInvoice;
}

async function sendInvoiceEmail(customer, invoice) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const emailContent = generateInvoiceEmailContent(invoice);
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: customer.recipientEmail,
    subject: `Invoice for your payment`,
    html: emailContent,
  };

  return transporter.sendMail(mailOptions).catch((err) => {
    console.error("Error sending receipt email:", err.message);
    throw new Error("Error sending receipt email");
  });
}

function generateInvoiceEmailContent(invoice) {
  const installments = invoice.installment
    .map(
      (inst) => `
      <tr>
        <td>${inst.paymentMethod}</td>
        <td>${inst.percentage}%</td>
        <td>$${inst.payableAmount.toFixed(2)}</td>
        <td style="color: ${inst.isPaid ? "green" : "red"};">
          ${inst.isPaid ? "Paid" : "Not Paid"}
        </td>
      </tr>
    `
    )
    .join("");

  const totalPaid = invoice.installment.reduce(
    (acc, inst) => acc + inst.payableAmount,
    0
  );
  const balance = invoice.totalAmount - totalPaid;

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #333;">Invoice</h2>
      <h3 style="color: #555;">Dear ${invoice.recipientName},</h3>
      <p>Thank you for your payment. Below are the details of your invoice:</p>
      <p><strong>Invoice Title:</strong> ${invoice.title}</p>
      <p><strong>Email:</strong> ${invoice.recipientEmail}</p>
      <p><strong>Phone:</strong> ${invoice.recipientPhone}</p>
      <p><strong>Period:</strong> ${new Date(
        invoice.startDate
      ).toLocaleDateString()} to ${new Date(
    invoice.endDate
  ).toLocaleDateString()}</p>
      <h4 style="color: #333;">Installments</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; border: 1px solid #ddd;">Payment Method</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Percentage</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Amount</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${installments}
        </tbody>
      </table>
      <h4 style="color: #333;">Total Amount Paid: $${totalPaid.toFixed(2)}</h4>
      <h4 style="color: #333;">Balance: $${balance.toFixed(2)}</h4>
      <p>If you have any questions, please feel free to contact us.</p>
      <p>Best regards,<br>Mwakazi Adventures</p>
    </div>
  `;
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

  const emailContent = generateBookingEmailContent(
    customer,
    itemDetails,
    isPaid
  );
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

// router.post("/status/:id", async (req, res) => {
//   const { OrderTrackingId, OrderMerchantReference } = req.body;
//   let status = await getOrderStatus(OrderTrackingId);
//   console.log(status);
//   let { payment_method, payment_status_description, error } = status;

//   let isPaid = false;
//   let updatedBooking;
//   console.log(payment_method, payment_status_description, error);
//   if (!error) {
//     isPaid = true;
//     updatedBooking = await Booking.findByIdAndUpdate(
//       OrderMerchantReference,
//       { isPaid, payment_method, payment_status: payment_status_description },
//       { new: true }
//     );
//   } else {
//     let payment_status = error.message;
//     updatedBooking = await Booking.findByIdAndUpdate(
//       OrderMerchantReference,
//       { isPaid, payment_method, payment_status },
//       { new: true }
//     );
//   }
//   updatedBooking.save();

//   console.log(updatedBooking);

//   res.status(200).json({ theBooking: updatedBooking });
// });
