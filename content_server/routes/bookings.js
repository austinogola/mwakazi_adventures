///////////////////////////////////////////////////////////////START HERE////////////////////////////////////////////////////////////////

const express = require("express");
const mongoose = require("mongoose");
const NewTrip = require("../models/NewTrip");
const Booking = require("../models/Booking");
const AutoReceipt = require("../models/automaticReceipt");
const Invoice = require("../models/Invoices");
const Accommodation = require("../models/Accommodation");
const { verifyToken, isAdmin } = require("../middleware/auth");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const {
  registerIPN,
  getAuthToken,
  startPaymentFlow,
  getOrderStatus,
} = require("../modules/pesapal");

// const validateBookingInput = [
//   body("customer.email").isEmail().normalizeEmail(),
//   body("customer.firstName").trim().notEmpty(),
//   body("customer.lastName").trim().notEmpty(),
//   body("customer.phone").trim().notEmpty(),
//   body("itemDetails.startDate").isISO8601(),
//   body("itemDetails.endDate").isISO8601(),
//   body("itemDetails.totalAmount").isFloat({ min: 0 }),
//   body("itemDetails.paymentAmount").isFloat({ min: 0 }),
//   body("itemDetails.bookingType").isIn(["trip", "accommodation"]),
// ];

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("trip")
      .populate("accommodation")
      .exec();

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
  const session = await mongoose.startSession();
  session.startTransaction();

  console.log("This is all the data from the frontend", req.body);

  try {
    const { customer, itemDetails } = req.body;

    if (!customer || !itemDetails) {
      return res.status(400).json({
        status: "fail",
        message: "Missing required booking information",
        details: {
          customer: customer ? "present" : "missing",
          itemDetails: itemDetails ? "present" : "missing",
        },
      });
    }

    const startDate = new Date(customer.startDate);
    const endDate = new Date(customer.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid date format",
        details: {
          startDate: customer.startDate,
          endDate: customer.endDate,
        },
      });
    }

    const existingInvoice = await findExistingInvoice(customer, itemDetails);
    if (existingInvoice) {
      return res.status(400).json({
        status: "fail",
        message: "An invoice already exists for this booking",
        invoiceId: existingInvoice._id,
      });
    }

    let newBooking;
    if (itemDetails.bookingType === "trip") {
      newBooking = await createTripBooking(itemDetails, customer, session);
    } else if (itemDetails.bookingType === "accommodation") {
      newBooking = await createAccommodationBooking(
        itemDetails,
        customer,
        session
      );
    } else {
      throw new Error(`Invalid booking type: ${itemDetails.bookingType}`);
    }

    if (!newBooking) {
      throw new Error("Failed to create booking");
    }

    const pesaPalResponse = await startPaymentFlow(newBooking);
    if (!pesaPalResponse || pesaPalResponse.error) {
      throw new Error(
        pesaPalResponse?.error || "Payment initialization failed"
      );
    }

    newBooking.orderId = pesaPalResponse.order_tracking_id;
    await newBooking.save({ session });

    const newInvoice = await createNewInvoice(
      customer,
      itemDetails,
      session,
      pesaPalResponse.order_tracking_id
    );

    const orderStatusResponse = await getOrderStatus(
      pesaPalResponse.order_tracking_id
    );
    const paymentStatus = orderStatusResponse?.payment_status_description;
    const isPaid = paymentStatus?.toUpperCase() === "COMPLETED";

    await Booking.findByIdAndUpdate(newBooking._id, { isPaid }, { session });

    await Invoice.findByIdAndUpdate(
      newInvoice._id,
      {
        $set: {
          "installment.$[elem].isPaid": isPaid,
        },
      },
      {
        arrayFilters: [
          { "elem.order_tracking_id": pesaPalResponse.order_tracking_id },
        ],
        session,
      }
    );

    const updatedBooking = await Booking.findById(newBooking._id).session(
      session
    );
    const updatedInvoice = await Invoice.findById(newInvoice._id).session(
      session
    );

    const newReceipt = await createNewReceipt(
      customer,
      itemDetails,
      updatedBooking,
      updatedInvoice,
      pesaPalResponse.order_tracking_id,
      isPaid,
      session
    );

    try {
      await Promise.all([
        sendReceiptEmail(customer, newReceipt, isPaid),
        sendBookingEmail(customer, itemDetails, isPaid),
        sendInvoiceEmail(customer, updatedInvoice, isPaid),
      ]);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    await session.commitTransaction();

    return res.status(200).json({
      status: "success",
      message: "Booking made and invoice created",
      booking: updatedBooking,
      invoice: updatedInvoice,
      receipt: newReceipt,
      payment_obj: pesaPalResponse,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error processing booking:", error);

    return res.status(500).json({
      status: "fail",
      message: "Error processing booking request",
      error: {
        type: error.name,
        message: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
    });
  } finally {
    session.endSession();
  }
});

async function createTripBooking(itemDetails, customer, session) {
  const theTrip = await NewTrip.findById(itemDetails._id);
  if (!theTrip) {
    throw new Error("Trip not found");
  }

  const booking = new Booking({
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
  });

  await booking.save({ session });
  return booking;
}

async function createAccommodationBooking(itemDetails, customer, session) {
  const theAccommodation = await Accommodation.findById(itemDetails._id);
  if (!theAccommodation) {
    throw new Error("Accommodation not found");
  }

  const isAvailable = await checkAccommodationAvailability(
    theAccommodation,
    customer.startDate,
    customer.endDate
  );

  if (!isAvailable) {
    throw new Error("Accommodation is not available for the selected dates");
  }

  const booking = new Booking({
    accommodation: theAccommodation,
    item_details: {
      type: "accommodation",
      title: `Accommodation at ${theAccommodation.location} for ${itemDetails.days} days`,
      days: itemDetails.days,
      total_price: itemDetails.paymentAmount,
      startDate: customer.startDate,
      endDate: customer.endDate,
    },
    amount: itemDetails.totalAmount,
    currency: "USD",
    created_at: new Date().getTime(),
    customer,
  });

  await booking.save({ session });
  return booking;
}

async function checkAccommodationAvailability(
  accommodation,
  startDate,
  endDate
) {
  const existingBookings = await Booking.find({
    accommodation: accommodation._id,
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      },
    ],
  });

  return existingBookings.length === 0;
}

