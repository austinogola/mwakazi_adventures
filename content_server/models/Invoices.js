const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
  recipientName: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  phoneNumber: { type: String },
  status: { type: String, default: "pending" },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  subject: { type: String, required: true },
  description: { type: String },
  installment: {
    amount: { type: Number, require: true },
    datePaid: { type: Date },
  },
  referenceNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
  totalAmount: { type: Number, require: true },
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
