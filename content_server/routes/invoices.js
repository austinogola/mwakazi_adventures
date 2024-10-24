const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoices");
const nodemailer = require("nodemailer");

router.post("/create-invoice", async (req, res) => {
  console.log(req.body);
  const {
    bookingType,
    recipientEmail,
    startDate,
    endDate,
    paymentMethod,
    percentage,
    dailyRate,
    payableAmount,
    title,
    guests,
    tripCost,
    totalAmount,
    recipientName,
    recipientPhone,
    days,
  } = req.body;

  try {
    const existingInvoice = await Invoice.findOne({
      recipientEmail,
      title: bookingType === "trip" ? title : undefined,
      destination: bookingType === "accommodation" ? destination : undefined,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    if (existingInvoice) {
      const totalPaid = existingInvoice.installment
        .filter((inst) => inst.isPaid)
        .reduce((sum, inst) => sum + inst.payableAmount, 0);

      if (totalPaid + payableAmount > totalAmount) {
        return res.status(400).json({
          message: "The incoming payable amount exceeds the total amount.",
        });
      }

      existingInvoice.installment.push({
        paymentMethod,
        percentage,
        payableAmount,
        isPaid: false,
      });

      await existingInvoice.save();
      await sendInvoiceEmail(recipientEmail, existingInvoice);
      return res.status(200).json({
        message: "Installment added to existing invoice.",
        invoice: existingInvoice,
      });
    } else {
      const newInvoiceData = {
        recipientEmail,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        installment: [
          {
            paymentMethod,
            percentage,
            payableAmount,
            isPaid: false,
          },
        ],
        title,
        totalAmount,
        recipientName,
        recipientPhone,
      };

      if (bookingType === "trip") {
        newInvoiceData.guests = guests;
        newInvoiceData.tripCost = tripCost;
      } else {
        newInvoiceData.days = days;
        newInvoiceData.dailyRate = dailyRate;
      }

      const newInvoice = new Invoice(newInvoiceData);
      await newInvoice.save();
      await sendInvoiceEmail(recipientEmail, newInvoice);
      return res.status(201).json({
        message: "New invoice created.",
        invoice: newInvoice,
      });
    }
  } catch (error) {
    console.error("Error handling invoice:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing the invoice." });
  }

  async function sendInvoiceEmail(recipientEmail, invoice) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const emailContent = generateEmailContent(invoice);
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: recipientEmail,
      subject: `Invoice for your payment`,
      html: emailContent,
    };

    return transporter.sendMail(mailOptions).catch((err) => {
      console.error("Error sending receipt email:", err.message);
      throw new Error("Error sending receipt email");
    });
  }

  function generateEmailContent(invoice) {
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
        <h4 style="color: #333;">Total Amount Paid: $${totalPaid.toFixed(
          2
        )}</h4>
        <h4 style="color: #333;">Balance: $${balance.toFixed(2)}</h4>
        <p>If you have any questions, please feel free to contact us.</p>
        <p>Best regards,<br>Mwakazi Adventures</p>
      </div>
    `;
  }
});

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

function calculateTotalPaid(existingInvoice) {
  return existingInvoice.installment
    .filter((inst) => inst.isPaid)
    .reduce((sum, inst) => sum + inst.payableAmount, 0);
}

async function updateExistingInvoice(existingInvoice, itemDetails) {
  existingInvoice.installment.push({
    paymentMethod: itemDetails.formDataBooking.paymentMethod,
    percentage: itemDetails.formDataBooking.depositPercentage,
    payableAmount: itemDetails.paymentAmount,
    // isPaid: // To be determined by the getStatusUpdate function later,
  });

  await existingInvoice.save();
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
        // isPaid: false,
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
    newInvoiceData.dailyRate = itemDetails.dailyRate; // Confirm this
  }

  const newInvoice = new Invoice(newInvoiceData);
  await newInvoice.save();
  return newInvoice;
}

// router.post(
//   "/create-invoice",
//   [
//     body("recipientName").not().isEmpty(),
//     body("recipientEmail").isEmail(),
//     body("totalAmount").isNumeric(),
//     body("dueDate").isISO8601(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const {
//       recipientName,
//       recipientEmail,
//       phoneNumber,
//       totalAmount,
//       dueDate,
//       subject,
//       description,
//       referenceNumber,
//     } = req.body;

//     try {
//       const newInvoice = new Invoice({
//         recipientName,
//         recipientEmail,
//         phoneNumber,
//         totalAmount,
//         dueDate,
//         subject,
//         description,
//         referenceNumber,
//       });

//       await newInvoice.save();

//       res.status(201).json({
//         message: "Invoice created successfully",
//         invoice: newInvoice,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Server Error", error });
//     }
//   }
// );

router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error: Unable to fetch invoices" });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Invoice.deleteMany();
    res.status(200).json({ message: "All invoices deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete invoices" });
  }
});

module.exports = router;
