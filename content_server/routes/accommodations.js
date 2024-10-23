const express = require("express");
const router = express.Router();
const Accommodation = require("../models/Accommodation");

router.post("/create-accommodation", async (req, res) => {
  try {
    const newAccommodation = new Accommodation(req.body);
    await newAccommodation.save();
    res.status(201).json({ message: "Accommodation created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create accommodation" });
  }
});

router.get("/", async (req, res) => {
  try {
    const accommodations = await Accommodation.find({});
    res.status(200).send(accommodations);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  console.log("Route reached for accommodation ID:", req.params.id);
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found." });
    }

    res.status(200).json(accommodation);
  } catch (error) {
    console.error("Error fetching accommodation:", error);
    res.status(500).json({
      message: "An error occurred while fetching the accommodation details.",
      error: error.message,
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!accommodation) {
      return res.status(404).send();
    }
    res.status(200).send(accommodation);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndDelete(req.params.id);
    if (!accommodation) {
      return res.status(404).send();
    }
    res.status(200).send(accommodation);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
