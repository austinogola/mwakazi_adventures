const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  voucherNumber: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Voucher", voucherSchema);
