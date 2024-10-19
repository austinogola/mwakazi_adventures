const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoices");
const { body, validationResult } = require("express-validator");

router.post(
  "/create-invoice",
  [
    body("recipientName").not().isEmpty(),
    body("recipientEmail").isEmail(),
    body("totalAmount").isNumeric(),
    body("dueDate").isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      recipientName,
      recipientEmail,
      phoneNumber,
      totalAmount,
      dueDate,
      subject,
      description,
      referenceNumber,
    } = req.body;

    try {
      const newInvoice = new Invoice({
        recipientName,
        recipientEmail,
        phoneNumber,
        totalAmount,
        dueDate,
        subject,
        description,
        referenceNumber,
      });

      await newInvoice.save();

      res.status(201).json({
        message: "Invoice created successfully",
        invoice: newInvoice,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error: Unable to fetch invoices" });
  }
});

module.exports = router;
