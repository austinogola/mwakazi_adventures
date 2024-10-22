const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  bookingType: {
    //constant
    type: String,
    enum: ["trip", "accommodation"],
    required: true,
    default: "trip",
  },
  installment: [
    {
      paymentMethod: {
        //not constant
        type: String,
        enum: ["credit", "debit", "paypal", "mpesa"],
        required: true,
      },
      percentage: {
        //not constant
        type: Number,
        enum: [100, 75, 50, 25],
        default: 100,
      },
      payableAmount: {
        //not constant
        type: Number,
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
    //constant
    type: Number,
    default: 1,
    min: 1,
  },
  startDate: {
    //constant
    type: Date,
    required: true,
  },
  endDate: {
    //constant
    type: Date,
    required: true,
  },

  recipientName: {
    //constant
    type: String,
    required: true,
  },
  recipientEmail: {
    //constant
    type: String,
    required: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  recipientPhone: {
    //constant
    type: String,
    required: true,
  },

  totalAmount: {
    //constant
    type: Number,
    required: true,
  },

  // Auto-calculated fields
  sumTotalAmount: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },

  createdAt: {
    //constant
    type: Date,
    default: Date.now,
  },
});

invoiceSchema.pre("save", function (next) {
  this.sumTotalAmount = this.installment.reduce(
    (sum, inst) => sum + inst.payableAmount,
    0
  );

  this.balance = this.sumTotalAmount - this.totalAmount;

  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
