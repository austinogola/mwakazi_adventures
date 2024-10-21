const express = require("express");
const router = express.Router();
const Receipt = require("../models/Receipt");
const NewTrip = require("../models/NewTrip");
const Accommodation = require("../models/Accommodation");

router.post("/create", async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      totalAmount,
      paymentStatus,
      paymentMethod,
      notes,
      tripData,
      accommodationData,
    } = req.body;

    const receiptData = {
      clientName,
      clientEmail,
      totalAmount,
      paymentStatus,
      paymentMethod,
      notes,
      ...(tripData && {
        tripTitle: tripData.title,
        tripDestination: tripData.destination,
        tripDuration: tripData.duration,
        tripGuests: tripData.guests,
        tripPrice: tripData.price,
      }),
      ...(accommodationData && {
        accommodationDescription: accommodationData.description,
        accommodationLocation: accommodationData.location,
        accommodationDays: accommodationData.days,
        accommodationDailyRate: accommodationData.dailyRate,
      }),
    };

    const receipt = await Receipt.create(receiptData);
    return res.status(201).json(receipt);
  } catch (error) {
    console.error("Error creating receipt:", error);
    return res
      .status(500)
      .json({ message: "Error creating receipt. Please try again." });
  }
});

router.get("/", async (req, res) => {
  try {
    const receipts = await Receipt.find();
    res.status(200).json(receipts);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