async function findExistingInvoice(customer, itemDetails) {
  const query = {
    recipientEmail: customer.email,
    startDate: new Date(customer.startDate),
    endDate: new Date(customer.endDate),
  };

  if (itemDetails.bookingType === "trip") {
    query.title = itemDetails.title;
  } else {
    query.destination = itemDetails.destination;
  }

  return await Invoice.findOne(query);
}

async function createNewInvoice(
  customer,
  itemDetails,
  session,
  invoiceOrderTrackingId
) {
  const newInvoiceData = {
    recipientEmail: customer.email,
    startDate: new Date(customer.startDate),
    endDate: new Date(customer.endDate),
    installment: [
      {
        paymentMethod: itemDetails.formDataBooking.payment,
        percentage: itemDetails.formDataBooking.depositPercentage,
        payableAmount: itemDetails.paymentAmount,
        order_tracking_id: invoiceOrderTrackingId,
      },
    ],
    title:
      itemDetails.title ||
      `Staycation Accommodation at ${itemDetails.location}`,
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
  await newInvoice.save({ session });
  return newInvoice;
}

async function createNewReceipt(
  customer,
  itemDetails,
  booking,
  invoice,
  orderTrackingId,
  isPaid,
  session
) {
  const receipt = new AutoReceipt({
    bookingId: booking._id,
    invoiceId: invoice._id,
    customer: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
    },
    itemDetails: {
      bookingType: itemDetails.bookingType,
      title: itemDetails.bookingType === "trip" ? itemDetails.title : undefined,
      destination:
        itemDetails.bookingType === "accommodation"
          ? itemDetails.destination
          : undefined,
      startDate: new Date(customer.startDate),
      endDate: new Date(customer.endDate),
      guests:
        itemDetails.bookingType === "trip" ? itemDetails.guests : undefined,
      days:
        itemDetails.bookingType === "accommodation"
          ? itemDetails.days
          : undefined,
    },
    paymentDetails: {
      totalAmount: itemDetails.totalAmount,
      paidAmount: itemDetails.paymentAmount,
      balance: itemDetails.totalAmount - itemDetails.paymentAmount,
      paymentMethod: itemDetails.formDataBooking.payment,
      paymentStatus: isPaid ? "completed" : "pending",
      orderTrackingId,
    },
  });

  await receipt.save({ session });
  return receipt;
}

const createEmailTransporter = () => {
  try {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } catch (error) {
    console.error("Failed to create email transporter:", error);
    throw new Error("Email service configuration failed");
  }
};

async function sendInvoiceEmail(customer, invoice) {
  const transporter = createEmailTransporter();
  const emailContent = generateInvoiceEmailContent(invoice);

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: customer.email,
    subject: `Invoice for your booking - ${invoice.title}`,
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending invoice email:", error);
    throw new Error("Failed to send invoice email");
  }
}

