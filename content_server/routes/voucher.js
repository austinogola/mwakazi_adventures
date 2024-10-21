const express = require("express");
const router = express.Router();
const Voucher = require("../models/Voucher");

router.post("/create", async (req, res) => {
  const { amount, code, expiry } = req.body;

  try {
    const lastVoucher = await Voucher.findOne().sort({ voucherNumber: -1 });

    let newVoucherNumber = lastVoucher
      ? (parseInt(lastVoucher.voucherNumber) + 1).toString().padStart(4, "0")
      : "0001";

    const voucher = new Voucher({
      amount,
      code,
      expiry,
      voucherNumber: newVoucherNumber,
    });

    await voucher.save();

    res.status(201).json({
      message: "Voucher created successfully",
      voucher,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Voucher code or number already exists",
      });
    }
    res.status(500).json({
      message: "Server error, could not create voucher",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
