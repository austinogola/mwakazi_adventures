const mongoose = require("mongoose");

const ReceiptSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true,
  },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  itemDetails: {
    bookingType: {
      type: String,
      enum: ["trip", "accommodation"],
      required: true,
    },
    title: String,
    destination: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    guests: Number,
    days: Number,
  },
  paymentDetails: {
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    balance: { type: Number, required: true },
    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    orderTrackingId: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const AutoReceipt = mongoose.model("AutoReceipt", ReceiptSchema);
module.exports = AutoReceipt;
