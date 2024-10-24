const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  bookingType: {
    type: String,
    enum: ["trip", "accommodation"],
    required: true,
    default: "trip",
  },
  installment: [
    {
      paymentMethod: {
        type: String,
        enum: ["credit", "debit", "paypal", "mpesa"],
        required: true,
      },
      percentage: {
        type: Number,
        enum: [100, 75, 50, 25],
        default: 100,
      },
      payableAmount: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      order_tracking_id: {
        type: String,
        required: true,
      },
    },
  ],
  title: {
    type: String,
    required: true,
  },
  guests: {
    type: Number,
    default: 1,
    min: 1,
  },
  tripCost: {
    type: Number,
  },
  dailyRate: {
    type: Number,
  },
  days: {
    type: Number,
    default: 1,
    min: 1,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },

  destination: { type: String },

  recipientFirstName: {
    type: String,
    required: true,
  },

  recipientLastName: {
    type: String,
    required: true,
  },

  recipientEmail: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  recipientPhone: {
    type: String,
    required: true,
  },

  totalAmount: {
    type: Number,
    required: true,
  },

  sumTotalAmount: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

invoiceSchema.pre("save", function (next) {
  this.sumTotalAmount = this.installment
    .filter((inst) => inst.isPaid)
    .reduce((sum, inst) => sum + inst.payableAmount, 0);

  this.balance = this.totalAmount - this.sumTotalAmount;

  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
