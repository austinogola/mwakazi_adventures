router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;

  console.log(email);
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    member.resetPasswordToken = resetToken;
    member.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await member.save();

    const transporter = nodemailer.createTransport({
      // service: 'Gmail',
      host: "mail.spacemail.com",
      port: 465,
      secure: true,
      name: "info@gazeguard.io",
      auth: {
        user: process.env.sender_Email,
        pass: process.env.email_pswd,
      },
    });

    // console.log(transporter);

    // http://${req.headers.host}/reset-password/${resetToken}\n\n
    const mailOptions = {
      to: email,
      from: "info@gazeguard.io",
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n
          ${process.env.web_app_host}/reset-password?token=${resetToken}\n
         
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    // console.log(mailOptions);
    transporter.sendMail(mailOptions, (err) => {
      console.log(err);
      if (err) {
        return res
          .status(500)
          .json({ message: "Error sending email", error: err.message });
      }
      res.status(200).json({ message: "Password reset email sent" });
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error processing request", error: err.message });
  }
});

const express = require("express");
const nodemailer = require("nodemailer");
const { Order } = require("./models/Order"); // Adjust model to your project's structure
const router = express.Router();

router.post("/purchase", async (req, res) => {
  const { email, items, totalAmount, orderId } = req.body;

  // Ensure required fields are present
  if (!email || !items || !totalAmount || !orderId) {
    return res.status(400).json({ message: "Missing purchase information" });
  }

  try {
    // Logic to save the order to the database (adjust according to your schema)
    const newOrder = new Order({
      email,
      items,
      totalAmount,
      orderId,
      purchaseDate: new Date(),
    });
    await newOrder.save();

    // Create email content (customize the receipt template)
    const itemList = items
      .map((item) => `- ${item.name} (x${item.quantity}) - $${item.price}`)
      .join("\n");

    const emailContent = `
      Thank you for your purchase!
      
      Order ID: ${orderId}
      Total: $${totalAmount}
      
      Items purchased:
      ${itemList}

      We appreciate your business and hope you enjoy your items.
      
      If you have any questions, feel free to contact us at support@yourstore.com.
    `;

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // Use your SMTP host
      port: process.env.SMTP_PORT || 465, // SMTP port
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL, // Your SMTP email
        pass: process.env.SMTP_PASSWORD, // Your SMTP password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.SENDER_EMAIL || "no-reply@yourstore.com",
      to: email,
      subject: `Receipt for your purchase - Order #${orderId}`,
      text: emailContent,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error sending receipt email", error: err.message });
      }
      res.status(200).json({ message: "Purchase completed, receipt sent" });
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error processing purchase", error: err.message });
  }
});

module.exports = router;

const emailContent = `
  <h1>Thank you for your purchase!</h1>
  <p>Order ID: ${orderId}</p>
  <p>Total: $${totalAmount}</p>
  <h3>Items purchased:</h3>
  <ul>
    ${items
      .map(
        (item) => `<li>${item.name} (x${item.quantity}) - $${item.price}</li>`
      )
      .join("")}
  </ul>
  <p>We appreciate your business and hope you enjoy your items.</p>
  <p>If you have any questions, feel free to contact us at support@yourstore.com.</p>
`;