async function sendBookingEmail(customer, itemDetails) {
  const transporter = createEmailTransporter();
  const emailContent = generateBookingEmailContent(customer, itemDetails);

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: customer.email,
    subject: `Booking Confirmation - ${itemDetails.title}`,
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending receipt email:", error);
    throw new Error("Failed to send receipt email");
  }
}

// Modify the sendReceiptEmail function
async function sendReceiptEmail(customer, receipt) {
  const transporter = createEmailTransporter();
  const emailContent = generateReceiptEmailContent(receipt);

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: customer.email,
    subject: `Payment Receipt - ${
      receipt.itemDetails.title || receipt.itemDetails.destination
    }`,
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending receipt email:", error);
    throw new Error("Failed to send receipt email");
  }
}

// Add the generateReceiptEmailContent function
function generateReceiptEmailContent(receipt) {
  const formatDate = (date) => new Date(date).toLocaleDateString();
  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px;">
      <h2 style="color: #4CAF50; text-align: center;">Payment Receipt</h2>
      
      <div style="text-align: right; margin-bottom: 20px;">
        <p><strong>Receipt Date:</strong> ${formatDate(receipt.createdAt)}</p>
        <p><strong>Receipt ID:</strong> ${receipt._id}</p>
      </div>

      <div style="border-bottom: 2px solid #e0e0e0; margin-bottom: 20px;">
        <h3 style="color: #333;">Customer Information</h3>
        <p><strong>Name:</strong> ${receipt.customer.firstName} ${
    receipt.customer.lastName
  }</p>
        <p><strong>Email:</strong> ${receipt.customer.email}</p>
        <p><strong>Phone:</strong> ${receipt.customer.phone}</p>
      </div>

      <div style="border-bottom: 2px solid #e0e0e0; margin-bottom: 20px;">
        <h3 style="color: #333;">Booking Details</h3>
        <p><strong>Type:</strong> ${receipt.itemDetails.bookingType}</p>
        ${
          receipt.itemDetails.title
            ? `<p><strong>Trip:</strong> ${receipt.itemDetails.title}</p>`
            : ""
        }
        ${
          receipt.itemDetails.destination
            ? `<p><strong>Destination:</strong> ${receipt.itemDetails.destination}</p>`
            : ""
        }
        <p><strong>Period:</strong> ${formatDate(
          receipt.itemDetails.startDate
        )} to ${formatDate(receipt.itemDetails.endDate)}</p>
        ${
          receipt.itemDetails.guests
            ? `<p><strong>Number of Guests:</strong> ${receipt.itemDetails.guests}</p>`
            : ""
        }
        ${
          receipt.itemDetails.days
            ? `<p><strong>Number of Days:</strong> ${receipt.itemDetails.days}</p>`
            : ""
        }
      </div>

      <div style="border-bottom: 2px solid #e0e0e0; margin-bottom: 20px;">
        <h3 style="color: #333;">Payment Information</h3>
        <p><strong>Total Amount:</strong> ${formatCurrency(
          receipt.paymentDetails.totalAmount
        )}</p>
        <p><strong>Amount Paid:</strong> ${formatCurrency(
          receipt.paymentDetails.paidAmount
        )}</p>
        <p><strong>Balance:</strong> ${formatCurrency(
          receipt.paymentDetails.balance
        )}</p>
        <p><strong>Payment Method:</strong> ${
          receipt.paymentDetails.paymentMethod
        }</p>
        <p><strong>Payment Status:</strong> <span style="color: ${
          receipt.paymentDetails.paymentStatus === "completed"
            ? "#4CAF50"
            : "#FFA500"
        }">${receipt.paymentDetails.paymentStatus.toUpperCase()}</span></p>
      </div>

      <footer style="text-align: center; color: #666; font-size: 14px;">
        <p>Thank you for your business!</p>
        <p>Mwakazi Adventures</p>
        <p>info@mwakaziadventures.com</p>
      </footer>
    </div>
  `;
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

function generateBookingEmailContent(customer, itemDetails, isPaid) {
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
          <p>If you have any questions, feel free to contact us at <a href="info@mwakaziadventures.com">info@mwakaziadventures.com</a>.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <footer style="text-align: center;">
              <p style="font-size: 12px; color: #888;">mwakaziadventures.com | Booking Services</p>
              <p style="font-size: 12px; color: #888;">For any inquiries, email us at <a href="info@mwakaziadventures.com" style="color: #4CAF50;">info@mwakaziadventures.com</a>.</p>
          </footer>
      </div>`;
}

module.exports = router;
