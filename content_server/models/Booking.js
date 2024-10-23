const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NewTrip",
    required: function () {
      return this.item_details.type === "trip";
    },
  },
  accommodation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accommodation",
    required: function () {
      return this.item_details.type === "accommodation";
    },
  },
  item_details: {
    type: {
      type: String,
      enum: ["trip", "accommodation"],
      required: true,
    },
    title: { type: String, required: true },
    guests: {
      type: Number,
      required: function () {
        return this.type === "trip";
      },
    },
    days: {
      type: Number,
      required: function () {
        return this.type === "accommodation";
      },
    },
    total_price: { type: Number, required: true },
    startDate: {
      type: Date,
      required: function () {
        return this.type === "accommodation";
      },
    },
    endDate: {
      type: Date,
      required: function () {
        return this.type === "accommodation";
      },
    },
  },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  created_at: { type: Date, default: Date.now },
  isPaid: { type: Boolean, default: false },
  orderId: { type: String },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
