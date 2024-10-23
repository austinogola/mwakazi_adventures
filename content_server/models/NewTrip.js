const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
  },
  places_visited: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },
  ],
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  duration: {
    number: { type: Number, required: true },
    period: { type: String, required: true, enum: ["days", "weeks"] },
  },
  highlights: [String],
  inclusives: [String],
  exclusives: [String],
  images: [{ type: String }],
  dates: [Date],
  description: { type: String },
  catch_phrase: { type: String },
  itinerary: [
    {
      title: String,
      points: [String],
    },
  ],
  categories: [String],
  blog_contents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
  price: { type: Number, required: true },
  rating: { type: Number, default: 1 },
});

// Middleware to calculate the endDate based on startDate and duration before saving
tripSchema.pre("save", function (next) {
  if (this.startDate && this.duration) {
    const { number, period } = this.duration;
    let endDate = new Date(this.startDate);

    // Calculate endDate based on period (days or weeks)
    if (period === "days") {
      endDate.setDate(endDate.getDate() + number);
    } else if (period === "weeks") {
      endDate.setDate(endDate.getDate() + number * 7);
    }

    this.endDate = endDate;
  }
  next();
});

const NewTrip = mongoose.model("NewTrip", tripSchema);
module.exports = NewTrip;
