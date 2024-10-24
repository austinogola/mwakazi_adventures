const express = require("express");
const router = express.Router();
const Receipt = require("../models/Receipt");

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

    if (!clientName || !clientEmail || !totalAmount || !paymentStatus) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const receipt = new Receipt({
      clientName,
      clientEmail,
      totalAmount,
      paymentStatus,
      paymentMethod,
      notes,
      ...(tripData && {
        tripTitle: tripData.title,
        tripDestination: tripData.destination,
        tripDuration: {
          number: tripData.durationNumber,
          period: tripData.durationPeriod,
        },
        tripGuests: tripData.guests,
        tripPrice: tripData.price,
      }),
      ...(accommodationData && {
        accommodationDescription: accommodationData.description,
        accommodationLocation: accommodationData.location,
        accommodationDays: accommodationData.days,
        accommodationDailyRate: accommodationData.dailyRate,
      }),
    });

    await receipt.save();

    return res.status(201).json(receipt);
  } catch (error) {
    console.error("Error saving receipt:", error);
    return res
      .status(500)
      .json({ message: "Error saving receipt. Please try again." });
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
