const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
    },
    paymentMethod: { type: String },
    notes: { type: String },
    tripTitle: { type: String },
    tripDestination: { type: String },
    tripDuration: {
      number: { type: Number },
      period: { type: String, enum: ["days", "weeks"] },
    },
    tripGuests: { type: Number },
    tripPrice: { type: Number },
    accommodationDescription: { type: String },
    accommodationLocation: { type: String },
    accommodationDays: { type: Number },
    accommodationDailyRate: { type: Number },
  },
  { timestamps: true }
);

const Receipt = mongoose.model("Receipt", receiptSchema);

module.exports = Receipt;
